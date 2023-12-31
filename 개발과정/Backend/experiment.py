import os
current_directory = os.getcwd()
k = os.listdir(current_directory+"\\cloud api key")
path = current_directory + "\\cloud api key\\" + k[0] #디렉토리에서 api key 파일 위치에 따라 안될 수도 있음
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path

import torch
import sys
import vertexai
import pg8000
from google.cloud.sql.connector import Connector, IPTypes
import sqlalchemy
from transformers import AutoModel, AutoTokenizer
from vertexai.preview.language_models import ChatModel, InputOutputTextPair, ChatMessage
# TextGenerationModel, InputOutputTextPair, TextEmbeddingModel

PROJECT_ID = "esoteric-stream-399606"
LOCATION = "us-central1"
vertexai.init(project=PROJECT_ID, location=LOCATION)

def get_KoSimCSE(): # word embedding 함수
    model = AutoModel.from_pretrained('BM-K/KoSimCSE-roberta-multitask')
    tokenizer = AutoTokenizer.from_pretrained('BM-K/KoSimCSE-roberta-multitask')

    return model, tokenizer

def cal_score(a, b):
    if len(a.shape) == 1: a = a.unsqueeze(0)
    if len(b.shape) == 1: b = b.unsqueeze(0)

    a_norm = a / a.norm(dim=1)[:, None]
    b_norm = b / b.norm(dim=1)[:, None]
    return torch.mm(a_norm, b_norm.transpose(0, 1)) * 100

def extract(q): #LLM의 output으로부터 prof name, lecture name 추출
        lec = q.find("과목명")
        prof = q.find("교수명")
        q_start = q.find("질문 내용")

        lecture = q[lec+4:prof-1]
        professor = q[prof+4:]
        query = q[q_start+6:]
        if lecture == "NULL" : lecture = None
        if professor == "NULL" : professor = None
        return lecture, professor, query

model, tokenizer = get_KoSimCSE()

# VectorDB 연결
instance_connection_name = "esoteric-stream-399606:asia-northeast3:wjdfoek3"
db_user = "postgres"
db_pass = "pgvectorwjdfo"
db_name = "pgvector"

# initialize Cloud SQL Python Connector object
connector = Connector()

def getconn() -> pg8000.dbapi.Connection:
            conn: pg8000.dbapi.Connection = connector.connect(
                instance_connection_name,
                "pg8000",
                user=db_user,
                password=db_pass,
                db=db_name,
                ip_type=IPTypes.PUBLIC,
            )
            return conn

pool = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=getconn,
)

with pool.connect() as db_conn:
    db_conn.execute(
    sqlalchemy.text(
        "CREATE EXTENSION IF NOT EXISTS vector with schema public"
    )
)
db_conn.commit()

inputs = tokenizer("수업 어때?", padding=True, truncation=True, return_tensors="pt")

embeddings, _ = model(**inputs, return_dict=False)
option1 = embeddings[0][0]

inputs = tokenizer("수업 뭐있어?", padding=True, truncation=True, return_tensors="pt")

embeddings, _ = model(**inputs, return_dict=False)
option2 = embeddings[0][0]

chat_model = ChatModel.from_pretrained("chat-bison@001")  #chat model 불러오기
chat = chat_model.start_chat(
        context="수업에 대해 궁금해하는 학생들이 과목, 교수에 대해 질문하는 서비스야. 강의평과 관련된 질문이면 질문 내용에 질문을 출력해주고 아니면 그냥 NULL을 출력해줘",
        examples=[
            InputOutputTextPair(
                input_text="정기숙 교수님 자료구조응용 수업 어때?에서 과목명, 교수명, 질문 내용이 뭐야?",
                output_text="과목명 자료구조응용 교수명 정기숙 질문 내용 수업이 어떤지 물어보는 내용",
            ),
            InputOutputTextPair(
                input_text="정기숙 교수님 어때?에서 과목명, 교수명, 질문내용이 뭐야?",
                output_text="과목명 NULL 교수명 정기숙 질문 내용 교수님이 어떤지 물어보는 내용",
            ),
            InputOutputTextPair(
                input_text="자료구조응용 수업 어때?에서 과목명, 교수명, 질문내용이 뭐야?",
                output_text="과목명 자료구조응용 교수명 NULL 질문 내용 수업이 어떤지 물어보는 내용",
            ),
            InputOutputTextPair(
                input_text="과제 어떻고 수업 어때?에서 과목명, 교수명, 질문 내용이 뭐야?",
                output_text="질문 내용 과제가 어떻고 수업이 어떤지 물어보는 내용",
            ),
            InputOutputTextPair(
                input_text="강의평과 관련 없는 질문",
                output_text="NULL",
            ),
        ],
        temperature=0.0,
        max_output_tokens=1024,
        top_p=0.5,
        top_k=1
        )
# recommendation_chat = ChatModel.from_pretrained("chat-bison@001")
output_model = ChatModel.from_pretrained("chat-bison@001")

with pool.connect() as db_conn: # 쿼리 실행문
            result = db_conn.execute(
                sqlalchemy.text("select distinct info from PROFNLEC")
            ).fetchall()

info = []
for res in result :
    inputs = tokenizer(res[0], padding=True, truncation=True, return_tensors="pt")
    embeddings, _ = model(**inputs, return_dict=False)
    info.append((embeddings[0][0], res[0]))

history = []

while True :
    query_text = input(" >> ")

    inputs = tokenizer(query_text, padding=True, truncation=True, return_tensors="pt")

    embeddings, _ = model(**inputs, return_dict=False)
    embedding_str = embeddings[0][0]

    if cal_score(embedding_str, option1) >= cal_score(embedding_str, option2) :
        print("수업 강의평 요약")

        #LLM에게 질문해서 user의 input으로부터 과목, 교수명 가져오기
        key_query = chat.send_message(query_text+"에서 과목명, 교수명, 질문 내용이 뭐야?").text

        if key_query == "NULL" :
            print("강의평과 관련된 내용을 입력하세요.")
            continue

        lec, prof, query = extract(key_query)
        inputs = tokenizer(query, padding=True, truncation=True, return_tensors="pt")

        embeddings, _ = model(**inputs, return_dict=False)
        embedding_arr = embeddings[0][0].detach().numpy()
        embedding_str = ",".join(str(x) for x in embedding_arr)
        embedding_str = "["+embedding_str+"]"

        if lec != None and prof != None :    #User의 질문 유형에 맞게 쿼리문 짜줌
            insert_stat, param = (sqlalchemy.text(
                        """SELECT origin_text, rating, assignment, team, grade, attendance, test FROM PROFNLEC WHERE INFO LIKE :information
                        ORDER BY v <-> :query_vec LIMIT 20"""   # <-> : L2 Distance,  <=> : Cosine Distance, <#> : inner product (음수 값을 return)
            ), {"information": f'%{lec}%{prof}%', "query_vec": embedding_str})
        elif lec != None :
            insert_stat, param = sqlalchemy.text(
                        """SELECT origin_text, rating, assignment, team, grade, attendance, test FROM PROFNLEC WHERE INFO LIKE :lecture
                        ORDER BY v <-> :query_vec LIMIT 20"""
            ), {"lecture": f'%{lec}%', "query_vec": embedding_str}
        elif prof != None :
            insert_stat, param = sqlalchemy.text(
                        """SELECT origin_text, rating, assignment, team, grade, attendance, test FROM PROFNLEC WHERE INFO LIKE :professor
                        ORDER BY v <-> :query_vec LIMIT 20"""
            ), {"professor": f'%{prof}%', "query_vec": embedding_str}

        with pool.connect() as db_conn: # 쿼리 실행문
            result = db_conn.execute(
                insert_stat, parameters = param
            ).fetchall()

        #query 결과를 문자열로 바꾸기 <- Context에는 문자열만 들어갈 수 있음
        articles = ""
        for res in result :
            articles += res[0]

        output_chat = output_model.start_chat(
            context="강의를 찾는 대학생들에게 강의평들을 토대로 수업이 어떤지 알려주는 서비스야, 주어진 강의평들을 요약해서 학생들에게 알려줘" + articles + "강의평을 가져올 때는 있는 그대로 가져오지 말고 나름대로 요약해서 알려주고 공손하게 알려줘",
            message_history = history,
            temperature=0.3,
            max_output_tokens=1024,
            top_p=0.8,
            top_k=10
        )

        output = output_chat.send_message(query_text).text

        history.append(ChatMessage(content = query_text, author = "user"))
        history.append(ChatMessage(content = output, author = "bot"))

        print(output)
    
    else :
        print("수업 추천")
        
        inputs = tokenizer(query_text, padding=True, truncation=True, return_tensors="pt")
        embeddings, _ = model(**inputs, return_dict=False)
        query, embedding_arr = embeddings[0][0], embeddings[0][0].detach().numpy()
        embedding_str = ",".join(str(x) for x in embedding_arr)
        embedding_str = "["+embedding_str+"]"

        insert_stat, param = (sqlalchemy.text(
                        """SELECT info as proflec, text as articles
                        FROM (
                            select r.info, r.text, v
                            from RECOMMENDATION r
                            order BY infov <=> :info_vec LIMIT 5
                        ) AS SUB_RECOMMENDATION
                        ORDER BY v <=> :query_vec LIMIT 3"""   # <-> : L2 Distance,  <=> : Cosine Distance, <#> : inner product (음수 값을 return)
            ), {"info_vec": embedding_str, "query_vec": embedding_str})

        with pool.connect() as db_conn: # 쿼리 실행문
            result = db_conn.execute(
                insert_stat, parameters = param
            ).fetchall()

        print(f"DB 쿼리 결과 : {len(result[0])}")

        for _ in result :
            print(_)
            
        #query 결과를 문자열로 바꾸기 <- Context에는 문자열만 들어갈 수 있음
        articles = ""
        for res in result :
            articles += res[0]

        output_chat = output_model.start_chat(
            context="강의를 찾는 대학생들에게 강의평들을 토대로 수업을 추천해주는 서비스야, 주어진 강의평들을 요약해서 학생들에게 알려줘" + articles + "강의평을 가져올 때는 있는 그대로 가져오지 말고 나름대로 요약해서 알려주고 공손하게 알려줘",
            message_history = history,
            temperature=0.3,
            max_output_tokens=1024,
            top_p=0.8,
            top_k=40
        )

        output = output_chat.send_message(query_text).text

        history.append(ChatMessage(content = query_text, author = "user"))
        history.append(ChatMessage(content = output, author = "bot"))

        print(output)