import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../../Css/BoardList.css";

const BoardList = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category") ? parseInt(searchParams.get("category")) : 1; // 기본값: 계획 게시글

    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 게시글 목록 불러오기 (카테고리별)
    const fetchBoardList = async (page, category) => {
        try {
            const response = await axios.get(`http://localhost:8080/mymy/board/list?page=${page}&category=${category}`);
            setBoardList(response.data.boardList);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("게시글 목록 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchBoardList(currentPage, category);
    }, [currentPage, category]);

    // 페이지 이동 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="board-container">
            <h1>📄 {category === 1 ? "계획 게시글 목록" : "기록 게시글 목록"}</h1>

            {/* 카테고리 선택 버튼 */}
            <div className="category-buttons">
                <Link to="/board/list?category=1" className={category === 1 ? "active" : ""}>계획 게시글</Link>
                <Link to="/board/list?category=2" className={category === 2 ? "active" : ""}>기록 게시글</Link>
            </div>

            {/* 게시글 목록 (3x3 그리드) */}
            <div className="board-grid">
                {boardList.map((post) => (
                    <div key={post.boardNo} className="board-item">
                        <Link to={`/board/detail/${post.boardNo}`}>
                            <img
                                src={post.thumbnail || "http://localhost:8080/mymy/resources/images/default-thumbnail.jpg"}
                                alt="썸네일"
                                className="thumbnail"
                            />
                            <h3>{post.boardOpen === 0 ? "🔒 " : ""}{post.title}</h3>
                            <p>작성자: {post.id}</p>
                            <p>조회수: {post.boardCnt} | 좋아요: {post.boardLikes}</p>
                        </Link>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                {currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>}
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={currentPage === page + 1 ? "current" : ""}
                    >
                        {page + 1}
                    </button>
                ))}
                {currentPage < totalPages && <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>}
            </div>

            {/* 글쓰기 버튼 */}
            <Link to={`/board/write?category=${category}`} className="btn btn-primary">글쓰기</Link>
        </div>
    );
};

export default BoardList;
