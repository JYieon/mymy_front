import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import MapApi from "../../api/MapApi"; 

const KakaoMap = ({boardNo}) => {
    // const { boardNo } = useParams();
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [infoWindows, setInfoWindows] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [newContent, setNewContent] = useState("");
    const [pendingMarker, setPendingMarker] = useState(null);

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

    const initMap = async () => {
        console.log("✅ initMap 실행됨!");
        console.log("✅",boardNo);
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
            response.data.forEach((markerData) => {
                loadMarker(markerData, mapInstance);
            });
        } catch (error) {
            console.error("🚨 마커 불러오기 실패:", error);
        }

        window.kakao.maps.event.addListener(mapInstance, "click", function (mouseEvent) {
            addMarker(mouseEvent.latLng, mapInstance);
        });
    };

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
            setPendingMarker({ marker, position, markerId: markerData.markerId });
        });

        setMarkers((prev) => [...prev, marker]);
    };

    // ✅ 새로운 마커 추가 (DB 저장 X)
    const addMarker = (position, mapInstance) => {
        console.log("🖱️ 지도 클릭! 마커 추가 중...");

        const marker = new window.kakao.maps.Marker({ position, map: mapInstance });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">입력 후 저장</div>`,
            removable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
            infowindow.open(mapInstance, marker);
            setNewContent(""); 
            setEditMode(null); 
            setPendingMarker({ marker, position });
        });

        setMarkers((prev) => [...prev, marker]);
        setInfoWindows((prev) => [...prev, infowindow]);
    };

    // ✅ 입력 후 마커 저장 (DB 저장 O)
    const handleSaveMarker = async () => {
        if (!pendingMarker || newContent.trim() === "") return;
        
        const markerData = {
            boardNo: boardNo,
            latitude: pendingMarker.position.getLat(),
            longitude: pendingMarker.position.getLng(),
            info: newContent,
        };
        console.log(markerData)
        try {
            await MapApi.addMarker(markerData);
            console.log("✅ 마커 저장 성공!", markerData);
            setPendingMarker(null); 
        } catch (error) {
            console.error("🚨 마커 저장 실패:", error);
        }
    };

    // ✅ 특정 마커 삭제
    const handleDeleteMarker = async (markerId, marker) => {
        try {
            await MapApi.deleteMarker(markerId);
            console.log(`🗑️ 마커 삭제 완료! markerId: ${markerId}`);
            marker.setMap(null);
            setMarkers((prev) => prev.filter((m) => m !== marker));
            setEditMode(null);
        } catch (error) {
            console.error("🚨 마커 삭제 실패:", error);
        }
    };

    // ✅ 모든 마커 삭제
    const handleDeleteAllMarkers = async () => {
        if (!boardNo) return;
        try {
            await MapApi.deleteAllMarkersByBoard(boardNo);
            console.log(`🗑️ 게시글 ${boardNo}의 모든 마커 삭제됨!`);
            markers.forEach((marker) => marker.setMap(null));
            setMarkers([]);
        } catch (error) {
            console.error(`🚨 모든 마커 삭제 실패:`, error);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>📌 게시판 {boardNo}의 지도</h2>
            <div id="map" style={{ width: "500px", height: "400px", borderRadius: "10px" }}></div>
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

            {editMode && pendingMarker && (
                <button onClick={() => handleDeleteMarker(pendingMarker.markerId, pendingMarker.marker)}
                    style={{ padding: "8px 15px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
                >
                    ❌ 삭제
                </button>
            )}

            <button onClick={handleDeleteAllMarkers} style={{ marginTop: "20px", padding: "8px 15px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                ❌ 모든 마커 삭제
            </button>
        </div>
    );
};

export default KakaoMap;
