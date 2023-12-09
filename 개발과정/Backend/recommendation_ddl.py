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
import json

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

try :
    with pool.connect() as db_conn:
        db_conn.execute(
            sqlalchemy.text("drop table RECOMMENDATION")
        )
        db_conn.commit()
except :
    print("there is no table like \"RECOMMENDATION\"")

with pool.connect() as db_conn:
    db_conn.execute(
    sqlalchemy.text(
        """CREATE table RECOMMENDATION(
            info varchar(100) PRIMARY KEY,
            text varchar(4096),
            v vector(768))
        """
    )
    )
    db_conn.commit()

with pool.connect() as db_conn:
    information = db_conn.execute(
        sqlalchemy.text(
            "select distinct info from PROFNLEC"
        )
    )
    
a = []
for info in information :
    a.append(info[0])

for info in a :
    with pool.connect() as db_conn:
        result = db_conn.execute(
            sqlalchemy.text(
                "select origin_text from PROFNLEC where info LIKE \'" + info +"\'" #강의평들 가져오기
            )
    )

    articles = ""

    for _ in result :
        articles += _[0]
        articles += "/"

    summary = ChatModel.from_pretrained("chat-bison@001")  #chat model 불러오기
    chat = summary.start_chat(
            context="주어진 강의평들을 보고 학생들에게 수업과 관련된 정보를 주기 위해 공손하게 요약해줘, 강의평에서 /표시는 한 강의평의 끝을 의미해",
            temperature=0.0,
            max_output_tokens=1024,
            top_p=0.5,
            top_k=1
            )
    
    lecture_sum = chat.send_message(f"{articles} 요약해줘").text

    inputs = tokenizer(lecture_sum, padding = True, truncation = True, return_tensors = "pt")

    embeddings, _ = model(**inputs, return_dict = False)
    embedding_arr = embeddings[0][0].detach().numpy()
    embedding_str = ",".join(str(x) for x in embedding_arr)
    embedding_str = "["+embedding_str+"]"

    insert_stmt = sqlalchemy.text(
        "INSERT INTO RECOMMENDATION VALUES (:info, :origin_text, :v)"
    )

    with pool.connect() as db_conn :
        db_conn.execute(
            insert_stmt, parameters={"info": info, "origin_text": lecture_sum, "v": embedding_str}
        )
        db_conn.commit()
    print("정보 :", info)
    print("요약본 :", lecture_sum)