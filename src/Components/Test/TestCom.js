import { useState } from "react";
import style from "../../Css/TestPage.module.css";
import { useNavigate } from "react-router-dom";
const TestCom=()=>{
    const Questions=[
        {
            QuestionNum:1,
            Question:"갑작스럽게 휴가가 생긴 당신",
            Answer1:"혼자 여행 계획을 세운다.",
            Answer2:"친구에게 여행을 같이 가자고 한다.",
            Answer1Value:"I",
            Answer1subValue:"",
            Answer2Value:"E",
            Answer2subValue:""
        },
        {
            QuestionNum:2,
            Question:"여행 계획을 세우고 있는 당신",
            Answer1:"엑셀을 사용해 시간단위로 계획을 세운다.",
            Answer2:"적당히 세우고 나머지는 상황에 맞게 정한다.",
            Answer1Value:"J",
            Answer2Value:"P",
            Answer1subValue:"N",
            Answer2subValue:"S"
        },
        {
            QuestionNum:3,
            Question:"여행 전날 밤 잠이 들기 전 당신",
            Answer1:"내일을 위해 일찍 잠에 든다.",
            Answer2:"내일 일어날 일 365가지 정도 생각해본다.",
            Answer1Value:"S",
            Answer1subValue:"J",
            Answer2Value:"N",
            Answer2subValue:"P"

        },
        {
            QuestionNum:4,
            Question:"여행 중에 지갑을 잃어버린 당신",
            Answer1:"일단 속상해서 그 자리에 멈춰선다.",
            Answer2:"왔던 길을 되돌아가면서 해결방안을 생각한다.",
            Answer1Value:"F",
            Answer1subValue:"N",
            Answer2Value:"T",
            Answer2subValue:"S"
            
        },
        {
            QuestionNum:5,
            Question:"가려고 했던 가게에 임시휴무가 붙은 걸 본  당신",
            Answer1:"곧바로 미리 찾아둔 다른 가게로 간다.",
            Answer2:"주변  괜찮아 보이는 가게로 간다.",
            Answer1Value:"J",
            Answer1subValue:"N",
            Answer2Value:"P",
            Answer2subValue:"S"

        },
        {
            QuestionNum:6,
            Question:"혼자 여행 중 사진을 찍고 싶은 당신",
            Answer1:"혼자 어떻게든 알아서 찍는다.",
            Answer2:"지나가는 행인에게 부탁한다.",
            Answer1Value:"I",
            Answer1subValue:"P",
            Answer2Value:"E",
            Answer2subValue:"J"

        },
        {
            QuestionNum:7,
            Question:"여행 마지막 밤 친구의 고민을 들어주는 당신",
            Answer1:"너무 힘들었을 것같다고 공감해준다.",
            Answer2:"해결방안을 제시해준다.",
            Answer1Value:"F",
            Answer1subValue:"E",
            Answer2subValue:"I",
            Answer2Value:"T"
        },
        {
            QuestionNum:8,
            Question:"지난 여행에 대해 기록하는 당신",
            Answer1:"여행을 통해 느낀 감정과 교훈을 적는다.",
            Answer2:"장소에 대한 구체적인 후기와 별점을 매긴다",
            Answer1Value:"F",
            Answer1subValue:"N",
            Answer2Value:"T",
            Answer2subValue:"S"

        },        
    ];

    const [ point,setPoint]=useState({
        I:null,E:null, N:null,S:null,F:null,T:null,P:null,J:null
    });
    const nagtive= useNavigate();
    const [num,setNum]=useState(0);
    const [answer,setAnswers]=useState(["I","E","N","S","F","T","P","J"]);


    const OnTest=Questions.map((Q)=>{
        // 대답을 클릭했을 시 다음 문항으로 넘어가는 함수
        const NextQuestion=(num,value,value2,question )=>{
            console.log(num,"value",value)
            console.log(num,"value2",value2)
            if ( num < 8 ){
                setNum(`.${num}`);
                document.getElementById(num).style.display="none";
                document.getElementById(num+1).style.display="block";
            }
            else {
                const answers={};
                    answer.forEach((answer)=>{
                        console.log("answer",answers)
                        answers[answer]=(answers[answer]||0)+1;
                        answers[answer]=(answers[value2]||0)+1;
                });
            
                console.log("answer 어케",answers);
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
            };
        };

       

        return(
            <form id="TravelerTest" name="TravelerTest" action="test/result" method="get">
                <div key={Q.QuestionNum} id={Q.QuestionNum} style={{display:"none"}} className={style.questionWrap}>
                    <h1 className={style.title}>{Q.Question}</h1>
                    <img key={Q.QuestionNum} className={style.testPic} src="https://picsum.photos/700/500" alt="can't load img"/>
                    <div className={style.answerWrap}>
                        <input className={style.answer} onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer1Value,Q.Answer1subValue,Q.Question)} type="button" value={Q.Answer1}/>
                        <input className={style.answer} onClick={()=>NextQuestion(Q.QuestionNum,Q.Answer2Value,Q.Answer2subValue,Q.Question)} type="button" value={Q.Answer2}/>
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