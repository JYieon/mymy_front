import axios from "axios";

const domain = "http://localhost:8080/mymy/map";

const MapApi = {
    // boardNo의 마커 불러오기
    fetchMarkers: (boardNo) => axios.get(`${domain}/list/${boardNo}`),

    // 마커 추가
    addMarker: (markerData) => axios.post(`${domain}/add`, markerData),

    // 특정 마커 삭제 (markerId 사용)
    deleteMarker: (markerId) => axios.delete(`${domain}/delete/${markerId}`),

    // 특정 게시판(boardNo)의 모든 마커 삭제
    deleteAllMarkersByBoard: (boardNo) => axios.delete(`${domain}/deleteByBoard/${boardNo}`),

    // 마커 정보 업데이트
    updateMarkerInfo: (markerId, newInfo) =>
        axios.put(`${domain}/update`, { markerId, info: newInfo }),
};

export default MapApi;
