import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapApi from "../../api/MapApi"; // API 모듈 import

const KakaoMap = () => {
    const { boardNo } = useParams();
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]); // 마커 리스트
    const [infoWindows, setInfoWindows] = useState([]); // 인포윈도우 리스트

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
        console.log("initMap 실행됨!");
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
            console.log("DB에서 불러온 마커 데이터:", response.data);
            if (response.data.length > 0) {
                response.data.forEach((markerData) => {
                    loadMarker(markerData, mapInstance);
                });
            }
        } catch (error) {
            console.error("마커 불러오기 실패:", error);
        }
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
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);
    };

    // 모든 마커 삭제
    const handleDeleteAllMarkers = async () => {
        if (!boardNo) return;

        try {
            await MapApi.deleteAllMarkersByBoard(boardNo); // DB에서 삭제
            console.log(`🗑️ 게시글 ${boardNo}의 모든 마커 삭제됨!`);

            // 지도에서 삭제
            markers.forEach((marker) => marker.setMap(null)); 
            setMarkers([]); // 상태 초기화
            setInfoWindows([]); // 인포윈도우도 초기화
        } catch (error) {
            console.error(`마커 삭제 실패:`, error);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>📌 게시판 {boardNo}의 지도</h2>
            <p>마커를 클릭하고 인포윈도우 내용을 확인하세요.</p>
            <div id="map" style={{ width: "90%", height: "700px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}></div>

            {/* 모든 마커 삭제 버튼 */}
            <button
                onClick={handleDeleteAllMarkers}
                style={{ marginTop: "20px", padding: "8px 15px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
                ❌ 모든 마커 삭제
            </button>
        </div>
    );
};

export default KakaoMap;
