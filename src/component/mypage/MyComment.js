import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

//내가 쓴 댓글 목록
const MyComment = () => {
    const { userId } = useParams(); //url에서 id 가져옴
    const [comments, setComments] = useState([]);//내가 쓴 댓글 목록 저장
    const [posts, setPosts] = useState([]);  // 내가 작성한 게시글 (추가)
    //내가 작성한 댓글 불러옴
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await MypageApi.getMyComments(userId);//api요청
                setComments(response || []);//댓글 데이터가 없으면 빈 배열로 저장

                // 게시글 가져오기
                const postResponse = await MypageApi.getMyPosts(userId);
                setPosts(postResponse || []);
            } catch (error) {
                console.error(" 내가 쓴 댓글 불러오기 실패:", error);
            }
        };
        fetchComments();
    }, [userId]);//id가 바뀌면 재실행

       // 댓글이 속한 게시글의 제목을 찾는 함수
       const getPostTitle = (boardNo,title) => {
        const post = posts.find(p => p.boardNo === boardNo);
        return post ? post.title : "게시글 없음";
    };

    
    return (
        
        <div className="mycomment-container">
            <h2>📄내가 쓴 댓글</h2>
            <table className="mycomment-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>게시글 제목</th>
                        <th>댓글 내용</th>
                    </tr>
                </thead>
            </table>
            {comments.length === 0 ? (
                <p className="no-data">작성한 댓글이 없습니다.</p>
            ) : (
                <ul className="mycomment-list">
                    {comments.map((comment) => (
                        
                        <li key={comment.boardNo} className="mycomment-item">
                            <span>{comment.boardNo}</span>
                            <span>{comment.title}</span>
                            <Link to={`/board/detail/${comment.boardNo}`}>
                            {getPostTitle(comment.boardNo)}
                            </Link>
                            <span className="comment-content">{comment.content}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyComment;
