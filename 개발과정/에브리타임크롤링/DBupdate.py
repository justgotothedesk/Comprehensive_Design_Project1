import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

#Firebase database 인증 및 앱 초기화
cred = credentials.Certificate('/Users/shin/Downloads/lectureitna-firebase-adminsdk-dne2a-db44077cfa.json') #본인 PC에 저장된 경로 복사
firebase_admin.initialize_app(cred,{
    'databaseURL' : 'https://lectureitna-default-rtdb.firebaseio.com/'
})

ref = db.reference() #db 위치 지정
ref.update({'test_key' : 'test_value'}) #해당 변수가 없으면 생성한다. (예시임)

