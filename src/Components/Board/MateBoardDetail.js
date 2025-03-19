import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";
import Reply from "./Reply"; 
import style from "../../Css/BoardDetail.module.css"

const MateBoardDetail = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await MateBoardApi.getMateBoardDetail(boardNo);
                setPost(data);
            } catch (error) {
                console.error("게시글 상세 조회 실패:", error);
            }
        };

        fetchPost();
    }, [boardNo]);

    // 게시글 삭제
    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await MateBoardApi.deleteMateBoard(boardNo);
                alert("게시글이 삭제되었습니다.");
                navigate("/mateboard/list"); // 삭제 후 목록 페이지로 이동
            } catch (error) {
                console.error("게시글 삭제 실패:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 게시글 수정 페이지로 이동
    const handleModify = () => {
        navigate(`/mateboard/modify/${boardNo}`);
    };

    if (!post) {
        return <div>게시글을 불러오는 중...</div>;
    }

    return (
        <div className="mate-board-detail">
            <h2>{post.title}</h2>
            <p>작성자: {post.id} | 작성일: {post.date} | 조회수: {post.boardCnt}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

            {/* 수정 및 삭제 버튼 추가 */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleModify} style={{ marginRight: "10px" }}>수정</button>
                <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>삭제</button>
            </div>

            {/* 댓글 컴포넌트 추가 (category=3 전달) */}
            <Reply boardNo={boardNo} category={3} token={token}/>
        </div>
    );
};

export default MateBoardDetail;
