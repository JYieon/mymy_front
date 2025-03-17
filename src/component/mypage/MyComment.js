import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

const MyComment = () => {
    const { userId } = useParams();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await MypageApi.getMyComments(userId);
                setComments(response || []);
            } catch (error) {
                console.error("❌ 내가 쓴 댓글 불러오기 실패:", error);
            }
        };
        fetchComments();
    }, [userId]);

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
                                <h3> {comment.originalPost}</h3>
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
