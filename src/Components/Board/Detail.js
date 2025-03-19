import BoardApi from "../../api/BoardApi";
import ChatApi from "../../api/ChatApi"; 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reply from "./Reply";

const Detail = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [hashtags, setHashtags] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState("");
    const token = localStorage.getItem("accessToken");

    // 로그인한 사용자 정보 가져오기
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

    // 게시글 상세 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200) {
                    setData(res.data.post);
                    setHashtags(res.data.hashtags);
                    checkBookmark();
                    checkLike();
                }
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
            }
        };
        fetchData();
    }, [boardNo]);

    // 좋아요 상태 및 개수 확인
    const checkLike = async () => {
        try {
            const likeRes = await BoardApi.checkLike(boardNo, token);
            const likesRes = await BoardApi.getLikes(boardNo);

            setLiked(likeRes.liked);
            setData((prev) => prev ? { ...prev, boardLikes: likesRes } : prev);
        } catch (error) {
            console.error("❌ 좋아요 상태 확인 실패:", error);
        }
    };

    // 좋아요 토글
    const toggleLike = async () => {
        if (!data) return;

        const newLiked = !liked;
        const newLikes = liked ? data.boardLikes - 1 : data.boardLikes + 1;

        setLiked(newLiked);
        setData((prev) => (prev ? { ...prev, boardLikes: newLikes } : prev));

        try {
            const res = await BoardApi.toggleLike(boardNo, token);
            if (res) {
                setLiked(res.liked);
                setData((prev) => prev ? { ...prev, boardLikes: res.likes } : prev);
                if (window.updateBoardList) {
                    window.updateBoardList();
                }
            }
        } catch (error) {
            console.error("❌ 좋아요 토글 실패:", error);
        }
    };

    // 북마크 상태 확인
    const checkBookmark = async () => {
        try {
            const res = await BoardApi.checkBookmark(boardNo, token);
            setBookmarked(res.data);
        } catch (error) {
            console.error("❌ 북마크 상태 확인 실패", error);
        }
    };

    // 북마크 토글
    const toggleBookmark = async () => {
        try {
            const success = await BoardApi.toggleBookmark(boardNo, token);
            if (success) {
                setBookmarked((prev) => !prev);
            }
        } catch (error) {
            console.error("❌ 북마크 토글 실패", error);
        }
    };

    // 게시글 삭제
    const deletePost = async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 작성자 ID와 로그인한 사용자 ID 비교
        if (data.id !== loggedInUserId) {
            alert("작성자만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const res = await BoardApi.delete(boardNo, token);
                if (res.status === 200) {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/board/list");
                }
            } catch (error) {
                console.error("❌ 게시글 삭제 실패", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 게시글 수정 페이지 이동
    const handleModify = () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 작성자와 로그인한 사용자 비교
        if (data.id !== loggedInUserId) {
            alert("작성자만 수정할 수 있습니다.");
            return;
        }

        navigate(`/board/modifyForm/${data.boardNo}`);
    };

    if (!data) {
        return <p>로딩 중...</p>;
    }

    return (
        <div>
            <h2>{data.title}</h2>
            <p>작성자: {data.id}</p>
            <p>작성일: {data.date}</p>
            <p>조회수: {data.boardCnt}</p>
            <hr />

            {/* 게시글 본문 */}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

            {/* 해시태그 (기록 게시글만) */}
            {data.boardCategory === 2 && (
                <div>
                    <h4>📌 해시태그:</h4>
                    {hashtags.length > 0 ? (
                        hashtags.map((tag, index) => (
                            <span 
                                key={index} 
                                style={{ marginRight: "10px", color: "#007bff", cursor: "pointer" }}
                                onClick={() => navigate(`/board/list?category=2&searchType=tag&keyword=${encodeURIComponent(tag)}`)}
                            >
                                #{tag}
                            </span>
                        ))
                    ) : (
                        <p>해시태그가 없습니다.</p>
                    )}
                </div>
            )}

            <hr />

            {/* 좋아요 & 북마크 (기록 게시글만) */}
            {data.boardCategory === 2 && (
                <div style={{ marginBottom: "20px" }}>
                    <button onClick={toggleLike} style={{ marginRight: "10px" }}>
                        {liked ? "❤️ 좋아요" : "🤍 좋아요"} ({data.boardLikes})
                    </button>
                    <button onClick={toggleBookmark}>
                        {bookmarked ? "🔖 북마크 삭제" : "📌 북마크 추가"}
                    </button>
                </div>
            )}

            {/* 게시글 수정 & 삭제 */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={handleModify} style={{ marginRight: "10px" }}>
                    수정
                </button>
                <button onClick={deletePost} style={{ backgroundColor: "red", color: "white" }}>
                    삭제
                </button>
            </div>

            {/* 댓글 (기록 게시글만) */}
            {data.boardCategory === 2 && (
                <>
                    <hr />
                    <Reply boardNo={boardNo} />
                </>
            )}
        </div>
    );
};

export default Detail;
