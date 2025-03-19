import { Link, useLocation } from "react-router-dom";
import style from "../../Css/TestPage.module.css";
import { useState, useEffect } from "react";
import MypageApi from "../../api/MypageApi";

const ResultPage = () => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");  
  const [UserResult, setUserResult] = useState(location.state.result);
  console.log(location.state);
  
  const ResultShare=()=>{};

  // 여행자 유형 변환 함수
  const getTagName = (mbti) => {
    switch (mbti) {
      case "ISTP": return "고독한 방랑자";
      case "ISFP": return "자연 속 낭만주의자";
      case "ESTP": return "즉흥적인 모험가";
      case "ESFP": return "축제의 아이콘";
      case "INTJ": return "미래 건축가";
      case "INTP": return "지식 수집가";
      case "ENTJ": return "여행 정복자";
      case "ENTP": return "혁신적인 탐험가";
      case "INFJ": return "평화로운 나그네";
      case "INFP": return "별을 좇는 시인";
      case "ENFJ": return "세상을 밝히는 등불";
      case "ENFP": return "무지개 비행자";
      case "ISTJ": return "시간 설계자";
      case "ESTJ": return "시간의 선장"; 
      case "ESFJ": return "별빛의 수호자";
      case "ISFJ": return "추억 수집가";
      default: return "알 수 없음";
    }
  };

  // useEffect 내부에서 MBTI 변환 후 `setUserResult` 실행
  useEffect(() => {
    if (location.state && location.state.result) {
      const tagName = getTagName(location.state.result); // 변환된 유형 가져오기
      setUserResult(tagName); // 상태 업데이트

      // 상태 업데이트 후 서버 저장
      saveTestResult(tagName, token);
    }
  }, [location.state]);

  // 테스트 결과 서버에 저장하는 함수
  const saveTestResult = async (testResult, token) => {
    if (!token) {
      console.error("토큰이 없습니다! 테스트 결과 저장 실패");
      return;
    }

    try {
      const response = await MypageApi.saveTestResult(testResult, token);
    } catch (error) {
      console.error("테스트 결과 저장 실패:", error);
    }
  };

  return (
    <div className={`${style.TestLayout} Shadow`}>
      <h1>당신은 {UserResult} 입니다.</h1>
      <Link className={`link ${style.testAgain}`} to="/test">
        다시하기
      </Link>
      <button className="ResultSave">저장하기</button>
      <button className="ResultShare">공유하기</button>
    </div>
  );
};

export default ResultPage;
