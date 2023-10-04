#chrome webdriver 설치 시, 본인 chrome 버전에 맞는 버전 설치
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# 브라우저 꺼짐 방지 옵션
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

driver = webdriver.Chrome(options=chrome_options)
driver.implicitly_wait(10)
driver.get('https://everytime.kr/login')

# 접속
id = "" #아이디 입력
pwd = "" #비밀번호 입력
driver.find_element(By.NAME, 'userid').send_keys(id)
driver.find_element(By.NAME, 'password').send_keys(pwd)
driver.find_element(By.XPATH, '/html/body/div/form/p[3]/input').click() #해당 부분에서 매크로 방지를 풀지 못해서 로그인 불가
time.sleep(10)
#driver.find_element(By.XPATH, '//*[@id="submenu"]/div/div[2]/ul/li[4]').click()
#driver.get("https://everytime.kr/lecture/view/2467379?tab=article")
