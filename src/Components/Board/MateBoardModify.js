import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";

const MateBoardModify = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 기존 데이터 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await MateBoardApi.getMateBoardDetail(boardNo);
                // console.log("서버 데이터:", data.content);
                if (data) {
                    setTitle(data.title);
                    setContent(data.content.replace(/<br\s*\/?>/g, "\n"));
                }
            } catch (error) {
                console.error("게시글 수정 데이터 불러오기 실패:", error);
            }
        };
        fetchPost();
    }, [boardNo]);

    // 수정 요청
    const handleModify = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        const convertedContent = content.replace(/\n/g, "<br>");
        const updatedData = {
            title,
            content: convertedContent
        };

        try {
            const response = await MateBoardApi.modifyMateBoard(boardNo, updatedData);
            if (response) {
                alert("게시글이 수정되었습니다.");
                navigate(`/mateboard/detail/${boardNo}`);
            }
        } catch (error) {
            console.error("게시글 수정 실패:", error);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h2>📝 여행 메이트 게시글 수정</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>본문:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: "100%", height: "200px", padding: "8px" }}
                    />
                </div>

                <button type="button" onClick={handleModify} style={{ marginTop: "10px" }}>
                    수정 완료
                </button>
            </form>
        </div>
    );
};

export default MateBoardModify;
