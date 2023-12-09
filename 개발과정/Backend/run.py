import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
# text-bison을 사용하여 결과값을 반환하는 test.py 파일의 test Class 임포트
from test import test

app = Flask(__name__)
CORS(app)
chatbot = test()
question_history = []

# session에 history 담기
# user = 1
# while True :
#     if user not in session :
#         session[user] = []
#         break
#     else :
#         user += 1

@app.route('/', methods=['GET', 'POST'])
def start():
    if request.method == 'GET':
        return jsonify({"question_history": question_history})

    if request.method == 'POST':
        data = request.json
        question = data.get("question")
        question_history.append(question)

        print(question, " 수신함")

        answer = chatbot.service(question)
        # session 생성된 경우
        # answer = chatbot.service(question, session[user])

        print(answer, " 추출함")

        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)
    
# def logout():
#     session[user].pop()

if __name__ == '__main__':
    # app.run(debug=False, host='0.0.0.0')    # 서버 연결할 때 사용
    app.run(port = 5000)  #로컬에서 실험할 때 사용