import os
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# text-bison을 사용하여 결과값을 반환하는 test.py 파일의 test Class 임포트
from test import test

app = Flask(__name__)
app.secret_key = "LectureItna"

CORS(app)
chatbot = test()
chat_session = {}
id = []
question_history = []

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST' :
        data = request.json
        name = data.get('id')
        print(id)
        print(name)

        if name in id :
            print(f"{name} already in session, please re-login with other Nickname")
            return jsonify({'success' : False})
        else :
            id.append(name)
            chat_session[name] = [] # history
            print(f"your nickname is {name}")
            for _ in id :
                print(f"{_} in session.")
            
            return jsonify({'success' : True})

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        data = request.json
        user = data.get('id')
        question = data.get("question")
        question_history.append(question)


        print(f"사용자 닉네임 : {user}")
        print(question, " 수신함")

        answer = chatbot.service(question, chat_session[user])

        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')    # 서버 연결할 때 사용
    # app.run(port = 5000)  #로컬에서 실험할 때 사용