import os
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# text-bison을 사용하여 결과값을 반환하는 test.py 파일의 test Class 임포트
from test import test

app = Flask(__name__)
app.secret_key = "LectureItna"

# app.config['SECRET_KEY'] = 'key'
# application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

# db = SQLAlchemy(app)
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(50))
#     password = db.Column(db.String(50))

CORS(app)
chatbot = test()
chat_session = {}
question_history = []

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST' :
        data = request.json
        name = data.get('id')
        if name in session :
            return jsonify({'success' : False})
        else :
            session[name] = name
            print(f"your nickname is {name}")
            for _ in session :
                print(f"{_} in session.")
            return jsonify({'success' : True})

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    id = session.get('name')
    print(id)

    if id in chat_session.keys() :
        history = chat_session[id]
    else :
        chat_session[id] = []
        history = chat_session[id]

    # user_id = session.get('user_id')
    # if user_id is None:
    #     user = User.query.get(user_id)
    #     return 'Login Error'
    
    # print('User ' + user_id + " login.")
    
    if request.method == 'GET':
        return jsonify({"question_history": question_history})

    if request.method == 'POST':
        data = request.json
        question = data.get("question")
        # question = data.get("question")
        question_history.append(question)

        print(question, " 수신함")

        answer = chatbot.service(question, history)

        print(history)

        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)
    
@app.route('/logout')
def logout():
    session.clear()

if __name__ == '__main__':
    # app.run(debug=False, host='0.0.0.0')    # 서버 연결할 때 사용
    print("hi back_end server started")
    app.run(port = 5000)  #로컬에서 실험할 때 사용