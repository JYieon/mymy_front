import { Link, useLocation } from "react-router-dom";
import styles from "../../Css/TestPage.module.css";
import { useState } from "react";

const ResultPage = () => {
  const location = useLocation();
  const [UserResult, setUserResult] = useState(location.state.result);
  console.log(location.state);

  switch (UserResult) {
    case "ISTP":
      setUserResult("고독한 방랑자");
      break;
    case "ISFP":
      setUserResult("자연 속 낭만주의자");
      break;
    case "ESTP":
      setUserResult("즉흥적인 모험가");
      break;
    case "ESFP":
      setUserResult("축제의 아이콘");
      break;
    case "INTJ":
      setUserResult("미래 건축가");
      break;
    case "INTP":
      setUserResult("지식 수집가");
      break;
    case "ENTJ":
      setUserResult("여행 정복자");
      break;
    case "ENTP":
      setUserResult("혁신적인 탐험가");
      break;
    case "INFJ":
      setUserResult("평화로운 나그네");
      break;
    case "INFP":
      setUserResult("별을 좇는 시인");
      break;
    case "ENFJ":
      setUserResult("세상을 밝히는 등불");
      break;
    case "ENFP":
      setUserResult("무지개 비행자");
      break;
    case "ISTJ":
      setUserResult("시간 설계자");
      break;
    case "ESTJ":
      setUserResult("시간의 선장");
      break;
    case "ESFJ":
      setUserResult("별빛의 수호자");
      break;
    case "ISFJ":
      setUserResult("추억 수집가");
      break;

    default:
      break;
  }

  console.log("ddd", UserResult);
  return (
    <div className={`${styles.TestLayout} Shadow`}>
      당신은 {location.state.result} 입니다.
      당신은 {UserResult} 입니다.
      <Link className="link" to="/test">
        다시하기
      </Link>
      <button className="ResultShare"> share btn</button>
    </div>
  );
};

export default ResultPage;
