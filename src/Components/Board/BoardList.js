import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Css/BoardList.css";

const BoardList = () => {
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 썸네일 추출 함수 (이미지 없으면 기본 이미지)
    const extractThumbnail = (content) => {
        const match = content?.match(/<img.*?src=["'](.*?)["']/);
        return match ? match[1] : "http://localhost:8080/mymy/resources/images/default-thumbnail.jpg";
    };

    // 게시글 목록 불러오기
    const fetchBoardList = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/mymy/board/list?page=${page}`);
            setBoardList(response.data.boardList);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
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
                                src={extractThumbnail(post.content)}
                                alt="썸네일"
                                className="thumbnail"
                            />
                            <h3>{post.boardOpen === 0 ? "🔒 " : ""}{post.title}</h3>
                            <p>작성자: {post.id}</p>
                            <p>조회수: {post.boardCnt} | 댓글: {post.boardLikes}</p>
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
                ✍️ 글쓰기
            </Link>
        </div>
    );
};

export default BoardList;
