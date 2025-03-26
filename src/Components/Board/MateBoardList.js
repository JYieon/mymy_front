import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";
import style from "../../Css/BoardList.module.css";

const MateBoardList = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 게시글 목록 불러오기
  const fetchBoardList = useCallback(async () => {
    try {
      const data = await MateBoardApi.getMateBoardList(page);
      console.log("가져온 데이터:", data);
      setBoardList(data);
      setIsSearching(false);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패:", error);
    }
  }, [page]);

  const searchBoardList = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }

    // console.log("검색 요청 파라미터 확인:", { searchType, keyword: keyword.trim(), page });

    try {
      const boardList = await MateBoardApi.searchMateBoardList(page, 3, searchType, keyword.trim());

      // console.log("boardList:", boardList);

      if (!boardList || boardList.length === 0) {
        // console.warn("검색 결과 없음!");
        alert("검색 결과가 없습니다.");
        setBoardList([]);
      } else {
        // console.log("boardList:", boardList);
        setBoardList([...boardList]);  // 배열 복사 후 상태 업데이트
      }

      setPage(1);
      setIsSearching(true);
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      setBoardList([]);
    }
  };



  // 페이지 변경 시 목록 불러오기 (검색 중이면 실행 안 함)
  useEffect(() => {
    if (!isSearching) {
      fetchBoardList();
    }
  }, [fetchBoardList, isSearching]);

  return (
    <div className={style.boardContainer}>
      <h1>📄 여행 메이트</h1>

      {/* 🔍 검색창 */}
      <div className={`${style.searchContainer} Shadow`}>
        <select
          value={searchType}
          className={style.SearchTypeSelector}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="titleContent">제목+내용</option>
        </select>
        <input
          type="text"
          className={style.SearchKeyword}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button className={style.SearchBtn} onClick={searchBoardList}>
          검색
        </button>
      </div>

      {/* 게시글 목록 테이블 */}
      <div className={style.boardTableContainer}>
        <table className={style.boardTable}>
          <thead className={style.thead}>
            <th className={style.bmNo}>번호</th>
            <th className={style.bmTitle}>제목</th>
            <th className={style.bmWriter}>작성자</th>
            <th className={style.bmDate}>작성일</th>
            <th className={style.bmReply}>댓글</th>
            <th className={style.bmView}>조회수</th>
          </thead>
          <tbody>
            {boardList.length > 0 ? (
              boardList.map((post, index) => (
                <tr
                  key={post.boardNo}
                  onClick={() => {
                    navigate(`/mateboard/detail/${post.boardNo}`);
                  }}>
                  <td>{index + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.id}</td>
                  <td>{!!post.date ? post.date.substring(0, 13) : "날짜 없음"}</td>
                  <td>{post.repCnt}</td>
                  <td>{post.boardCnt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6">등록된 게시글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 글쓰기 버튼 */}
      <button
        className={style.writePostBtn}
        onClick={() => {
          console.log("글쓰기 버튼 클릭!");
          navigate("/mateboard/write");
        }}>
        게시글 작성
      </button>
      {/* 페이지네이션 */}



      <div className={style.Paginations}>
        <div className={style.Pagination}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            &lt; 이전
          </button>
          <span> {page} </span>
          <button onClick={() => setPage(page + 1)}>다음 &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MateBoardList;