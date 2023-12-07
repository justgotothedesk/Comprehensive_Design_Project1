from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
# text-bison을 사용하여 결과값을 반환하는 test.py 파일의 test Class 임포트
from test import test


app = Flask(__name__)
CORS(app)
chatbot = test()
question_history = []
session_id = 1

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        if session_id in session :
            session_id += 1
        else :
            session[session_id] = []
        return redirect('/')

@app.route('/', methods=['GET', 'POST'])
def start():
    if request.method == 'GET':
        return jsonify({"question_history": question_history})

    if request.method == 'POST':
        print(f"세션 ID : {session_id}")
        print(f"세션에 있는 history 정보 \n{session[session_id]}")
        data = request.json
        question = data.get("question")
        question_history.append(question)

        print(question, " 수신함")

        chatbot = test()
        answer = chatbot.service(question, session[session_id])

        print(answer, " 추출함")
        
        response_data = {"question": question, "answer": answer}
        return jsonify(response_data)

if __name__ == '__main__':
    # app.run(debug=False, host='0.0.0.0')
    app.run(debug=False, port='3000')