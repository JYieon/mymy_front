import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TimelineApi from "../../api/TimelineApi"; // API 호출

const Timeline = () => {
    const { boardNo } = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [todoList, setTodoList] = useState({});
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
        }
    }, [token]);

    useEffect(() => {
        fetchTimeline();
    }, []);

    // 타임라인 데이터 가져오기
    const fetchTimeline = async () => {
        try {
            const response = await TimelineApi.getTimeline(boardNo);
            if (response.data) {
                setStartDate(response.data.startDt);
                setEndDate(response.data.endDt);
                setLocation(response.data.location);
                setTodoList(JSON.parse(response.data.todo) || {});
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };

    // 일정 추가
    const handleAddTask = () => {
        if (!selectedDate) {
            alert("먼저 날짜를 선택하세요!");
            return;
        }
        setTodoList((prev) => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), { startTime: "", endTime: "", task: "" }]
        }));
    };

    // 입력값 변경
    const handleChange = (index, field, value) => {
        if (!selectedDate) return;
        const newTodoList = [...(todoList[selectedDate] || [])];
        newTodoList[index][field] = value;
        setTodoList((prev) => ({
            ...prev,
            [selectedDate]: newTodoList
        }));
    };

    // 일정 삭제 기능
    const handleDeleteTask = (index) => {
        if (!selectedDate) return;
        const newTodoList = [...(todoList[selectedDate] || [])];
        newTodoList.splice(index, 1);
        setTodoList((prev) => ({
            ...prev,
            [selectedDate]: newTodoList
        }));
    };

    // 일정 처음 저장 (DB 반영)
    const handleSaveTasks = async () => {
        const data = {
            boardNo,
            token: token,
            startDt: startDate,
            endDt: endDate,
            location,
            todo: JSON.stringify(todoList),
        };

        try {
            await TimelineApi.addTimeline(data, token);
            alert("여행 일정이 저장되었습니다!");
            fetchTimeline();
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
        }
    };

    // 일정 전체 수정 (todo만 덮어쓰기)
    const handleUpdateTasks = async () => {
        const data = {
            boardNo: boardNo,
            todo: JSON.stringify(todoList),
        };

        try {
            const response = await TimelineApi.updateTimelineTodo(data);
            alert("일정이 수정되었습니다!");
            fetchTimeline();
        } catch (error) {
            console.error("수정 중 오류 발생:", error.response ? error.response.data : error.message);
        }
    };

    // 선택한 날짜의 일정 가져오기
    const selectedTasks = todoList[selectedDate] || [];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🛫 여행 타임라인 계획</h2>
            <div style={styles.dateSelection}>
                <label style={styles.label}>📅 여행 시작 날짜: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} // startDate 업데이트
                    style={styles.input}
                />
                <label style={styles.label}>📅 여행 종료 날짜: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} // endDate 업데이트
                    style={styles.input}
                />
                <label style={styles.label}>📍 여행 장소: </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)} // location 업데이트
                    style={styles.input}
                />
            </div>

            <div style={styles.dateSelection}>
                <label style={styles.label}>📅 일정 추가할 날짜: </label>
                <input
                    type="date"
                    value={selectedDate}
                    min={startDate}
                    max={endDate}
                    onChange={(e) => setSelectedDate(e.target.value)} // selectedDate 업데이트
                    style={styles.input}
                />
            </div>

            <div style={styles.todoSection}>
                <h3>📍 일정 추가 ({selectedDate || "날짜 선택"})</h3>
                {selectedTasks.map((todo, index) => (
                    <div key={index} style={styles.todoItem}>
                        <input
                            type="time"
                            value={todo.startTime}
                            onChange={(e) => handleChange(index, "startTime", e.target.value)}
                            style={styles.timeInput}
                        />
                        <span style={styles.timeDash}>~</span>
                        <input
                            type="time"
                            value={todo.endTime}
                            onChange={(e) => handleChange(index, "endTime", e.target.value)}
                            style={styles.timeInput}
                        />
                        <input
                            type="text"
                            value={todo.task}
                            placeholder="예: 관광지 방문"
                            onChange={(e) => handleChange(index, "task", e.target.value)}
                            style={styles.taskInput}
                        />
                        <button style={styles.deleteButton} onClick={() => handleDeleteTask(index)}>
                            🗑 삭제
                        </button>
                    </div>
                ))}
                <button style={styles.addButton} onClick={handleAddTask}>+ 일정 추가</button>
                <button style={styles.saveButton} onClick={handleSaveTasks}>💾 저장</button>
                <button style={styles.updateButton} onClick={handleUpdateTasks}>🔄 수정</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: "60%",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#f9f9f9",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    dateSelection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
    },
    label: {
        fontSize: "16px",
        marginBottom: "5px",
    },
    input: {
        padding: "8px",
        margin: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "60%",
        textAlign: "center",
    },
    todoSection: {
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    },
    todoItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    timeInput: {
        padding: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "25%",
    },
    timeDash: {
        margin: "0 10px",
        fontSize: "18px",
    },
    taskInput: {
        padding: "5px",
        marginLeft: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "40%",
    },
    addButton: {
        background: "#4CAF50",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "10px",
    },
    saveButton: {
        background: "#007bff",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Timeline;
