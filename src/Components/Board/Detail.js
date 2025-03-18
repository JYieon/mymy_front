import BoardApi from "../../api/BoardApi";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reply from "./Reply";

const Detail = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [bookmarked, setBookmarked] = useState(false); // 북마크 상태
    const [hashtags, setHashtags] = useState([]); // 해시태그 상태
    const token = localStorage.getItem("accessToken");

    // 게시글 상세 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {                
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200) {
                    // console.log("받은 데이터:", res.data);
                    setData(res.data.post);         // 게시글 정보
                    setHashtags(res.data.hashtags); // 해시태그
                    checkBookmark();
                    checkLike(); // 좋아요 여부 및 개수 업데이트
                }
            } catch (error) {
                console.error("게시글 불러오기 실패:", error);
            }
        };
        fetchData();
    }, [boardNo]);

    // 좋아요 상태 및 개수 확인
    const checkLike = async () => {
        try {
            const likeRes = await BoardApi.checkLike(boardNo, token); // 좋아요 상태 확인
            const likesRes = await BoardApi.getLikes(boardNo); // 좋아요 개수 확인

            setLiked(likeRes.liked); // 사용자 좋아요 상태
            setData((prev) => prev ? { ...prev, boardLikes: likesRes } : prev); // 게시글 좋아요 개수 업데이트
        } catch (error) {
            console.error("좋아요 상태 확인 실패:", error);
        }
    };

    // 좋아요 토글 (UI 즉시 반영 후 서버 응답으로 다시 업데이트)
    const toggleLike = async () => {
        if (!data) return;

        const newLiked = !liked; // 좋아요 상태 반전
        const newLikes = liked ? data.boardLikes - 1 : data.boardLikes + 1; // 좋아요 개수 반전

        // UI 즉시 업데이트
        setLiked(newLiked);
        setData((prev) => (prev ? { ...prev, boardLikes: newLikes } : prev));

        try {
            const res = await BoardApi.toggleLike(boardNo, token);
            if (res) {
                // 서버에서 받은 최종 상태로 업데이트
                setLiked(res.liked);
                setData((prev) => prev ? { ...prev, boardLikes: res.likes } : prev);
                
                 // 추가: 목록에서 boardLikes 값 갱신 (BoardList에서 fetchBoardList 다시 실행)
            if (window.updateBoardList) {
                window.updateBoardList();  
            }
            
            }
        } catch (error) {
            console.error("좋아요 토글 실패:", error);
        }
    };

    // 북마크 상태 확인
    const checkBookmark = async () => {
        try {
            const res = await BoardApi.checkBookmark(boardNo, token);
            setBookmarked(res.data);
        } catch (error) {
            console.error("북마크 상태 확인 실패", error);
        }
    };

    // 북마크 토글
    const toggleBookmark = async () => {
        try {
            const success = await BoardApi.toggleBookmark(boardNo, token);
            if (success) {
                setBookmarked((prev) => !prev); // UI에서 즉시 반영
            }
        } catch (error) {
            console.error("북마크 토글 실패", error);
        }
    };

    // 게시글 삭제
    const deletePost = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const res = await BoardApi.delete(boardNo);
                if (res.status === 200) {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/board/list");
                }
            } catch (error) {
                console.error("게시글 삭제 실패", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 게시글 수정 페이지 이동
    const handleModify = () => {
        navigate(`/board/modifyForm/${data.boardNo}`);
    };

    // 로딩 중 화면
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
