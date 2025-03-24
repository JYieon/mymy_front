import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import style from "../../Css/BoardList.module.css";


//내가 쓴 댓글 목록
const MyComment = () => {
    const [comments, setComments] = useState([]);//내가 쓴 댓글 목록 저장
    const [posts, setPosts] = useState([]);  // 내가 작성한 게시글 (추가)
    const token = localStorage.getItem("accessToken")
    //내가 작성한 댓글 불러옴
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await MypageApi.getMyComments(token);//api요청
                setComments(response || []);//댓글 데이터가 없으면 빈 배열로 저장

                // 게시글 가져오기
                const postResponse = await MypageApi.getMyPosts(token);
                setPosts(postResponse || []);
            } catch (error) {
                console.error(" 내가 쓴 댓글 불러오기 실패:", error);
            }
        };
        fetchComments();
    }, [token]);

       // 댓글이 속한 게시글의 제목을 찾는 함수
       const getPostTitle = (boardNo,title) => {
        const post = posts.find(p => p.boardNo === boardNo);
        return post ? post.title : "탈퇴한 회원원";
    };

    
    return (
        
        <div className="mycomment-container">
            <h1>📄내가 쓴 댓글</h1>
            
            <table className="mycomment-table">
                <thead>
                    <tr>
                        <th className={style.bmNo}>번호</th>
                        <th className={style.bmTitle}>게시글 제목</th>
                        <th className={style.bmDate}>댓글 내용</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map((cmt) => (
                        <tr>
                            <td>{cmt.boardNo}</td>
                            <td>{getPostTitle(cmt.boardNo)}</td>
                            <td>{cmt.content}</td>
                        </tr>
                    ))}
                    {posts.length === 0 && (
                        <tr><td colSpan="3">등록된 댓글이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyComment;
