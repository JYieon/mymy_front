import React, { useState, useEffect, useRef, useCallback } from "react";
import TimelineApi from "../../api/TimelineApi"; // API 호출
import style from "../../Css/Timeline.module.css";
import { useNavigate } from "react-router-dom";
const Timeline = ({ boardNo }) => {


  const today = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0)
    return `${year}-${month}-${day}`;
  }

  const [startDate, setStartDate] = useState(today(new Date()));
  const [endDate, setEndDate] = useState(today(new Date()));
  const [location, setLocation] = useState("가고 싶은 장소를 적어보세요!");
  const [selectedDate, setSelectedDate] = useState(today(new Date()));
  const [todoList, setTodoList] = useState({});
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

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
      [selectedDate]: [
        ...(prev[selectedDate] || []),
        { startTime: "", endTime: "", task: "", subTask: "" },
      ],
    }));
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

  // 일정 삭제 기능
  const handleDeleteTask = (index) => {
    if (!selectedDate) return;
    const newTodoList = [...(todoList[selectedDate] || [])];
    newTodoList.splice(index, 1);
    setTodoList((prev) => ({
      ...prev,
      [selectedDate]: newTodoList,
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
    console.log("타임라인 유저 데이터", data)
    try {
      await TimelineApi.addTimeline(data, token);
      alert("여행 일정이 저장되었습니다!");
      fetchTimeline();
      navigate(`/board/detail/${boardNo}`);
    } catch (error) {
      alert("작성되지 않은 부분이 있습니다!");
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
      console.error(
        "수정 중 오류 발생:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // 선택한 날짜의 일정 가져오기
  const selectedTasks = todoList[selectedDate] || [];

  return (
    <>
    {/* 메인 수정 타임라인 */}
    <div className={` ${style.container}`}>
      {/* <h2 className={style.title}>🛫 여행 타임라인 계획</h2> */}

      {/* 여행 정보 */}
      <div className={`Shadow ${style.Itinerary}`}>
        {/* 여행지 */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // location 업데이트
          className={`${style.Destination} ${style.input}`}
          placeholder="이번 여행지는?"
        />
        <div className={style.TripDate}>
          {/* 여행 시작 */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setSelectedDate(startDate)
            }} // startDate 업데이트
            className={style.input}
          />
          <span>~</span>
          {/* 여행 종료 */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              if (e.target.value.replaceAll('-', '') - startDate.replaceAll('-', "") < 0) {
                alert('여행 마지막 날은 첫 날보다 이전일 수 없습니다!')
                console.log(startDate)
                setEndDate(startDate);
              } else {
                setEndDate(e.target.value)
              }
            }
            } // endDate 업데이트
            className={style.input}
          />
        </div>
      </div>

      {/* <div className={`Shadow`}></div> */}
      <div className={`Shadow ${style.dateSelection}`}>
        <label className={style.label}>날짜 선택</label>
        <input
          type="date"
          value={selectedDate}
          min={startDate}
          max={endDate}
          onChange={(e) => setSelectedDate(e.target.value)} // selectedDate 업데이트
          className={style.input}
        />

        <div className={`${style.todoSection}`}>
          <h3>{selectedDate || "날짜 선택"}</h3>
          <button className={style.addButton} onClick={handleAddTask}>
            일정 추가
          </button>
          <hr className={``}/>
          <div className={style.TodoList}>
            {/* 서버에서 자동으로 불러와짐 */}
            {selectedTasks.map((todo, index) => (
              <div key={index} className={`Shadow ${style.todoItem}`}>
                {/* 일정 시간 묶음 */}
                <div>
                  {/* 시작 시각 */}
                  <input
                    type="time"
                    value={todo.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    className={style.timeInput}
                  />
                  <span className={style.timeDash}>~</span>
                  {/* 종료 시각 */}
                  <input
                    type="time"
                    value={todo.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
                    className={style.timeInput}
                  />
                </div>
                {/* 일정 */}
                <input
                  type="text"
                  value={todo.task}
                  placeholder="일정을 적어보세요!"
                  onChange={(e) => handleChange(index, "task", e.target.value)}
                  className={style.taskInput}
                />
                <textarea
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
                <button
                  className={style.deleteButton}
                  onClick={() => handleDeleteTask(index)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          {/* <button className={style.updateButton} onClick={handleUpdateTasks}>
            수정
          </button>
          <button className={style.saveButton} onClick={handleSaveTasks}>
            저장
          </button> */}
        </div>
      </div>
    </div>
    <div className={` ${style.subContainer}`}>
      {/* <div className={`Shadow`}></div> */}
      <div className={`Shadow ${style.dateSelection}`}>
        <label className={style.label}>날짜 선택</label>
        <input
          type="date"
          value={selectedDate}
          min={startDate}
          max={endDate}
          readOnly
          onChange={(e) => setSelectedDate(e.target.value)} // selectedDate 업데이트
          className={style.input}
        />

        <div className={`${style.todoSection}`}>
          <h3>{selectedDate || "날짜 선택"}</h3>
          <button className={style.addButton} onClick={handleAddTask}>
            일정 추가
          </button>
          <hr className={``}/>
          <div className={style.TodoList}>
            {/* 서버에서 자동으로 불러와짐 */}
            {selectedTasks.map((todo, index) => (
              <div key={index} className={`Shadow ${style.todoItem}`}>
                {/* 일정 시간 묶음 */}
                <div>
                  {/* 시작 시각 */}
                  <input
                    type="time"
                    value={todo.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    className={style.timeInput}
                  />
                  <span className={style.timeDash}>~</span>
                  {/* 종료 시각 */}
                  <input
                    type="time"
                    value={todo.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
                    className={style.timeInput}
                  />
                </div>
                {/* 일정 */}
                <input
                  type="text"
                  value={todo.task}
                  placeholder="일정을 적어보세요!"
                  onChange={(e) => handleChange(index, "task", e.target.value)}
                  className={style.taskInput}
                />
                <textarea
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
                <button
                  className={style.deleteButton}
                  onClick={() => handleDeleteTask(index)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          {/* <button className={style.updateButton} onClick={handleUpdateTasks}>
            수정
          </button>
          <button className={style.saveButton} onClick={handleSaveTasks}>
            저장
          </button> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default Timeline;
