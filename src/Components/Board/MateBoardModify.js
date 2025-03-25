import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MateBoardApi from "../../api/MateBoardApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardModify.module.css";
const MateBoardModify = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState(""); // 작성자 ID
    const [loggedInUserId, setLoggedInUserId] = useState(""); // 로그인한 사용자 ID

    // ✅ 로그인한 사용자 및 게시글 정보 가져오기
    useEffect(() => {
        if (!token) {
            alert("🚫 로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // 🔹 로그인한 사용자 정보 가져오기
                const userRes = await ChatApi.getUserInfo(token);
                if (userRes && userRes.id) {
                    setLoggedInUserId(userRes.id);
                    console.log("🔑 로그인한 사용자 ID:", userRes.id);
                }

                // 🔹 게시글 상세 조회
                const postRes = await MateBoardApi.getMateBoardDetail(boardNo);
                if (postRes) {
                    setTitle(postRes.title);
                    setContent(postRes.content);
                    setAuthorId(postRes.id); // 작성자 ID 저장
                    console.log("📌 게시글 데이터:", postRes);
                } else {
                    alert("🚫 게시글을 찾을 수 없습니다.");
                    navigate("/mateboard/list");
                }
            } catch (error) {
                console.error("🚨 데이터 불러오기 실패:", error);
                alert("🚫 게시글을 찾을 수 없습니다.");
                navigate("/mateboard/list");
            }
        };

        fetchData();
    }, [boardNo, token, navigate]);

    // ✅ 게시글 수정 요청
    const handleModify = async () => {
        if (!title.trim() || !content.trim()) {
            alert("🚨 제목과 내용을 입력해주세요.");
            return;
        }

        // 🔹 로그인한 사용자와 작성자가 다르면 수정 불가
        if (String(loggedInUserId).trim() !== String(authorId).trim()) {
            alert("🚫 작성자만 수정할 수 있습니다.");
            return;
        }

        const updatedData = { title, content };

        try {
            await MateBoardApi.modifyMateBoard(boardNo, updatedData, token);
            alert("✅ 게시글이 성공적으로 수정되었습니다.");
            navigate(`/mateboard/detail/${boardNo}`);
        } catch (error) {
            console.error("❌ 게시글 수정 실패:", error);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    };

    return (


        <div className={style.editorContainer}>
            <Link to={`../list`} className={`link`}>
                뒤로가기
            </Link>
            <h1>📝 여행 메이트 게시글 수정</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className={`Shadow ${style.editorContainerItem}`}>
                    <label>제목:</label>
                    <input
                        className={style.input}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <textarea
                        className={style.textarea}
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
