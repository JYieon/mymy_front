import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";

const MateBoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 게시글 작성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            id: "a", // 임시 ID (추후 로그인 연동 시 변경)
        };

        console.log("전송할 데이터:", postData);  // 전송 전 데이터 확인

        try {
            await MateBoardApi.writeMateBoard(postData);
            alert("게시글이 등록되었습니다!");
            navigate("/mateboard/list"); // 목록으로 이동
        } catch (error) {
            alert("게시글 작성에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>📝 여행 메이트 게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <label>제목:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />

                <label>내용:</label>
                <textarea
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
