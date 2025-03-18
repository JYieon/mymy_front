import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

//알림 설정정
const AlarmSettings = () => {
    const { userId } = useParams(); // URL에서 userId 가져오기
    const [settings, setSettings] = useState(null); //알림 설정 데이터터
    const [loading, setLoading] = useState(true);//데이터 로딩 중인지 확인인
    const [error, setError] = useState(null);//에러 메세지 상태 관리리

     // 알림 설정 불러오기
     useEffect(() => {
        console.log("불러올 사용자 ID : ", userId); // userId 값 확인
        if (!userId) {
            console.error(" userId가 없습니다. 요청을 중단합니다.");
            return;
        }
    
        console.log(" 알림 설정 요청 보내는 중...");
        MypageApi.getAlarmSettings(userId) //  api 요청청
            .then(response => {
                console.log(" 알림 설정 데이터:", response.data);
                setSettings(response.data);//설정을 화면에 적용 
                setLoading(false);//로딩상태 해제
            })
            .catch(error => {
                console.error(" 알림 설정 불러오기 실패:", error);
                setError("알림 설정을 불러오는 중 오류 발생");
                setLoading(false);
            });
    }, [userId]);//userid가 변경될 때마다 실행행
    
    //설정 저장
    const saveSettings = () => {
        MypageApi.updateAlarmSettings(settings) //  API 모듈 활용
            .then(() => alert("설정이 저장되었습니다."))//저장 완료 알림 
            .catch(error => console.error("설정 저장 실패:", error));
    };


    //체크 박스 눌렀을 떄 설정 변경경
    const toggleSetting = (key) => {
        console.log(` ${key} 변경됨:`, !settings[key]); // 디버깅용 로그 추가
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: !prevSettings[key]//현재 상태를 반대로 바꿈꿈
        }));
    };
    //로딩 중 메세지지
    if (!settings) return <p>알림 설정을 불러오는 중</p>;

    //에러 발생 시 메세지지
    if (error) return <p>에러 발생 {error}</p>;

    return (
        <div className="alarm-settings">
            <h2>알림 설정</h2>

            {/* 게시글 알림 설정정 */}
            <div className="setting">
                <span>게시글 알림</span>
                    <label className="switch">
                    <input type="checkbox" checked={settings.postAlarm} onChange={() => toggleSetting("postAlarm")} />
                <span className="slider round"></span>
            </label>
            <p>내가 팔로우하는 사람의 게시글이 올라오면 받는 알림을 끌 수 있어요.</p>
        </div>

        {/* 댓글 알림 설정정 */}
        <div className="setting">
            <span>댓글 알림</span>
            <label className="switch">
                <input type="checkbox" checked={settings.commentAlarm} onChange={() => toggleSetting("commentAlarm")} />
                <span className="slider round"></span>
            </label>
            <p>내가 쓴 댓글에 달리는 모든 댓글 알림을 끌 수 있어요.</p>
        </div>

        {/* 채팅 알림 설정정 */}
        <div className="setting">
            <span>채팅 알림</span>
            <label className="switch">
                <input type="checkbox" checked={settings.chatAlarm} onChange={() => toggleSetting("chatAlarm")} />
                <span className="slider round"></span>
            </label>
            <p>내가 속해있는 모든 채팅방의 알림을 끌 수 있어요.</p>
        </div>

        {/* 팔로우 알림 설정정 */}
        <div className="setting">
            <span>팔로우 알림</span>
            <label className="switch">
                <input type="checkbox" checked={settings.followAlarm} onChange={() => toggleSetting("followAlarm")} />
                <span className="slider round"></span>
            </label>
            <p>누군가 나를 팔로우할 때 받는 알림을 끌 수 있어요.</p>
        </div>
        <button className="save-button" onClick={saveSettings}>저장</button>
    </div>
    );
};

export default AlarmSettings;
