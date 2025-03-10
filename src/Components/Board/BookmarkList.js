import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import { useNavigate } from "react-router-dom";

const BookmarkList = () => {
    const [bookmarks, setBookmarks] = useState([]); // 북마크 목록 상태
    const navigate = useNavigate();

    // 북마크 목록 불러오기
    const fetchBookmarks = async () => {
        try {
            const bookmarkData = await BoardApi.getBookmarkList();
            // console.log("가져온 북마크 데이터:", bookmarkData);
            setBookmarks(bookmarkData); // 배열 상태 업데이트
        } catch (error) {
           // console.error("❌ 북마크 목록 불러오기 실패:", error);
        }
    };

    // 북마크 해제
    const handleRemoveBookmark = async (boardNo) => {
        if (window.confirm("북마크를 해제하시겠습니까?")) {
            try {
                const success = await BoardApi.toggleBookmark(boardNo);
                if (success) {
                    alert("북마크가 해제되었습니다.");
                    fetchBookmarks(); // 북마크 목록 새로고침
                }
            } catch (error) {
                // console.error("❌ 북마크 해제 실패:", error);
            }
        }
    };

    // 페이지 로드 시 북마크 목록 불러오기
    useEffect(() => {
        fetchBookmarks();
    }, []);

    return (
        <div>
            <h2>🔖 내 북마크 목록</h2>
            {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <li key={bookmark.boardNo} style={{ marginBottom: "10px" }}>
                            <h3>{bookmark.title}</h3>
                            <p>{bookmark.content}</p>
                            <button onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}>
                                게시글 보기
                            </button>
                            <button onClick={() => handleRemoveBookmark(bookmark.boardNo)} style={{ marginLeft: "10px" }}>
                                북마크 해제
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>북마크된 게시글이 없습니다.</p>
            )}
        </div>
    );
};

export default BookmarkList;
