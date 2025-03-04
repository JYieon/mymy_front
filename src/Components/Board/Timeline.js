import React, { useState, useEffect } from "react";
import TimelineApi from "../../api/TimelineApi"; // ✅ Timeline API 불러오기

const Timeline = () => {
    const [location, setLocation] = useState(""); // 여행 장소
    const [startDate, setStartDate] = useState(""); // 시작 날짜
    const [endDate, setEndDate] = useState(""); // 종료 날짜
    const [timeline, setTimeline] = useState({}); // 날짜별 일정 데이터
    const [selectedDate, setSelectedDate] = useState(""); // 선택한 날짜
    const [newTodo, setNewTodo] = useState({ time: "", title: "", description: "" }); // 새로운 일정 입력 필드
    const boardNo = 58; // ✅ 임의의 게시글 번호
    const id = "a"; // ✅ 임의의 사용자 ID

    // ✅ 타임라인 불러오기 (서버에서 데이터 가져오기)
    const fetchTimeline = async () => {
        try {
            const response = await TimelineApi.getTimeline(boardNo);
            console.log("📥 불러온 타임라인 데이터:", response);
    
            if (response.length > 0) {
                const loadedTimeline = response.reduce((acc, item) => {
                    const todoData = JSON.parse(item.todo || "{}"); // ✅ JSON 변환 (빈 객체 처리)
                    
                    // 🔥 `startDt` 키가 아닌 `todo` 내 날짜를 기준으로 저장
                    Object.keys(todoData).forEach((dateKey) => {
                        acc[dateKey] = todoData[dateKey];
                    });
    
                    return acc;
                }, {});
    
                setTimeline(loadedTimeline);
            } else {
                setTimeline({});
            }
        } catch (error) {
            console.error("❌ 타임라인 불러오기 실패:", error);
        }
    };

    // ✅ 타임라인 저장 (서버로 전송)
    const handleSaveTimeline = async () => {
        if (!location || !startDate || !endDate) {
            alert("여행 장소와 날짜를 입력해주세요.");
            return;
        }

        const newTimeline = {
            boardNo: boardNo,
            id: id,
            startDt: Object.keys(timeline)[0] || startDate,
            endDt: endDate,
            todo: JSON.stringify(timeline), // ✅ JSON 문자열 변환
            location: location,
        };

        try {
            await TimelineApi.addTimeline(newTimeline);
            alert("✅ 타임라인이 저장되었습니다!");
            fetchTimeline(); // ✅ 저장 후 자동으로 새로고침
        } catch (error) {
            console.error("❌ 타임라인 저장 실패:", error);
        }
    };

    // ✅ 날짜 리스트 생성 함수 (startDate ~ endDate 범위)
    const generateDateList = () => {
        let dates = [];
        let start = new Date(startDate);
        let end = new Date(endDate);

        while (start <= end) {
            dates.push(new Date(start).toISOString().split("T")[0]); // YYYY-MM-DD 형식
            start.setDate(start.getDate() + 1);
        }
        return dates;
    };

    // ✅ 날짜 클릭 시 해당 날짜의 TODO 입력 창 활성화
    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    // ✅ TODO 추가 함수 (선택한 날짜의 일정 추가)
    const handleAddTodo = () => {
        if (!selectedDate || !newTodo.time || !newTodo.title || !newTodo.description) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        setTimeline((prev) => {
            const updatedTodos = prev[selectedDate] ? [...prev[selectedDate], newTodo] : [newTodo];
            return { ...prev, [selectedDate]: updatedTodos };
        });

        setNewTodo({ time: "", title: "", description: "" }); // 입력 필드 초기화
    };

    // ✅ 최초 1회만 타임라인 불러오기 (무한 루프 방지)
    useEffect(() => {
        fetchTimeline();
    }, []);

    return (
        <div>
            <h2>📅 여행 타임라인</h2>

            {/* 여행 장소 및 기간 입력 */}
            <div>
                <label>📍 여행 장소:</label>
                <input
                    type="text"
                    placeholder="여행 장소 입력"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <br />
                <label>📅 여행 기간:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <br />
                <button onClick={handleSaveTimeline}>📝 타임라인 저장</button>
            </div>

            <hr />

            {/* 날짜 목록 (기간을 선택하면 버튼 생성) */}
            <h3>📆 날짜별 일정 추가</h3>
            {generateDateList().map((date) => (
                <button key={date} onClick={() => handleDateClick(date)}>
                    {date}
                </button>
            ))}

            <hr />

            {/* 선택한 날짜에 대한 TODO 입력 창 */}
            {selectedDate && (
                <div>
                    <h3>📅 {selectedDate} 일정 추가</h3>
                    <input
                        type="time"
                        value={newTodo.time}
                        onChange={(e) => setNewTodo({ ...newTodo, time: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="일정 제목"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="일정 설명"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    />
                    <button onClick={handleAddTodo}>➕ 추가</button>
                </div>
            )}

            <hr />

            {/* 등록된 일정 목록 */}
            <h3>📆 등록된 타임라인</h3>
            {Object.keys(timeline).length > 0 ? (
                Object.keys(timeline).map((date) => (
                    <div key={date}>
                        <h4>📅 {date}</h4>
                        {timeline[date].length > 0 ? (
                            timeline[date].map((todo, index) => (
                                <p key={index}>⏰ {todo.time} - {todo.title} ({todo.description})</p>
                            ))
                        ) : (
                            <p>일정 없음</p>
                        )}
                    </div>
                ))
            ) : (
                <p>등록된 일정이 없습니다.</p>
            )}
        </div>
    );
};

export default Timeline;
