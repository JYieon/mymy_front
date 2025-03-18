import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

//내가 쓴 댓글 목록록
const MyComment = () => {
    const { userId } = useParams(); //url에서 id 가져옴옴
    const [comments, setComments] = useState([]);//내가 쓴 댓글 목록 저장장
    //내가 작성한 댓글 불러옴옴
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await MypageApi.getMyComments(userId);//api요청청
                setComments(response || []);//댓글 데이터가 없으면 빈 배열로 저장장
            } catch (error) {
                console.error(" 내가 쓴 댓글 불러오기 실패:", error);
            }
        };
        fetchComments();
    }, [userId]);//id가 바뀌면 재실행

    return (
        <div className="mycomment-container">
            <h2>내가 쓴 댓글</h2>
            {comments.length === 0 ? (
                <p className="no-data">작성한 댓글이 없습니다.</p>
            ) : (
                <ul className="mycomment-list">
                    {comments.map((comment) => (
                        <li key={comment.boardNo} className="mycomment-item">
                            <Link to={`/board/detail/${comment.boardNo}`}>
                                <p className="comment-content">"{comment.content}"</p>
                                <p className="comment-date">{comment.date}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyComment;
