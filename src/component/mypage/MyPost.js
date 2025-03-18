import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

//내가 쓴 글 목록록
const MyPost = () => {
    const { userId } = useParams();
    const storedUserId = localStorage.getItem("userId"); //  로컬스토리지에서 가져오기
    const finalUserId = userId || storedUserId; //  URL에서 없으면 로컬 저장소에서 가져옴

    const [posts, setPosts] = useState([]);//내가 쓴 글 목록 저장 

    //내가 작성한 글 불러오기기
    useEffect(() => {
        const fetchPosts = async () => {
            if (!userId) {
                console.error(" userId가 존재하지 않습니다!");
                return;
            }
            console.log(" 현재 userId:", userId);

            try {
                const response = await MypageApi.getMyPosts(userId);//api 요청청
                setPosts(response || []);//게시글이 없으면 빈 배열 저장장
            } catch (error) {
                console.error(" 내가 쓴 글 불러오기 실패:", error);
            }
        };

        fetchPosts();
    }, [userId]);

    return (
        <div className="mypost-container">
            <h2>내가 쓴 글</h2>
            {posts.length === 0 ? (
                <p className="no-data">작성한 게시글이 없습니다.</p>
            ) : (
                <ul className="mypost-list">
                    {posts.map((post) => (
                        <li key={post.boardNo} className="mypost-item">
                            <Link to={`/board/detail/${post.boardNo}`}>
                                <h3>{post.title}</h3>
                                <p className="post-date">{post.date}</p>
                                <p>조회수: {post.boardCnt} | 좋아요: {post.boardLikes}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPost;
