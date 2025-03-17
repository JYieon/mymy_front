import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapApi from "../../api/MapApi"; 

const KakaoMap = () => {
    const { boardNo } = useParams(); 
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]); // 마커 리스트
    const [infoWindows, setInfoWindows] = useState([]); // 인포윈도우 리스트
    const [editMode, setEditMode] = useState(null); // 수정 중인 마커 ID
    const [newContent, setNewContent] = useState(""); // 인포윈도우 입력 값
    const [pendingMarker, setPendingMarker] = useState(null); // 입력 완료 후 저장할 마커 정보

    useEffect(() => {
        console.log("📡 현재 boardNo 값:", boardNo);
        if (window.kakao && window.kakao.maps) {
            initMap();
        } else {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2439a6057eda75a5be91df36deba63d4&autoload=false&libraries=services,clusterer,drawing`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(() => {
                    initMap();
                });
            };
        }
    }, []);

    // 지도 초기화 및 기존 마커 불러오기
    const initMap = async () => {
        console.log("✅ initMap 실행됨!");
        const container = document.getElementById("map");
        if (!container) return;

        const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780), 
            level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
        console.log("🗺️ 지도 생성됨!");

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

        window.kakao.maps.event.addListener(mapInstance, "click", function (mouseEvent) {
            addMarker(mouseEvent.latLng, mapInstance);
        });
    };

    // 기존 마커 불러오기
    const loadMarker = (markerData, mapInstance) => {
        const position = new window.kakao.maps.LatLng(markerData.latitude, markerData.longitude);
        const marker = new window.kakao.maps.Marker({ position, map: mapInstance });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${markerData.info}</div>`,
            removable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
            infowindow.open(mapInstance, marker);
            setEditMode(markerData.markerId);
            setNewContent(markerData.info);
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);
    };

    // 새로운 마커 추가 (DB에 저장 X)
    const addMarker = (position, mapInstance) => {
        console.log("🖱️ 지도 클릭! 마커 추가 중...");

        const marker = new window.kakao.maps.Marker({ position, map: mapInstance });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">입력 후 저장</div>`,
            removable: true,
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, "click", function () {
            infowindow.open(mapInstance, marker);
            setNewContent(""); // 빈 값으로 초기화
            setEditMode(null); // 기존 편집 모드 해제
            setPendingMarker({ marker, position }); // 나중에 저장할 마커 정보 설정
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);
    };

    // 입력 완료 후 DB에 저장
    const handleSaveMarker = async () => {
        if (!pendingMarker || newContent.trim() === "") return;
        
        const markerData = {
            boardNo: boardNo,
            latitude: pendingMarker.position.getLat(),
            longitude: pendingMarker.position.getLng(),
            info: newContent,
        };

        try {
            await MapApi.addMarker(markerData);
            console.log("✅ 마커 저장 성공!", markerData);
            setPendingMarker(null); // 대기 중인 마커 정보 초기화
        } catch (error) {
            console.error("🚨 마커 저장 실패:", error);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>📌 게시판 {boardNo}의 지도</h2>
            <p>마커를 클릭하고 인포윈도우 내용을 입력한 후 저장하세요.</p>
            <div id="map" style={{ width: "90%", height: "700px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}></div>

            {/* 인포윈도우 입력 후 저장 버튼 */}
            {pendingMarker && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", background: "#fff" }}>
                    <h3>📝 인포윈도우 입력</h3>
                    <input
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        style={{ padding: "8px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                    />
                    <button onClick={handleSaveMarker} style={{ padding: "8px 15px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        저장
                    </button>
                </div>
            )}
        </div>
    );
};

export default KakaoMap;
