!pip install "shapely<2.0.0" 
!pip install google-cloud-aiplatform --upgrade
!pip install shapely

from google.colab import drive
drive.mount('/content/drive')
cd /content/drive/MyDrive/

from glob import glob
for filename in glob('final_output.json'):
  print(filename)

import json
with open("/content/drive/MyDrive/final_output.json", "r") as f:
   data = json.load(f)

from google.colab import auth as google_auth
google_auth.authenticate_user()

import vertexai
from vertexai.language_models import TextGenerationModel

vertexai.init(project="glossy-ally-399906", location="us-central1")
parameters = {
    "candidate_count": 1,
    "max_output_tokens": 1024,
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 40
}
model = TextGenerationModel.from_pretrained("text-bison")

from vertexai.language_models import ChatModel, InputOutputTextPair

#There is no finetune and train function in TextGenerationModel
#Need to use another one
input_output_text_pairs = []
for professor, info in data.items():
    course_info = info["course_info"]
    articles = info["articles"]
    for article in articles:
        input_output_text_pairs.append(InputOutputTextPair(course_info, article))

model.finetune(input_output_text_pairs)

response = model.predict(
    "오늘 날씨 어때?",
    **parameters
)
print(f"Response from Model: {response.text}")
