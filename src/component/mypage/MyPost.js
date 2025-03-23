import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import style from "../../Css/BoardList.module.css";

//내가 쓴 글 목록
const MyPost = () => {
    const [posts, setPosts] = useState([]);//내가 쓴 글 목록 저장 
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

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
        <div className={style.mypostContainer}>
            <h1>📄내가 쓴 글</h1>
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
                <tbody>
                    {posts.map((post) => (
                        <tr>
                            <td>{post.boardNo}</td>
                            <td><Link to={`../../board/detail/${post.boardNo}`}>{post.title}</Link></td>
                            <td>{post.boardDate ? post.boardDate : "날짜 없음"}</td>
                            <td>{post.boardCnt}</td>
                            <td>{post.boardLikes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {posts.length === 0 && (
                <tr><td colSpan="5">등록된 게시글이 없습니다.</td></tr>
            )}


        </div>
    );
};

export default MyPost;
