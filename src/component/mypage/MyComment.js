import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
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
                console.log('댓글 불러오기',response)

                // 게시글 가져오기
                const postResponse = await MypageApi.getMyPosts(token);
                setPosts(postResponse || []);
            } catch (error) {
                console.error(" 내가 쓴 댓글 불러오기 실패:", error);
            }
        };
        fetchComments();
    }, [token]);


    return (

        <div className="mycomment-container">
            <h1>📄내가 쓴 댓글</h1>
            <table className="mycomment-table">
                <thead>
                    <tr>
                        <th className={style.bmNo}>번호</th>
                        <th className={style.bmContent}>원본 게시글</th>
                        <th className={style.bmTitle}>댓글 내용</th>
                        <th className={style.bmDate}>작성 날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map((comment) => (
                        <tr>
                            <td>{comment.boardNo}</td>
                            <td>{comment.originalPost}</td>
                            <td>{comment.content}</td>
                            <td>{comment.boardDate}</td>
                        </tr>

                    ))}

                </tbody>
            </table>

        </div>
    );
};

export default MyComment;