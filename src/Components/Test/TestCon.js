import { useRef } from "react";
import TestCom from "./TestCom";

const TestCon=()=>{

        //테스트 시작 화면 
        const StartPage=useRef(null);
        //테스트 질문 화면
        const MainPage=useRef(null);
        // 테스트 결과 화면
        const ResultPage=useRef(null);

    return(
    <TestCom/>
)
};

export default TestCon;