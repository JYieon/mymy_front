import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import { Link, useNavigate } from "react-router-dom";
import style from "../../Css/BoardList.module.css";

const BookmarkList = () => {
    const [bookmarks, setBookmarks] = useState([]); // 북마크 목록 상태
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const [bookmarks, setBookmarks] = useState([]); // 북마크 목록 상태
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    // 북마크 목록 불러오기
    const fetchBookmarks = async () => {
        try {
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await BoardApi.getBookmarkList(token);
    // 북마크 목록 불러오기
    const fetchBookmarks = async () => {
        try {
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await BoardApi.getBookmarkList(token);

            setBookmarks(response.data.data || response.data);
        } catch (error) {
            console.error("북마크 목록 불러오기 실패:", error);
        }
    };
            setBookmarks(response.data.data || response.data);
        } catch (error) {
            console.error("북마크 목록 불러오기 실패:", error);
        }
    };

    // 북마크 해제
    const handleRemoveBookmark = async (boardNo) => {
        if (window.confirm("북마크를 해제하시겠습니까?")) {
            try {
                const success = await BoardApi.toggleBookmark(boardNo, token);
                if (success) {
                    alert("북마크가 해제되었습니다.");
                    fetchBookmarks(); // 북마크 목록 새로고침
                }
            } catch (error) {
                console.error("북마크 해제 실패:", error);
            }
        }
    };

    // 페이지 로드 시 북마크 목록 불러오기
    useEffect(() => {

        fetchBookmarks();


    }, []); // 최초 렌더링 시 실행


    //   임시데이터


    return (
        <div>
            <h1>🔖 내 북마크 목록</h1>
            <div className={style.bookmarkContainer}>
                {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
                    <ul>

                        {bookmarks.map((bookmark) =>
                        (<li className={`Shadow ${style.bookmarkItem}`}
                            key={bookmark.boardNo} >
                            <div>
                                <h3
                                    className={style.bookmarkPostTitle}
                                    onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}
                                >
                                    {bookmark.title}
                                </h3>
                                <p className={style.bookmarkUserId}>
                                    <Link to={`/profile/${bookmark.id}`} className={`link`}>{bookmark.id}</Link> | {bookmark.date}
                                </p>
                            </div>
                            <div className={style.bmController}>
                                <button
                                    onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}
                            <div className={style.bmController}>
                                <button
                                    onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}
                                    className={style.viewPostBtn}
                                >
                                    게시글 보기
                                </button>
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.boardNo)}
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.boardNo)}
                                    className={style.removeBmBtn}
                                >
                                    해제
                                </button>
                            </div>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p className={style.nonData}>북마크된 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default BookmarkList;