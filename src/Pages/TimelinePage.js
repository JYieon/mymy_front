import React from "react";
import Timeline from "../Components/Board/Timeline"; // ✅ Timeline 컴포넌트 불러오기
import KakaoMapCom from "../Components/KakaoMap/KakaoMapCom";

const TimelinePage = () => {
    return (
        <div>
            <h1>📅 여행 타임라인</h1>
            <KakaoMapCom/>
            <Timeline />
        </div>
    );
};

export default TimelinePage;
