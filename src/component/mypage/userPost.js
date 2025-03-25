import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import style from "../../Css/BoardList.module.css";


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
        <div className={style.mypostContainer}>
            <h1>📄 {userId} 님이 쓴 글</h1>
            <table className="mypost-table">
                <thead>
                    <tr>
                        <th className={style.bmNo}>번호</th>
                        <th className={style.bmTitle}>제목</th>
                        <th className={style.bmDate}>작성 일자</th>
                        <th className={style.bmView}>조회수</th>
                        <th className={style.bmView}>좋아요</th>
                    </tr>
                </thead>
            </table>
            <tbody>
                {posts.map((post) => (
                    <tr>
                        <td>번호{post.boardNo}</td>
                        <td>제목<Link to={`../../board/detail/${post.boardNo}`}>{post.title}</Link></td>
                        <td>작성일자{post.boardDate ? post.boardDate : "날짜 없음"}</td>
                        <td>조회수{post.boardCnt}</td>
                        <td>좋아요{post.boardLikes}</td>
                    </tr>
                ))}
                {posts.length === 0 && (
                    <tr><td colSpan="5">등록된 게시글이 없습니다.</td></tr>
                )}
            </tbody>

        </div>
    );
};

export default UserPost;