from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

question_history = []

@app.route('/', methods=['GET', 'POST'])
def test():
    if request.method == 'GET':
        return jsonify({"question_history": question_history})

    if request.method == 'POST':
        data = request.json
        question = data.get("question")
        
        question_history.append(question)
        
        response_data = {"message": "Data received", "question": question}
        return jsonify(response_data)

if __name__ == '__main__':
    app.run(port = 5000)
