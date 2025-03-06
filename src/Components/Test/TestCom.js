import { useEffect, useState } from "react";
import "./Test.css";
const TestCom=()=>{
    const Questions=[
        {
            QuestionNum:1,
            Question:"갑작스럽게 휴가가 생긴 당신",
            Answer1:"혼자 여행 계획을 세운다.",
            Answer2:"친구에게 여행을 같이 가자고 한다.",
            Answer1Value:"I,J",
            Answer2Value:"E"
        },
        {
            QuestionNum:2,
            Question:"여행 계획을 세우고 있는 당신",
            Answer1:"엑셀을 사용해 시간단위로 계획을 세운다.",
            Answer2:"적당히 세우고 나머지는 상황에 맞게 정한다.",
            Answer1Value:"T,J",
            Answer2Value:"P"
        },
        {
            QuestionNum:3,
            Question:"여행 전날 밤 잠이 들기 전 당신",
            Answer1:"내일을 위해 일찍 잠에 든다.",
            Answer2:"내일 일어날 일 365가지 정도 생각해본다.",
            Answer1Value:"S,J",
            Answer2Value:"N,F"
        },
        {
            QuestionNum:4,
            Question:"여행 중에 지갑을 잃어버린 당신",
            Answer1:"일단 눈물부터 훔친다.",
            Answer2:"왔던 길을 되돌아가면서 해결방안을 생각한다.",
            Answer1Value:"F",
            Answer2Value:"T,S"
        },
        {
            QuestionNum:5,
            Question:"가려고 했던 가게에 임시휴무가 붙은 걸 본  당신",
            Answer1:"곧바로 미리 찾아둔 다른 가게로 간다.",
            Answer2:"주변  괜찮아 보이는 가게로 간다.",
            Answer1Value:"J",
            Answer2Value:"P,N"
        },
        {
            QuestionNum:6,
            Question:"혼자 여행 중 사진을 찍고 싶은 당신",
            Answer1:"혼자 어떻게든 알아서 찍는다.",
            Answer2:"지나가는 행인에게 부탁한다.",
            Answer1Value:"I,T",
            Answer2Value:"E"
        },
        {
            QuestionNum:7,
            Question:"여행 마지막 밤 친구의 고민을 들어주는 당신",
            Answer1:"너무 힘들었을 것같다고 공감해준다.",
            Answer2:"해결방안을 제시해준다.",
            Answer1Value:"F,N",
            Answer2Value:"T,S"
        },
        {
            QuestionNum:8,
            Question:"지난 여행에 대해 기록하는 당신",
            Answer1:"여행을 통해 느낀 감정과 교훈을 적는다.",
            Answer2:"장소에 대한 구체적인 후기와 별점을 매긴다",
            Answer1Value:"F,S",
            Answer2Value:"T,N"
        },        
    ];

    const [num,setNum]=useState(0);
    const [answers,setAnswers]=useState(["I","E","N","S","F","T","P","J"]);

    useEffect(()=>{
        console.log('useEffect',answers);
    });



    const OnTest=Questions.map((Q)=>{
        // 대답을 클릭했을 시 다음 문항으로 넘어가는 함수
        const NextQuestion=(num,value)=>{
            if ( num < 8 ){
                setNum(`.${num}`);
                document.getElementById(num).style.display="none";
                document.getElementById(num+1).style.display="block";

                setAnswers(answers.concat(value.split(',')));
            }
            else {
                document.getElementById('MainPage').style.display="none";
                document.getElementById('ResultPage').style.display="block";

                console.log("Answers > ",answers);
                const result={};
                answers.forEach((answer)=>{
                    result[answer]=(result[answer]||0)+1;
                });

                const EnergyDirection=(result.I > result.E) ? "I":"E";
                const Recognition=(result.N > result.S) ? "N":"S";
                const Judgment=(result.T > result.F) ? "T":"F";
                const fulfillment=(result.J > result.P) ? "J":"P";

                console.log(EnergyDirection,Recognition,Judgment,fulfillment)
                console.log(result);

            };
        };

       

        return(
            <div key={Q.QuestionNum} className={Q.QuestionNum} id={Q.QuestionNum} style={{
                display:"none"
            }}>
                <div className="Question">{Q.Question}</div>
                {/* <img key={index} src="https://picsum.photos/700/500" alt="can't load img"/> */}
                <div  className="AnswerWrap">
                    <button className="Answer" onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer1Value,Q.Question)}>{Q.Answer1}</button>
                    <button  className="Answer" onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer2Value,Q.Question)}>{Q.Answer2}</button>
                    {/* {console.log("Question > ",Q.Question,"\n index",Q.QuestionNum)} */}
                </div>
            </div>
        )
    }


    )
    // console.log(test)
    return(
        <>
        {OnTest}
        </>
    )
};

export default TestCom;