import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import BoardApi from "../../api/BoardApi";
import SummernoteLite from "react-summernote-lite"; // 없애면 작동 안됨
import "react-summernote-lite/dist/summernote-lite.min.css";

const BoardModify = () => {
    const { boardNo } = useParams();
    const [title, setTitle] = useState("");
    const [boardOpen, setBoardOpen] = useState(1);
    const [hashtags, setHashtags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const editorRef = useRef(null);
    const navigate = useNavigate();

    // 게시글 및 해시태그 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200) {
                    const { title, content, boardOpen, hashtags } = res.data.post;
                    setTitle(title);
                    setBoardOpen(boardOpen);
                    setHashtags(hashtags || []);

                    // Summernote 초기화 및 본문 설정
                    $(editorRef.current).summernote({
                        height: 300,
                        lang: "ko-KR",
                        callbacks: {
                            onImageUpload: function (files) {
                                uploadImage(files[0]);
                            },
                        },
                    });

                    $(editorRef.current).summernote("code", content || "");
                }
            } catch (error) {
                console.error("게시글 불러오기 실패:", error);
            }
        };

        fetchData();

        return () => {
            $(editorRef.current).summernote("destroy");
        };
    }, [boardNo]);

    // 이미지 업로드 함수
    const uploadImage = async (file) => {
        let formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:8080/mymy/board/uploadSummernoteImageFile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.fileName) {
                let imageUrl = `http://localhost:8080/mymy/upload/${res.data.fileName}`;
                $(editorRef.current).summernote("insertImage", imageUrl);
            }
        } catch (err) {
            alert("이미지 업로드 실패");
        }
    };

    // 해시태그 추가
    const addHashtag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !hashtags.includes(tagInput.trim())) {
            setHashtags([...hashtags, tagInput.trim()]);
            setTagInput("");
        }
    };

    // 해시태그 삭제
    const removeHashtag = (tagToRemove) => {
        setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
    };

    // 게시글 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = $(editorRef.current).summernote("code");

        const postData = { boardNo, title, boardOpen, content, hashtags };

        try {
            const res = await BoardApi.modify(postData);
            if (res.status === 200) {
                alert("게시글이 성공적으로 수정되었습니다!");
                navigate(`/board/detail/${boardNo}`);
            }
        } catch (error) {
            alert("게시글 수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>📝 게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                {/* 제목 입력 */}
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* 공개 여부 */}
                <div>
                    <label>공개 여부:</label>
                    <select
                        value={boardOpen}
                        onChange={(e) => setBoardOpen(parseInt(e.target.value))}
                        className="form-control"
                    >
                        <option value={1}>공개</option>
                        <option value={0}>비공개</option>
                    </select>
                </div>

                {/* 본문 작성 */}
                <div>
                    <label>본문:</label>
                    <div ref={editorRef}></div>
                </div>

                {/* 해시태그 입력 */}
                <div>
                    <label>해시태그:</label>
                    <div className="hashtag-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="해시태그 입력 후 Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addHashtag(e)}
                        />
                        <button onClick={addHashtag} className="btn btn-secondary mt-1">
                            추가
                        </button>
                    </div>

                    {/* 해시태그 목록 */}
                    <div className="hashtag-list mt-2">
                        {hashtags.map((tag, index) => (
                            <span key={index} className="badge bg-primary me-1">
                                #{tag}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger ms-1"
                                    onClick={() => removeHashtag(tag)}
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* 작성 완료 버튼 */}
                <button type="submit" className="btn btn-primary mt-3">
                    수정 완료
                </button>
            </form>
        </div>
    );
};

export default BoardModify;
