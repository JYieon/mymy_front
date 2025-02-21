import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardApi from "../../api/BoardApi";
import axios from "axios";
import $ from "jquery";
import "react-summernote-lite/dist/summernote-lite.min.css";

const BoardModify = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: "", content: "" });

    // 📥 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            if (!boardNo) {
                alert("게시글 번호가 누락되었습니다.");
                navigate("/board/list");
                return;
            }

            try {
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200 && res.data) {
                    setPost({
                        title: res.data.title,
                        content: res.data.content
                    });

                    // ✅ Summernote 초기화 및 기존 데이터 반영
                    $("#summernote").summernote({
                        height: 300,
                        lang: "ko-KR",
                        placeholder: "내용을 입력하세요...",
                        callbacks: {
                            onImageUpload: function (files) {
                                uploadImage(files[0]); // 이미지 업로드 처리
                            },
                            onInit: function () {
                                $("#summernote").summernote("code", res.data.content); // 기존 내용 반영
                            }
                        }
                    });
                }
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
                alert("게시글을 불러오는 데 실패했습니다.");
                navigate("/board/list");
            }
        };

        fetchPost();

        // ✅ 언마운트 시 Summernote 해제
        return () => {
            $("#summernote").summernote("destroy");
        };
    }, [boardNo, navigate]);

    // ✅ 이미지 업로드 함수 (URL 반환)
    const uploadImage = async (file) => {
        let formData = new FormData();
        formData.append("file", file);
    
        try {
            const res = await axios.post("http://localhost:8080/mymy/board/uploadSummernoteImageFile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (res.data.fileName) {
                // ✅ 게시글 작성 시와 동일하게 이미지 URL 구성
                let imageUrl = `http://localhost:8080/mymy/upload/${res.data.fileName}`;
                console.log("✅ 이미지 업로드 성공:", imageUrl);
                $("#summernote").summernote("insertImage", imageUrl);
            } else {
                alert("이미지 업로드 실패");
            }
        } catch (err) {
            console.error("❌ 이미지 업로드 실패:", err);
            alert("이미지 업로드 실패");
        }
    };

    // ✏️ 입력값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    // 🚀 게시글 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = $("#summernote").summernote("code");  // Summernote 내용 가져오기

        try {
            const res = await BoardApi.modify({
                boardNo: boardNo,
                title: post.title,
                content: content
            });

            if (res.status === 200) {
                alert("✅ 게시글이 성공적으로 수정되었습니다!");
                navigate(`/board/detail/${boardNo}`);
            }
        } catch (error) {
            console.error("❌ 게시글 수정 실패:", error);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>📄 게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                {/* 제목 입력 */}
                <div style={{ marginBottom: "10px" }}>
                    <label>제목:</label>
                    <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요"
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Summernote 에디터 */}
                <div style={{ marginBottom: "10px" }}>
                    <label>내용:</label>
                    <div id="summernote"></div>
                </div>

                {/* 버튼 */}
                <div>
                    <button type="submit" className="btn btn-primary">수정 완료</button>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginLeft: "10px" }}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardModify;
