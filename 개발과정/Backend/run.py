import os
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# text-bison을 사용하여 결과값을 반환하는 test.py 파일의 test Class 임포트
from test import test

import session

app = Flask(__name__)

app.config['SECRET_KEY'] = 'key'
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))

CORS(app)
chatbot = test()
question_history = []

@app.route('/')
def login():
    username = request.form['username']
    password = request.form['password']

    user = User.query.filter_by(username=username).first()
    if user is not None:
        # 세션에 사용자 ID가 존재하는 경우
        session['user_id'] = user.id
        print("User: " + username + " login.")
        return redirect(url_for('chat'))
    else:
        # 세션에 사용자 ID가 존재하지 않는 경우
        user = User(username=username)
        db.session.add(user)
        db.session.commit()
        print("User: " + username + " added.")
        return redirect(url_for('chat'))

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    user_id = session.get('user_id')
    if user_id is None:
        user = User.query.get(user_id)
        return 'Login Error'
    
    print('User ' + user_id + " login.")
    
    if request.method == 'GET':
        return jsonify({"question_history": question_history})

    if request.method == 'POST':
        data = request.json
        question = data.get("question")
        question_history.append(question)

        print(question, " 수신함")

        answer = chatbot.service(question)

        print(answer, " 추출함")

        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)
    
@app.route('/logout')
def logout():
    session.clear()

if __name__ == '__main__':
    # app.run(debug=False, host='0.0.0.0')    # 서버 연결할 때 사용
    app.run(port = 5000)  #로컬에서 실험할 때 사용