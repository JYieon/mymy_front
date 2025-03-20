import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";
import ChatApi from "../../api/ChatApi";
import Reply from "./Reply";
import style from "../../Css/BoardDetail.module.css";

const MateBoardDetail = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(""); // 로그인한 사용자 ID
    const token = localStorage.getItem("accessToken");

    // ✅ 로그인한 사용자 정보 가져오기
    useEffect(() => {
        if (!token) return;

        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token);
                if (res.data) {
                    setLoggedInUserId(res.data.id);
                    console.log("🔑 로그인한 사용자 ID:", res.data.id);
                }
            } catch (error) {
                console.error("❌ 사용자 정보 가져오기 실패:", error);
            }
        };
        fetchUserInfo();
    }, [token]);

    // ✅ 게시글 상세 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await MateBoardApi.getMateBoardDetail(boardNo);
                if (res) {
                    setData(res);
                    console.log("📌 게시글 데이터:", res);
                    console.log("📌 게시글 데이터 (받아온 값):", res); // ✅ id: "eunmi"
                }
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
            }
        };
        fetchData();
    }, [boardNo]);

    // ✅ 상태 업데이트 후 데이터 확인
useEffect(() => {
    console.log("📌 업데이트된 data 상태:", data); // 🚨 이 로그에서 id가 없거나 undefined인지 확인
}, [data]);

    // ✅ 게시글 삭제
    const deletePost = async () => {
        if (!token) {
            alert("🚫 로그인이 필요합니다.");
            return;
        }

        if (!data || data.id !== loggedInUserId) {
            alert("🚫 작성자만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await MateBoardApi.deleteMateBoard(boardNo, token);
                alert("✅ 게시글이 삭제되었습니다.");
                navigate("/mateboard/list");
            } catch (error) {
                console.error("❌ 게시글 삭제 실패:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // ✅ 게시글 수정 페이지 이동
const handleModify = () => {
    if (!token) {
        alert("🚫 로그인이 필요합니다.");
        return;
    }

    console.log("🔍 로그인한 사용자 ID:", loggedInUserId);
    console.log("🔍 게시글 작성자 ID:", data.id);
    console.log("📌 데이터 타입 확인:", typeof data.id, typeof loggedInUserId);
    console.log("📌 문자열 변환 후 비교:", String(data.id).trim(), String(loggedInUserId).trim());

    // ✅ 타입 맞춰서 비교!
    if (!data || String(data.id).trim() !== String(loggedInUserId).trim()) {
        alert("🚫 작성자만 수정할 수 있습니다.");
        return;
    }

    navigate(`/mateboard/modify/${boardNo}`);
};


    if (!data) {
        return <p>🔄 로딩 중...</p>;
    }

    return (
        <div className={style.boardDetailContainer}>
            <Link to="../list?category=3" className="link">뒤로가기</Link>
            <div className={style.postContainer}>
                <div className={style.postInfoContainer}>
                    <h1 className={style.title}>{data.title}</h1>
                    <div className={style.postInfo}>
                        <div>
                            <span className={style.writer}>작성자 | {data.id}</span>
                            <span className={style.date}>{data.date} 작성</span>
                        </div>
                        <hr />
                        <div className={style.postStatus}>
                            <span className={style.boardCnt}>조회수 {data.boardCnt}</span>
                            <div className={style.editBtnContainer}>
                                <button onClick={handleModify} className={style.editBtn}>수정</button>
                                <button onClick={deletePost} className={style.deleteBtn}>삭제</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 게시글 본문 */}
                <div className={style.content} dangerouslySetInnerHTML={{ __html: data.content }} />

                <hr />

                {/* ✅ 댓글 컴포넌트 추가 (category=3) */}
                <Reply boardNo={boardNo} category={3} token={token} />
            </div>
        </div>
    );
};

export default MateBoardDetail;
