import axios from "axios";

const domain = "http://localhost:8080/mymy/timeline";

export const addTimeline = (timelineData) => axios.post(`${domain}/add`, timelineData);
export const getTimeline = (boardNo) => axios.get(`${domain}/${boardNo}`);
export const deleteTimeline = (timelineId) => axios.delete(`${domain}/delete/${timelineId}`);
export const updateTimelineTodo = (data) => axios.post(`${domain}/updateTodo`, data);
