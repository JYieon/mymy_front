import React, { useState, useEffect } from "react";
import axios from "axios";


const Alarm = () => {
    const userId = "aaa";
    const [settings, setSettings] = useState({
        postAlarm: false,   // 게시글 알림
        commentAlarm: false, // 댓글 알림
        chatAlarm: false,    // 채팅 알림
        followAlarm: false   // 팔로우 알림
    });

    useEffect(() => {
        // 알람 설정 불러오기
        if (!userId) return; // userId가 없을 경우 요청 보내지 않음
        axios.get(`http://localhost:8080/mymy/alarm/settings/${userId}`, { params: { memberId: "aaa" } })
            .then(response => {
                setSettings(response.data);
            })
            .catch(error => console.error("알림 설정 불러오기 실패:", error));
    }, [userId]);

    // 알림 설정 변경
    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // 설정 저장 요청 (백엔드로 전송)
    const saveSettings = () => {
        axios.post(`http://localhost:8080/mymy/alarm/settings/update`, {
            memberId: userId, // ✅ 백엔드가 기대하는 형식으로 userId 전달
            ...settings       // ✅ 상태값 전달
        })
        .then(() => alert("설정이 저장되었습니다!"))
        .catch(error => console.error("설정 저장 실패:", error));
    };

    return (
        <div className="alarm-settings">
            <h2>알림 설정</h2>

            <div className="setting">
                <span>게시글 알림</span>
                <label className="switch">
                    <input type="checkbox" checked={settings.postAlarm} onChange={() => toggleSetting("postAlarm")} />
                    <span className="slider round"></span>
                </label>
                <p>내가 팔로우하는 사람의 게시글이 올라오면 받는 알림을 끌 수 있어요.</p>
            </div>

            <div className="setting">
                <span>댓글 알림</span>
                <label className="switch">
                    <input type="checkbox" checked={settings.commentAlarm} onChange={() => toggleSetting("commentAlarm")} />
                    <span className="slider round"></span>
                </label>
                <p>내가 쓴 댓글에 달리는 모든 댓글 알림을 끌 수 있어요.</p>
            </div>

            <div className="setting">
                <span>채팅 알림</span>
                <label className="switch">
                    <input type="checkbox" checked={settings.chatAlarm} onChange={() => toggleSetting("chatAlarm")} />
                    <span className="slider round"></span>
                </label>
                <p>내가 속해있는 모든 채팅방의 알림을 끌 수 있어요.</p>
            </div>

            <div className="setting">
                <span>팔로우 알림</span>
                <label className="switch">
                    <input type="checkbox" checked={settings.followAlarm} onChange={() => toggleSetting("followAlarm")} />
                    <span className="slider round"></span>
                </label>
                <p>누군가 나를 팔로우할 떄 받는 알림을 끌 수 있어요.</p>
            </div>
            
            <button className="save-button" onClick={saveSettings}>저장</button>
        </div>
    );
};

export default Alarm;
