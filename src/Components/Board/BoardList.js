import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../Css/BoardList.module.css";
// import { toBeChecked } from "@testing-library/jest-dom/matchers";


// 썸네일이 보이는 게시판
const BoardList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category")
    ? parseInt(searchParams.get("category"))
    : 1;
  const searchTypeParam = searchParams.get("searchType");
  const keywordParam = searchParams.get("keyword");
  const token = 0;

  const [pageState, setPageState] = useState({
    1: { boardList: [], currentPage: 1, totalPages: 1 },
    2: { boardList: [], currentPage: 1, totalPages: 1 },
  });

  const [searchType, setSearchType] = useState(searchTypeParam || "title");
  const [keyword, setKeyword] = useState(keywordParam || "");
  const [isSearching, setIsSearching] = useState(
    !!searchTypeParam && !!keywordParam
  );

  const extractThumbnail = (post) => {
    if (post.thumbnail) return post.thumbnail;
    if (!post.content)
      return "http://3.39.66.94:8080/mymy/resources/images/default-thumbnail.jpg";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = post.content;
    const imgTag = tempDiv.querySelector("img");

    return imgTag
      ? imgTag.src
      : "http://3.39.66.94:8080/mymy/resources/images/default-thumbnail.jpg";
  };

  const filterBoardList = (boardList, token) => {
    let loggedInUserId = null;

    if (token) {
      try {
        //console.log("저장된 토큰:", token);
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
        loggedInUserId = decodedToken.sub; // `sub`에 사용자 ID 저장됨
        // console.log("로그인한 사용자 ID:", loggedInUserId);
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
      }
    }

    console.log("📝 필터링 전 게시글 목록:", boardList);

    const filteredList = boardList.filter(
      (post) => post.boardOpen === 1 || (loggedInUserId && post.id === loggedInUserId)
    );

    // console.log("필터링 후 게시글 목록:", filteredList);

    return filteredList;
  };



  const fetchBoardList = async (page, category, token) => {
    try {
      let params = { page, category, token };
      if (category === 1) {
        params.token = localStorage.getItem("accessToken");
      }
      const response = await axios.get(
        `http://3.39.66.94:8080/mymy/board/list`,
        { params }
      );

      // 비공개 글 필터링 추가
      const filteredBoardList = filterBoardList(response.data.boardList, localStorage.getItem("accessToken"));

      const updatedPageState = { ...pageState };
      updatedPageState[category] = {
        boardList: filteredBoardList.map((post) => ({
          ...post,
          thumbnail: extractThumbnail(post),
        })),
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
      setPageState(updatedPageState);
      setIsSearching(false);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패:", error);
    }
  };

  const searchBoardList = async (page) => {
    if (keyword.trim() === "") return;
    try {
      const response = await axios.get(
        `http://localhost:8080/mymy/board/search`,
        {
          params: { page, category, searchType, keyword },
        }
      );
      const filteredBoardList = filterBoardList(response.data.boardList, localStorage.getItem("accessToken"));

      const updatedPageState = { ...pageState };
      updatedPageState[category] = {
        boardList: filteredBoardList.map((post) => ({
          ...post,
          thumbnail: extractThumbnail(post),
        })),
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
      setPageState(updatedPageState);
      setIsSearching(true);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  useEffect(
    () => {
      if (isSearching) {
        searchBoardList(pageState[category].currentPage);
      } else {
        fetchBoardList(pageState[category].currentPage, category, token);
      }
    },
    [category, pageState[category].currentPage],
    token
  );

  const handleSearch = () => {
    if (keyword.trim() === "") {
      alert("검색어를 입력하세요.");
      return;
    }

    if (category !== 2 && searchType === "tag") {
      alert("이 카테고리에서는 해시태그 검색이 지원되지 않습니다.");
      return;
    }

    navigate(
      `/board/list?category=${category}&searchType=${searchType}&keyword=${encodeURIComponent(
        keyword
      )}`
    );
    const updatedPageState = { ...pageState };
    updatedPageState[category].currentPage = 1;
    setPageState(updatedPageState);
    setIsSearching(true);
    searchBoardList(1);
  };

  const handleCategoryChange = (newCategory) => {
    if (newCategory === 3) {
      navigate("/mateboard/list");
      return;
    }

    setSearchType("title");
    setKeyword("");
    setIsSearching(false);
    navigate(`/board/list?category=${newCategory}`);
  };

  // 글쓰기 버튼 클릭 시, 카테고리별로 다른 페이지로 이동하도록 설정
  const handleWritePost = () => {
    if (category === 3) {
      navigate(`/mateboard/write`); //여행 메이트 게시판 → MateBoardWrite.js
    } else {
      navigate(`/board/write?category=${category}`); // 계획 & 기록 게시판 → BoardWrite.js
    }
  };

  const handlePageChange = (page) => {
    const updatedPageState = { ...pageState };
    updatedPageState[category].currentPage = page;
    setPageState(updatedPageState);
  };

  const { boardList, currentPage, totalPages } = pageState[category];

  return (
    <div className={style.boardContainer}>
      <h1>📄 {category === 1 ? "계획 게시판" : "기록 게시판"}</h1>

      <div className={style.categoryBtns}>
        <button
          className={category === 1 ? "active" : ""}
          onClick={() => handleCategoryChange(1)}
        >
          계획 게시글
        </button>
        <button
          className={category === 2 ? "active" : ""}
          onClick={() => handleCategoryChange(2)}
        >
          기록 게시글
        </button>
        <button
          className={category === 3 ? "active" : ""}
          onClick={() => handleCategoryChange(3)}
        >
          여행 메이트 게시글
        </button>
      </div>
      <div className={`${style.searchContainer} Shadow`}>
        <select
          value={searchType}
          className={style.SearchTypeSelector}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="titleContent">제목+내용</option>
          {category === 2 && <option value="tag">해시태그</option>}
        </select>
        <input
          type="text"
          className={style.SearchKeyword}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button className={style.SearchBtn} onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className={style.boardGrid}>
        {boardList.map((post) => {
          console.log(post);
          return (
            <div key={post.boardNo} className={`Shadow ${style.boardItem}`}>
              <Link to={`/board/detail/${post.boardNo}`} className="link">
                <img src={post.thumbnail} alt="썸네일" className="thumbnail" />
                <h3 className={style.PostTitle}>
                  {post.boardOpen === 0 ? "🔒 " : ""}{post.title} 
                </h3>
                <div className="PostInfo">
                  <div>조회수<span className="value">{post.boardCnt}</span></div>

                  <span>좋아요 {post.boardLikes}</span>
                  <span>댓글 수 {post.repCnt}</span>
                </div>
                <div className="WriterId">
                  {/* 'anonymous'일 경우 '알 수 없음'으로 표시하고, 그 외의 경우에는 프로필 링크로 */}
                  {post.id === 'anonymous' ? '알 수 없음' :
                    <Link to={`/profile/${post.id}`} className={style.writer}>
                      {post.id}
                    </Link>}
                </div>

              </Link>
            </div>
          );
        })}
      </div>
      {/* 글쓰기 버튼 추가 */}
      <button className={style.writePostBtn} onClick={handleWritePost}>
        게시글 작성
      </button>

      

      <div className={style.Paginations}>
        {totalPages > 1 && (
          <div className={style.Pagination}>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                이전
              </button>
            )}
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={currentPage === page + 1 ? "current" : ""}
              >
                {page + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                다음
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardList;