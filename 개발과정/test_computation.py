#!/usr/bin/env python
# coding: utf-8

# In[1]:


#pip install transformers
#https://pytorch.org/get-started/locally/ 사이트 가서 자기 환경에 맞는 파이토치 다운로드 
import json
from transformers import AutoModel, AutoTokenizer
import torch

def get_KoSimCSE():
    model = AutoModel.from_pretrained('BM-K/KoSimCSE-roberta-multitask')
    tokenizer = AutoTokenizer.from_pretrained('BM-K/KoSimCSE-roberta-multitask')

    print(type(model))
    print(type(tokenizer))

    return model, tokenizer

def cal_score(a, b):
    if len(a.shape) == 1: a = a.unsqueeze(0)
    if len(b.shape) == 1: b = b.unsqueeze(0)

    a_norm = a / a.norm(dim=1)[:, None]
    b_norm = b / b.norm(dim=1)[:, None]
    return torch.mm(a_norm, b_norm.transpose(0, 1)) * 100

model, tokenizer = get_KoSimCSE()

test_file = 'C:\Users\wjdfo\OneDrive\바탕 화면\project\Vector_DB_output (4).json'
optimal_file = 'C:\Users\wjdfo\OneDrive\바탕 화면\project\Optimal_output'

output = json.load(open(test_file, 'r'))
optimal = json.load(open(optimal_file, 'r'))

format = ['교수명', '과목명', '과목명+교수명']
format_sen = ['문장1', '여러문장']

#결과 json파일 형식 만들어주기
score = {}
for i in format : 
    score[i] = {}
    for j in range(len(format_sen)) :
        score[i][format_sen[j]] = {}
        for k in range(j, 5) :
            score[i][format_sen[j]][k] = {}

for case1 in format :
    for case2 in range(len(format_sen)) :
        for num_key in range(case2, 5) :
            for question in output[case1][format_sen[case2]][num_key].keys() :
                result = output[case1][format_sen[case2]][num_key][question]
                o_result = optimal[case1][format_sen[case2]][num_key][question]
                
                computation = [result, optimal]

                inputs = tokenizer(computation, padding=True, truncation=True, return_tensors="pt")
                embeddings, _ = model(**inputs, return_dict=False)
                
                score[case1][format_sen[case2]][num_key][question] = cal_score(embeddings[0][0], embeddings[1][0])


output_file_path = 'C:\Users\wjdfo\OneDrive\바탕 화면\project\test_result.json'
with open(output_file_path, "w", encoding = 'utf-8') as result :
    json.dump(result, ensure_ascii = False, indent = '\t')

