from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

#Firebase database 인증 및 앱 초기화
cred = credentials.Certificate('/Users/crossrunway/lectureITna/lectureitna-firebase-adminsdk-dne2a-cbb7ea1496.json')
firebase_admin.initialize_app(cred,
                              {
  'databaseURL' : "https://lectureitna-default-rtdb.firebaseio.com"
})

user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' # user-agent-string 변수에 추가

# 브라우저 꺼짐 방지 옵션
chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
chrome_options.add_argument('--disable-gpu') # GPU 사용 안 함 옵션 추가
chrome_options.add_argument('user-agent='+user_agent) # user-agent-string 옵션 추가
chrome_driver = "/Users/crossrunway/lectureITna/chromedriver-mac-x64"

driver = webdriver.Chrome(options=chrome_options) # 드라이버 변수에 저장 (user-agent-string 옵션 추가)
wait = WebDriverWait(driver, 60) # 로드 대기 시간 60초를 wait 변수에 저장

# driver = webdriver.Chrome(chrome_driver, options=chrome_options)
# driver = webdriver.Chrome(options=chrome_options)
driver.get('https://everytime.kr/lecture')

#x_path 찾는 법 : html 코드 위에 우클릭 -> copy -> x_path 누르면 copy 됨
# professor = ['김정근', '권영우', '남우정', '김승호', '아난드 폴',
#              '정기숙', '임경식', '정원일', '정선미', '이호경', '배준현',
#              '이상윤', '박소은', '김용태', '백호기', '남덕윤', '이우진', '김경훈',
#              '장재석', '이시형', '김진욱', '김재수', '김필영', '김명석', '백낙훈',
#              '박상효', '펑리메이', '김재일', '김명옥', '정창수', '이용주', '정설영',
#              '이종택', '서영균', '이성희', '김동선', '김령환', '김동균', '김구진']

professor = ['김정근']

for name in professor:
    url = 'https://everytime.kr/lecture/search?keyword='+name+'&condition=professor'

    driver.get(url)
    time.sleep(3)

    #교수명 검색 후 강의들 반환
    lectures = driver.find_elements(By.CLASS_NAME, "lecture")
    for lecture in lectures :
        lecture.click()
        time.sleep(3)

        #강의명 교수명 출력
        info = driver.find_elements(By.CLASS_NAME, "info")

        lecture = info[0].text
        professor = info[1].text
        dir = db.reference(lecture + '/' + professor)

        print(info[0].text)
        print(info[1].text)

        #강의평 평점 출력
        try : 
            rate = driver.find_element(By.CLASS_NAME, "rating")
        except :
            driver.back()
            print("강의평 없음")
            continue
        print(rate.text)
        dir.update({'강의평 평점': rate.text})

        #강의평
        driver.find_element(By.CLASS_NAME, "more").click()
        time.sleep(3)
        articles = driver.find_elements(By.CLASS_NAME, "article")
        for article in articles :
            dir.update({'강의평': article.text})
            print(article.text)
        driver.back()
        time.sleep(3)

        driver.back()
        time.sleep(3)
