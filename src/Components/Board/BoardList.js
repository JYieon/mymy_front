import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Css/BoardList.css";

const BoardList = () => {
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 게시글 목록 불러오기
    const fetchBoardList = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/mymy/board/list?page=${page}`);
            setBoardList(response.data.boardList);  // 게시글 데이터터
            setCurrentPage(response.data.currentPage);  // 현재 페이지
            setTotalPages(response.data.totalPages);    // 전체 페이지 수수
        } catch (error) {
            console.error("게시글 목록 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchBoardList(currentPage);
    }, [currentPage]);

    // 페이지 이동 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="board-container">
            <h1>📄 게시글 목록</h1>
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
                {currentPage > 1 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>
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
                    <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>
                )}
            </div>

            {/* 글쓰기 버튼 */}
            <Link to="/board/write" className="btn btn-primary">
                 글쓰기
            </Link>
        </div>
    );
};

export default BoardList;
