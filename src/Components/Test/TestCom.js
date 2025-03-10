import { useState } from "react";
import "./Test.css";
import { useNavigate } from "react-router-dom";
const TestCom=()=>{
    const Questions=[
        {
            QuestionNum:1,
            Question:"갑작스럽게 휴가가 생긴 당신",
            Answer1:"혼자 여행 계획을 세운다.",
            Answer2:"친구에게 여행을 같이 가자고 한다.",
            Answer1Value:"I,J",
            Answer2Value:"E,P"
        },
        {
            QuestionNum:2,
            Question:"여행 계획을 세우고 있는 당신",
            Answer1:"엑셀을 사용해 시간단위로 계획을 세운다.",
            Answer2:"적당히 세우고 나머지는 상황에 맞게 정한다.",
            Answer1Value:"J",
            Answer2Value:"P"
        },
        {
            QuestionNum:3,
            Question:"여행 전날 밤 잠이 들기 전 당신",
            Answer1:"내일을 위해 일찍 잠에 든다.",
            Answer2:"내일 일어날 일 365가지 정도 생각해본다.",
            Answer1Value:"S,J",
            Answer2Value:"N,P"
        },
        {
            QuestionNum:4,
            Question:"여행 중에 지갑을 잃어버린 당신",
            Answer1:"일단 마음을 가다듬는다.",
            Answer2:"왔던 길을 되돌아가면서 해결방안을 생각한다.",
            Answer1Value:"F,N",
            Answer2Value:"T,S"
        },
        {
            QuestionNum:5,
            Question:"가려고 했던 가게에 임시휴무가 붙은 걸 본  당신",
            Answer1:"곧바로 미리 찾아둔 다른 가게로 간다.",
            Answer2:"주변  괜찮아 보이는 가게로 간다.",
            Answer1Value:"J,S",
            Answer2Value:"P,N"
        },
        {
            QuestionNum:6,
            Question:"혼자 여행 중 사진을 찍고 싶은 당신",
            Answer1:"혼자 어떻게든 알아서 찍는다.",
            Answer2:"지나가는 행인에게 부탁한다.",
            Answer1Value:"I,T",
            Answer2Value:"E,F"
        },
        {
            QuestionNum:7,
            Question:"여행 마지막 밤 친구의 고민을 들어주는 당신",
            Answer1:"너무 힘들었을 것같다고 공감해준다.",
            Answer2:"해결방안을 제시해준다.",
            Answer1Value:"F",
            Answer2Value:"T"
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

    const nagtive= useNavigate();
    const [num,setNum]=useState(0);
    const [answer,setAnswers]=useState(["I","E","N","S","F","T","P","J"]);


    const OnTest=Questions.map((Q)=>{
        // 대답을 클릭했을 시 다음 문항으로 넘어가는 함수
        const NextQuestion=(num,value)=>{
            if ( num < 8 ){
                setNum(`.${num}`);
                document.getElementById(num).style.display="none";
                document.getElementById(num+1).style.display="block";
                setAnswers(answer.concat(value.split(',')));
            }
            else {
                
                // console.log("Answers > ",answers);
                const answers={};
                    answer.forEach((answer)=>{
                        answers[answer]=(answers[answer]||0)+1;
                });
            
                console.log(answers);
                const EnergyDirection=(answers.I > answers.E) ? "I":"E";
                const Recognition=(answers.N > answers.S) ? "N":"S";
                const Judgment=(answers.T > answers.F) ? "T":"F";
                const fulfillment=(answers.J > answers.P) ? "J":"P";

                let result=EnergyDirection+Recognition+Judgment+fulfillment;
                console.log("result >",result);

                nagtive('/test/result',{
                    state:{
                        result:result,
                    },
                });
                
                // document.getElementById('TravelerTest').submit();
            };
        };

       

        return(
            <form id="TravelerTest" name="TravelerTest" action="test/result" method="get">
                <div key={Q.QuestionNum} id={Q.QuestionNum} style={{display:"none"}}>
                    <div className="Question">{Q.Question}</div>
                    {/* <img key={Q.QuestionNum} src="https://picsum.photos/700/500" alt="can't load img"/> */}
                    <div className="AnswerWrap">
                        <input className="Answer" onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer1Value,Q.Question)} type="button" value={Q.Answer1}/>
                        <input className="Answer" onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer2Value,Q.Question)} type="button" value={Q.Answer2}/>
                    </div>
                </div>
            </form>
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