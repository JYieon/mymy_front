// import React, { useEffect, useState } from "react";

// const KakaoMap = () => {
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [infoWindows, setInfoWindows] = useState([]);
//     const [editMode, setEditMode] = useState(null); // 수정할 마커의 인덱스
//     const [newContent, setNewContent] = useState(""); // 새로운 인포윈도우 내용

//     useEffect(() => {
//         // console.log("useEffect 실행됨!");

//         if (window.kakao && window.kakao.maps) {
//             // console.log("카카오맵 API 이미 로드됨");
//             initMap();
//         } else {
//             // console.log("카카오맵 스크립트 추가 중...");
//             const script = document.createElement("script");
//             script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=&autoload=false&libraries=services,clusterer,drawing`;
//             script.async = true;
//             document.head.appendChild(script);

//             script.onload = () => {
//                 // console.log("카카오맵 스크립트 로딩 완료!");
//                 window.kakao.maps.load(() => {
//                     initMap();
//                 });
//             };
//         }
//     }, []);

//     const initMap = () => {
//         //console.log("window.kakao.maps 객체 확인됨!", window.kakao);

//         const container = document.getElementById("map");
//         if (!container) {
//             console.error("지도를 표시할 div(#map)를 찾을 수 없습니다.");
//             return;
//         }

//         const options = {
//             center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
//             level: 3,
//         };
//         const mapInstance = new window.kakao.maps.Map(container, options);
//         setMap(mapInstance);
//         //console.log("지도 생성됨!");

//         // 지도 클릭 시 마커 추가 이벤트 리스너 등록
//         window.kakao.maps.event.addListener(mapInstance, "click", function (mouseEvent) {
//             addMarker(mouseEvent.latLng, mapInstance);
//         });
//     };

//     // 마커 추가 함수
//     const addMarker = (position, mapInstance) => {
//         console.log("📍 마커 추가됨!", position);

//         const marker = new window.kakao.maps.Marker({
//             position: position,
//             map: mapInstance,
//         });

//         const infowindow = new window.kakao.maps.InfoWindow({
//             content: `<div style="padding:5px;">새로운 위치</div>`,
//             removable: true,
//         });

//         // 마커 클릭 시 인포윈도우 표시 및 수정 UI 활성화
//         window.kakao.maps.event.addListener(marker, "click", function () {
//             infowindow.open(mapInstance, marker);
//             setEditMode(markers.length);
//             setNewContent("새로운 위치");
//         });

//         setMarkers((prev) => [...prev, marker]);
//         setInfoWindows((prev) => [...prev, infowindow]);
//     };

//     // 인포윈도우 수정 함수
//     const handleUpdateInfoWindow = () => {
//         if (editMode === null) return;
//         const updatedContent = `<div style="padding:5px;">${newContent}</div>`;
//         infoWindows[editMode].setContent(updatedContent);
//         setEditMode(null); // 수정 모드 종료
//     };

//     return (
//         <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <h2>📌 지도를 클릭하면 마커가 생성됩니다!</h2>
//             <p>마커를 클릭하면 인포윈도우를 수정할 수 있습니다.</p>
//             <div id="map" style={{ width: "90%", height: "700px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}></div>

//             {/* 인포윈도우 수정 UI */}
//             {editMode !== null && (
//                 <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", background: "#fff" }}>
//                     <h3>📝 인포윈도우 수정</h3>
//                     <input
//                         type="text"
//                         value={newContent}
//                         onChange={(e) => setNewContent(e.target.value)}
//                         style={{ padding: "8px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
//                     />
//                     <button onClick={handleUpdateInfoWindow} style={{ padding: "8px 15px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
//                         수정 완료
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default KakaoMap;
