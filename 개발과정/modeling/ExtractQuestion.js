const data = require('/Users/shin/Downloads/final_output.json');

const allCourses = [
    "컴파일러", "컴퓨터구조", "컴퓨팅사고와 SW코딩", "알고리즘1", "전공탐색", "컴퓨팅사고와 SW코딩",
    "데이타베이스", "SW공학및테스팅", "소프트웨어공학", "소프트웨어설계", "운영체제", "소프트웨어와 문제해결",
    "프로그래밍언어론", "기계학습개론", "컴퓨터교재연구및지도법", "컴퓨터 논리 및 논술지도", "이산수학",
    "컴퓨터학개론", "종합설계프로젝트1", "종합설계프로젝트2", "SW실용영어", "인공지능", "데이터과학기초",
];

const allProfs = [
    '김정근', '권영우', '남우정', '김승호', '아난드 폴',
    '정기숙', '임경식', '정원일', '정선미', '이호경', '배준현',
    '이상윤', '박소은', '김용태', '백호기', '남덕윤', '이우진', '김경훈',
    '장재석', '이시형', '김진욱', '김재수', '김필영', '김명석', '백낙훈',
    '박상효', '펑리메이', '김재일', '김명옥', '정창수', '이용주', '정설영',
    '이종택', '서영균', '이성희', '김동선', '김령환', '김동균', '김구진',
];

const userQuestion = "박상효 교수님 수업 어때?";
let cour = "";
let name = "";

allCourses.forEach((course) => {
    if (userQuestion.includes(course)) {
        cour = course;
    }
});

allProfs.forEach((prof) => {
    if (userQuestion.includes(prof)) {
        name = prof;
    }
});

function splitCourseProf(d) {
    const temp = d.split(' ');
    let course = "";
    let anad = false;

    for (let i = 0; i < temp.length - 1; i++) {
        if (temp[i] === "아난드") {
            anad = true;
            break;
        }
        course += temp[i] + " ";
    }

    course = course.slice(0, -1);

    let prof = "";
    if (anad) {
        prof = temp[temp.length - 2] + " " + temp[temp.length - 1];
    } else {
        prof = temp[temp.length - 1];
    }

    return { course, prof };
}

const professorInfo = [];

data.forEach((d) => {
    const { course, prof } = splitCourseProf(d);

    if (name === prof && cour === course) {
        if (data[`${course} ${prof}`]) {
            professorInfo.push(data[`${course} ${prof}`]);
        }
    } else if (name === "" && cour === course) {
        allProfs.forEach((i) => {
            if (data[`${course} ${i}`]) {
                professorInfo.push(data[`${course} ${i}`]);
            }
        });
    } else if (name === prof && cour === "") {
        allCourses.forEach((i) => {
            if (data[`${i} ${prof}`]) {
                professorInfo.push(data[`${i} ${prof}`]);
            }
        });
    }
});

console.log(professorInfo);
