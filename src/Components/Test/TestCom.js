import "./Test.css";
const TestCom=()=>{
    const Questions=[
        {
            Question:"갑작스럽게 휴가가 생긴 당신",
            "Answer1":"혼자 여행 계획을 세운다.",
            "Answer2":"친구에게 여행을 같이 가자고 한다.",
            "Answer1Value":"I,J",
            "Answer2Value":"E"
        },
        {
            Question:"여행 계획을 세우고 있는 당신",
            "Answer1":"엑셀을 사용해 시간단위로 계획을 세운다.",
            "Answer2":"적당히 세우고 나머지는 상황에 맞게 정한다.",
            "Answer1Value":"T,J",
            "Answer2Value":"P"
        }
    ];


    const test=Questions.map((Q,index)=>
        <>
        <div  key={index} className="Question">{Q.Question}</div>
        <img key={index} src="https://picsum.photos/700/500" alt="can't load img"/>
        <div key={index} className="AnswerWrap">
            <button key={index} className="Answer">{Q.Answer1}</button>
            <button key={index} className="Answer">{Q.Answer2}</button>
        </div>
        </>
        // console.log("Question > ",Q,"\n index",index)

    )
    // console.log(test)
    return(
        <>
        {test}
        </>
    )
};

export default TestCom;