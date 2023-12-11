import os
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "LectureItna"

CORS(app)
#chat_session = {}
chat_session = []
question_history = []

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.json
        name = data.get('id')
        if name in chat_session:
            return jsonify({'success': False})
        else:
            #session['name'] = name  # Corrected line
            chat_session.append(name)
            print(f"Your nickname is {name}")
            for _ in chat_session:
                print(f"{_} in session.")
            return jsonify({'success': True})


@app.route('/', methods=['GET', 'POST'])
def chat():


    # user_id = session.get('user_id')
    # if user_id is None:
    #     user = User.query.get(user_id)
    #     return 'Login Error'
    
    # print('User ' + user_id + " login.")
    
    if request.method == 'GET':
        return jsonify({"question_history": chat_session})

    if request.method == 'POST':
        data = request.json
        question = data.get("question")
        # question = data.get("question")
        question_history.append(question)

        print(question, " 수신함")

        answer = "ㅎㅇ ㅋㅋ"
    

        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)
    
@app.route('/logout')
def logout():
    session.clear()

if __name__ == '__main__':
    # app.run(debug=False, host='0.0.0.0')    # 서버 연결할 때 사용
    print("hi back_end server started")
    app.run(port = 5000)  #로컬에서 실험할 때 사용
