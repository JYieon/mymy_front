import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

//내가 쓴 글 목록
const MyPost = () => {
    const [posts, setPosts] = useState([]);//내가 쓴 글 목록 저장 
    const token = localStorage.getItem("accessToken");
    
    useEffect(() => {
        const fetchPosts = async () => {

            try {
                const response = await MypageApi.getMyPosts(token);//api 요청청
                setPosts(response || []);//게시글이 없으면 빈 배열 저장
                console.log("내가 쓴 글 데이터 확인:", response);
            } catch (error) {
                console.error(" 내가 쓴 글 불러오기 실패:", error);
            }
        };

        fetchPosts();
    }, [token]);

    return (
        <div className="mypost-container">
            <h2>📄내가 쓴 글</h2>
            <table className="mypost-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성 일자</th>
                        <th>조회수</th>
                        <th>좋아요</th>
                    </tr>
                </thead>
            </table>
            {posts.length === 0 ? (
                <p className="no-data">작성한 게시글이 없습니다.</p>
            ) : (
                <ul className="mypost-list">
                    {posts.map((post) => (
                        <li key={post.boardNo} className="mypost-item">
                            <span className="post-number">{post.boardNo}</span>
                            <Link to={`/board/detail/${post.boardNo}`}>
                                <span className="post-title">{post.title}</span>
                            </Link>
                            <span className="post-date">{post.boardDate ? post.boardDate : "날짜 없음"}</span>
                            &nbsp;<span>{post.boardCnt}</span>
                            &nbsp;<span>{post.boardLikes}</span>
                        </li>
                    ))}
                </ul>

            )}


        </div>
    );
};

export default MyPost;
