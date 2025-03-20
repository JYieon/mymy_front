import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import TimelineApi from "../../api/TimelineApi"; // API 호출
import style from "../../Css/Timeline.module.css";
const ReadingOnlyTimeline = ({SetTimelineId}) => {
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
      console.log("타임라인 게시글 번호", boardNo)
      const response = await TimelineApi.getTimeline(boardNo);
      if (response.data) {
        SetTimelineId(response.data.timelineId);
        setStartDate(response.data.startDt);
        setSelectedDate(response.data.startDt);
        setEndDate(response.data.endDt);
        setLocation(response.data.location);
        setTodoList(JSON.parse(response.data.todo) || {});
      }else {

      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const subTaskRef = useRef();

  // 입력값에 따라 높이 변경
  const handleResizeHeight = useCallback(() => {
    subTaskRef.current.style.height = "auto";
    subTaskRef.current.style.height = subTaskRef.current.scrollHeight + "px";
  }, []);

  const handleChange = (index, field, value) => {
    if (!selectedDate) return;
    const newTodoList = [...(todoList[selectedDate] || [])];
    newTodoList[index][field] = value;
    setTodoList((prev) => ({
      ...prev,
      [selectedDate]: newTodoList,
    }));
  };


  // 선택한 날짜의 일정 가져오기
  const selectedTasks = todoList[selectedDate] || [];

  return (
    <div className={`${style.container}`}>
      {/* 여행 정보 */}
      <div className={`Shadow ${style.Itinerary}`}>
        {/* 여행지 */}
        <input
          readOnly
          type="text"
          value={location}
          className={`${style.Destination} ${style.input}`}
        />
        <div className={style.TripDate}>
          {/* 여행 시작 */}
          <input
            readOnly
            type="date"
            value={startDate}
            className={style.input}
          />
          <span>~</span>
          {/* 여행 종료 */}
          <input
            readOnly
            type="date"
            value={endDate}
            className={style.input}
          />
        </div>
      </div>

      {/* <div className={`Shadow`}></div> */}
      <div className={`Shadow ${style.dateSelection}`}>
        <label className={style.label}>📅</label>
        <input
          type="date"
          value={selectedDate}
          min={startDate}
          max={endDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={style.input}
        />

        <div className={`${style.todoSection}`}>
          <h3>📍 {selectedDate || "날짜 선택"}</h3>
          <hr />
          <div className={style.TodoList}>
            {/* 서버에서 자동으로 불러와짐 */}
            {selectedTasks.map((todo, index) => (
              <div key={index} className={`Shadow ${style.todoItem}`}>
                {/* 일정 시간 묶음 */}
                <div>
                  {/* 시작 시각 */}
                  <input readOnly
                    type="time"
                    value={todo.startTime}

                    className={style.timeInput}
                  />
                  <span className={style.timeDash}>~</span>
                  {/* 종료 시각 */}
                  <input readOnly
                    type="time"
                    value={todo.endTime}
                    className={style.timeInput}
                  />
                </div>
                {/* 일정 */}
                <input readOnly
                  type="text"
                  value={todo.task}
                  placeholder="일정을 적어보세요!"
                  onChange={(e) => handleChange(index, "task", e.target.value)}
                  className={style.taskInput}
                />
                <textarea readOnly
                  ref={subTaskRef}
                  value={todo.subTask}
                  placeholder="세부 사항"
                  onChange={(e) =>
                    handleChange(index, "subTask", e.target.value)
                  }
                  onInput={handleResizeHeight}
                  rows={1}
                  className={style.subTaskInput}
                ></textarea>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingOnlyTimeline;
