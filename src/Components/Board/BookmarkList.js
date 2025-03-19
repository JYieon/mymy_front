import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import { useNavigate } from "react-router-dom";
import style from "../../Css/BoardDetail.module.css";

const BookmarkList = () => {
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
      //console.log("북마크 목록 API 응답:", response);

      setBookmarks(response.data.data || response.data);
    } catch (error) {
      console.error("북마크 목록 불러오기 실패:", error);
    }
  };

  // 북마크 해제
  const handleRemoveBookmark = async (boardNo) => {
    if (window.confirm("북마크를 해제하시겠습니까?")) {
      try {
        const success = await BoardApi.toggleBookmark(boardNo, token); // ✅ token 추가
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>🔖 내 북마크 목록</h1>

      {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.boardNo}
              style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}
                >
                  {bookmark.title}
                </h3>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  👤 {bookmark.id} | 📅{" "}
                  {new Date(bookmark.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/board/detail/${bookmark.boardNo}`)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    border: "1px solid #007bff",
                    backgroundColor: "white",
                    color: "#007bff",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  게시글 보기
                </button>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.boardNo)}
                  style={{
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  ❌ 해제
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
        <li
              key={"tem"}
              style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                className={style.tem}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate(`/board/detail/tem`)}
                >
                  북마크제북마크앤온앤온앤온앤온
                </h3>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  👤 temUser | 📅{" "}
                  2025-01-01
                </p>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/board/detail/tem`)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    border: "1px solid #007bff",
                    backgroundColor: "white",
                    color: "#007bff",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  게시글 보기
                </button>
                <button
                  onClick={() => handleRemoveBookmark("tem")}
                  style={{
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                
                  ❌ 해제
                </button>
              </div>
            </li>
          {/* 기존 코드 */}
                  {/* <p style={{ textAlign: "center", color: "#777" }}>
          ❌ 북마크된 게시글이 없습니다.
        </p> */}
        </ul>

      )}
    </div>
  );
};

export default BookmarkList;
