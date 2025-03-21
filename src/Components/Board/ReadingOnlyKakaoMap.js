import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import MapApi from "../../api/MapApi"; 

const ReadingOnlyKakaoMap = ({boardNo}) => {
    // const { boardNo } = useParams();
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

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
            console.log('클릭 이벤트!')
        });

        setMarkers((prev) => [...prev, marker]);
    };

    

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>📌 게시판 {boardNo}의 지도</h2>
            <div id="map" style={{ width: "500px", height: "400px", borderRadius: "10px" }}></div>
        </div>
    );
};

export default ReadingOnlyKakaoMap;
