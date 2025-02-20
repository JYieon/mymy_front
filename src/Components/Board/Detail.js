import BoardApi from "../../api/BoardApi";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Detail = () => {
    const { boardNo } = useParams(); 
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [bookmarked, setBookmarked] = useState(false); // 북마크 상태

    // ✅ 게시글 상세 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200 && res.data) {
                    setData(res.data);
                    // 좋아요와 북마크 상태 확인
                    checkLike();
                    checkBookmark();
                }
            } catch (error) {
                console.error("게시글 불러오기 실패", error);
            }
        };

        fetchData();
    }, [boardNo]);

    // ✅ 좋아요 상태 확인
    const checkLike = async () => {
        try {
            const res = await BoardApi.checkLike(boardNo);
            setLiked(res.data); // true: 좋아요 상태, false: 비활성화 상태
        } catch (error) {
            console.error("좋아요 상태 확인 실패", error);
        }
    };

    // ✅ 좋아요 토글
    const toggleLike = async () => {
        try {
            const res = await BoardApi.toggleLike(boardNo);
            if (res.status === 200) {
                setLiked(res.data.liked); // true 또는 false 반환
                setData({ ...data, boardLikes: res.data.likes });
            }
        } catch (error) {
            console.error("좋아요 토글 실패", error);
        }
    };

    // ✅ 북마크 상태 확인
    const checkBookmark = async () => {
        try {
            const res = await BoardApi.checkBookmark(boardNo);
            setBookmarked(res.data); // true: 북마크됨, false: 북마크 안됨
        } catch (error) {
            console.error("북마크 상태 확인 실패", error);
        }
    };

    // ✅ Detail.jsx 수정
const toggleBookmark = async () => {
    try {
        const success = await BoardApi.toggleBookmark(boardNo);
        if (success) {
            setBookmarked(!bookmarked); // 상태 반전
        }
    } catch (error) {
        console.error("북마크 토글 실패", error);
    }
};


    // ✅ 게시글 삭제
    const deletePost = async (boardNo) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const res = await BoardApi.delete(boardNo);
                if (res.status === 200) {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/board/list"); // 목록 페이지로 이동
                }
            } catch (error) {
                console.error("게시글 삭제 실패", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // ✅ 로딩 중 처리
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

            {/* ✅ 게시글 본문 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

            <hr />
            {/* ✅ 좋아요 버튼 */}
            <button onClick={toggleLike}>
                {liked ? "❤️ 좋아요 취소" : "🤍 좋아요"} ({data.boardLikes})
            </button>

            {/* ✅ 북마크 버튼 */}
            <button onClick={toggleBookmark}>
                {bookmarked ? "🔖 북마크 삭제" : "📌 북마크 추가"}
            </button>

            {/* ✅ 수정 및 삭제 버튼 */}
            <a href={`/board/modifyForm/${data.boardNo}`} className="btn btn-warning">수정</a>
            <button onClick={() => deletePost(data.boardNo)}>삭제</button>
        </div>
    );
};

export default Detail;
