import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";
import style from "../../Css/BoardModify.module.css";

const MateBoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const token = localStorage.getItem("accessToken");

    // 게시글 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
        };

        // 토큰 가져오기
        const token = localStorage.getItem("accessToken");

        // 토큰이 없으면 로그인 화면으로 이동
        if (!token) {
            alert("로그인 후 이용 부탁드립니다.");
            window.location.href = "/login";
            return;
        }

        try {
            // 토큰을 Authorization 헤더에 포함시켜 API 요청
            const res = await MateBoardApi.writeMateBoard(postData, token);
            if (res.status === 200) {
                alert("게시글이 등록되었습니다!");
                navigate("/mateboard/list"); // 목록으로 이동
            }
        } catch (error) {
            alert("게시글 작성에 실패했습니다.");
            console.error(error);
        }
    };

    return (
        <div className={style.editorContainer}>
            <Link to={`../list`} className={`link`}>
                뒤로가기
            </Link>
            <h1>📝 여행 메이트 게시글 작성</h1>

            <form onSubmit={handleSubmit}>
                <div className={`Shadow ${style.editorContainerItem}`}>
                    <label className={style.titleInput}>제목</label>
                    <input
                        type="text"
                        value={title}
                        className={style.input}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요."
                        required
                    />
                </div>
                <br />
                <textarea
                    className={style.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <br />

                <button type="submit">작성 완료</button>
            </form>
        </div>
    );
};

export default MateBoardWrite;
