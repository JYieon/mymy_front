import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapApi from "../../api/MapApi"; 

const KakaoMap = () => {
    const { boardNo } = useParams(); 
    console.log("📡 현재 boardNo 값:", boardNo);

    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [infoWindows, setInfoWindows] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        console.log("🚀 useEffect 실행됨!");

        if (window.kakao && window.kakao.maps) {
            console.log("⚡ 카카오맵 API 이미 로드됨");
            initMap();
        } else {
            console.log("📌 카카오맵 스크립트 추가 중...");
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2439a6057eda75a5be91df36deba63d4&autoload=false&libraries=services,clusterer,drawing`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                console.log("✅ 카카오맵 스크립트 로딩 완료!");
                window.kakao.maps.load(() => {
                    initMap();
                });
            };
        }
    }, []);

    // ✅ 지도 초기화 및 마커 불러오기
    const initMap = async () => {
        console.log("✅ initMap 실행됨!");
        const container = document.getElementById("map");
        if (!container) {
            console.error("🚨 지도를 표시할 div(#map)를 찾을 수 없습니다.");
            return;
        }

        const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
            level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
        console.log("🗺️ 지도 생성됨!");

        // ✅ 해당 게시판의 마커 불러오기
        try {
            const response = await MapApi.fetchMarkers(boardNo);
            console.log("📍 DB에서 불러온 마커 데이터:", response.data);
            if (response.data.length > 0) {
                response.data.forEach((markerData) => {
                    loadMarker(markerData, mapInstance);
                });
            }
        } catch (error) {
            console.error("🚨 마커 불러오기 실패:", error);
        }

        // ✅ 지도 클릭 시 마커 추가 이벤트 리스너 등록
        window.kakao.maps.event.addListener(mapInstance, "click", function (mouseEvent) {
            console.log("🖱️ 지도 클릭! 마커 추가 중...");
            addMarker(mouseEvent.latLng, mapInstance);
        });
    };

    // ✅ DB에서 불러온 마커를 지도에 표시하는 함수
    const loadMarker = (markerData, mapInstance) => {
        console.log("📍 불러온 마커 추가:", markerData);

        const position = new window.kakao.maps.LatLng(markerData.latitude, markerData.longitude);
        const marker = new window.kakao.maps.Marker({ position, map: mapInstance });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${markerData.info}</div>`,
            removable: true,
        });

        // ✅ 마커 클릭 시 인포윈도우 표시 및 수정
        window.kakao.maps.event.addListener(marker, "click", function () {
            console.log("🖱️ 마커 클릭됨! 수정 모드 활성화");
            infowindow.open(mapInstance, marker);
            setEditMode(markerData.markerId);
            setNewContent(markerData.info);
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);
    };

    // ✅ 새로운 마커 추가 (지도 클릭 시)
    const addMarker = async (position, mapInstance) => {
        console.log("📍 새로운 마커 추가됨!", position);

        const marker = new window.kakao.maps.Marker({ position, map: mapInstance });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">새로운 위치</div>`,
            removable: true,
        });

        // ✅ 마커 클릭 시 인포윈도우 표시 및 수정
        window.kakao.maps.event.addListener(marker, "click", function () {
            console.log("🖱️ 새 마커 클릭됨! 수정 모드 활성화");
            infowindow.open(mapInstance, marker);
            setEditMode(markers.length);
            setNewContent("새로운 위치");
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);

        // ✅ DB에 저장
        const markerData = {
            boardNo: boardNo,
            latitude: position.getLat(),
            longitude: position.getLng(),
            info: "새로운 위치",
        };

        try {
            const response = await MapApi.addMarker(markerData);
            console.log("✅ 마커 저장 성공!", response.data);
        } catch (error) {
            console.error("🚨 마커 저장 실패:", error);
        }
    };

    // ✅ 인포윈도우 수정 함수
    const handleUpdateInfoWindow = async () => {
        if (editMode === null) return;
        console.log("✏️ 인포윈도우 수정 요청:", { markerId: editMode, newContent });

        try {
            await MapApi.updateMarkerInfo(editMode, newContent);
            console.log("✅ 인포윈도우 수정 완료!");

            // 프론트에서도 내용 변경
            const updatedContentHTML = `<div style="padding:5px;">${newContent}</div>`;
            infoWindows[editMode].setContent(updatedContentHTML);
            setEditMode(null);
        } catch (error) {
            console.error("🚨 인포윈도우 수정 실패:", error);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>📌 게시판 {boardNo}의 지도</h2>
            <p>지도를 클릭하면 마커가 추가되고, 마커를 클릭하면 수정 가능합니다.</p>
            <div id="map" style={{ width: "90%", height: "700px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}></div>

            {/* 인포윈도우 수정 UI */}
            {editMode !== null && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", background: "#fff" }}>
                    <h3>📝 인포윈도우 수정</h3>
                    <input
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        style={{ padding: "8px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                    />
                    <button onClick={handleUpdateInfoWindow} style={{ padding: "8px 15px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        수정 완료
                    </button>
                </div>
            )}
        </div>
    );
};

export default KakaoMap;
