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

    // 게시글 상세 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {                
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200) {
                    console.log("받은 데이터:", res.data);
                    setData(res.data.post);         // 게시글 정보
                    setHashtags(res.data.hashtags); // 해시태그
                }
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
            }
        };

        fetchData();
    }, [boardNo]);

    // 해시태그 클릭 시 해당 해시태그 검색 기능 추가
    const handleTagClick = (tag) => {
        navigate(`/board/list?category=2&searchType=tag&keyword=${encodeURIComponent(tag)}`);
    };

    // 좋아요 상태 확인
    useEffect(() => {
        if (data?.boardCategory === 2) {
            checkLike();
            checkBookmark();
        }
    }, [data]);

    const checkLike = async () => {
        try {
            const res = await BoardApi.checkLike(boardNo);
            setLiked(res.liked);
            setData((prev) => ({ ...prev, boardLikes: res.likes }));
        } catch (error) {
            console.error("좋아요 상태 확인 실패:", error);
        }
    };

    // 좋아요 토글
    const toggleLike = async () => {
        try {
            const res = await BoardApi.toggleLike(boardNo);
            if (res) {
                setLiked(res.liked);
                setData((prev) => ({ ...prev, boardLikes: res.likes }));
            }
        } catch (error) {
            console.error("좋아요 토글 실패:", error);
        }
    };

    // 북마크 상태 확인
    const checkBookmark = async () => {
        try {
            const res = await BoardApi.checkBookmark(boardNo);
            setBookmarked(res.data);
        } catch (error) {
            console.error("북마크 상태 확인 실패", error);
        }
    };

    // 북마크 토글
    const toggleBookmark = async () => {
        try {
            const success = await BoardApi.toggleBookmark(boardNo);
            if (success) {
                setBookmarked(!bookmarked);
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

    // 수정 버튼 클릭 시 해당 카테고리의 글쓰기 페이지로 이동
    const handleModify = () => {
        if (data.boardCategory === 1) {
            navigate(`/board/modifyForm/${data.boardNo}`); // 계획 게시글 수정
        } else if (data.boardCategory === 2) {
            navigate(`/board/modifyForm/${data.boardNo}`); // 기록 게시글 수정
        }
    };

    // 로딩 처리
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

            {/* 게시글 본문 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

            {/* 해시태그 표시 & 클릭 기능 추가 (기록 게시글만 표시) */}
            {data.boardCategory === 2 && (
                <div>
                    <h4>📌 해시태그:</h4>
                    {hashtags.length > 0 ? (
                        hashtags.map((tag, index) => (
                            <span 
                                key={index} 
                                style={{ 
                                    marginRight: "10px", 
                                    color: "#007bff", 
                                    cursor: "pointer"
                                }}
                                onClick={() => handleTagClick(tag)}
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

            {/* 기록 게시글(2)만 좋아요 & 북마크 가능 */}
            {data.boardCategory === 2 && (
                <div style={{ marginBottom: "20px" }}>
                    {/* 좋아요 버튼 */}
                    <button onClick={toggleLike} style={{ marginRight: "10px" }}>
                        {liked ? "❤️ 좋아요" : "🤍 좋아요"} ({data.boardLikes})
                    </button>

                    {/* 북마크 버튼 */}
                    <button onClick={toggleBookmark}>
                        {bookmarked ? "🔖 북마크 삭제" : "📌 북마크 추가"}
                    </button>
                </div>
            )}

            {/* 계획 & 기록 게시글 모두 수정 & 삭제 가능 */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={handleModify} style={{ marginRight: "10px" }}>
                    수정
                </button>
                <button onClick={deletePost} style={{ backgroundColor: "red", color: "white" }}>
                    삭제
                </button>
            </div>

            {/* 기록 게시글(2)만 댓글 가능 */}
            {data.boardCategory === 2 && (
                <>
                    <hr />
                    {/* 댓글 섹션 */}
                    <Reply boardNo={boardNo} />
                </>
            )}
        </div>
    );
};

export default Detail;
