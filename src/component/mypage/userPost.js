import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

// 다른 유저가 작성한 글 목록
const UserPost = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await MypageApi.getUserPosts(userId);
                setPosts(res || []);
            } catch (err) {
                console.error("다른 유저 글 불러오기 실패:", err);
            }
        };
        fetchPosts();
    }, [userId]);

    return (
        <div className="userpost-container">
            <h2>📄 {userId} 님이 쓴 글</h2>
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
                            <span className="post-date">{post.boardDate || "날짜 없음"}</span>
                            &nbsp;<span>{post.boardCnt}</span>
                            &nbsp;<span>{post.boardLikes}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPost;
