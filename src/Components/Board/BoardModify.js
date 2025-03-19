import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import BoardApi from "../../api/BoardApi";
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";
import ChatApi from "../../api/ChatApi";

const BoardModify = () => {
    const { boardNo } = useParams();
    const [title, setTitle] = useState("");
    const [boardOpen, setBoardOpen] = useState(1);
    const [hashtags, setHashtags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [boardCategory, setBoardCategory] = useState(1);
    const [authorId, setAuthorId] = useState(""); // 작성자 ID 저장
    const [loggedInUserId, setLoggedInUserId] = useState("")
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    // 페이지 진입 시 로그인한 사용자와 작성자를 비교
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            // 토큰에서 로그인한 사용자 ID 가져오기
            const userInfo = async () => {
                try {
                  const res = await ChatApi.getUserInfo(token);
                  if (res.data) {
                    setLoggedInUserId(res.data.id);
                  }
                } catch (error) {
                  console.log("사용자 정보 가져오기 실패 : ", error);
                }
              };
              userInfo();

            try {
                const res = await BoardApi.detail(boardNo);
                if (res.status === 200) {
                    const { title, content, boardOpen, hashtags, boardCategory, id } = res.data.post;
                    setTitle(title);
                    setBoardOpen(boardOpen);
                    setBoardCategory(boardCategory);
                    setAuthorId(id); // 작성자 ID 저장

                    if (boardCategory === 1) {
                        setHashtags([]);
                    } else {
                        setHashtags(hashtags || []);
                    }

                    // 작성자와 로그인한 사용자가 다르면 수정 페이지 접근 차단
                    if (authorId !== loggedInUserId) {
                        alert("작성자만 수정할 수 있습니다.");
                        navigate(`/board/detail/${boardNo}`);
                        return;
                    }

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
                navigate("/board/list");
            }
        };

        fetchData();

        return () => {
            $(editorRef.current).summernote("destroy");
        };
    }, [boardNo, navigate, token]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = $(editorRef.current).summernote("code");
    
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        // JWT 토큰에서 로그인한 사용자 ID 추출
        let loggedInUserId = null;
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            loggedInUserId = decodedToken.sub;
        } catch (error) {
            console.error("❌ JWT 디코딩 실패:", error);
            alert("토큰 오류: 다시 로그인해주세요.");
            return;
        }
    
        // 서버로 보낼 데이터 구성
        const postData = { 
            boardNo, 
            title, 
            boardOpen, 
            content, 
            id: loggedInUserId // id 추가
        };
    
        // 계획 게시글이 아니면 해시태그도 포함
        if (boardCategory !== 1) {
            postData.hashtags = hashtags;
        }
    
        //console.log("수정 요청 데이터:", postData);
        //console.log("보낼 토큰:", token);
    
        try {
            const res = await BoardApi.modify(postData, token);
            if (res.status === 200) {
                alert("게시글이 성공적으로 수정되었습니다!");
                navigate(`/board/detail/${boardNo}`);
            }
        } catch (error) {
            console.error("❌ 게시글 수정 실패:", error);
            alert("게시글 수정에 실패했습니다.");
        }
    };
    

    return (
        <div>
            <h2>📝 게시글 수정</h2>
            <form onSubmit={handleSubmit}>
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

                <div>
                    <label>공개 여부:</label>
                    <select value={boardOpen} onChange={(e) => setBoardOpen(parseInt(e.target.value))} className="form-control">
                        <option value={1}>공개</option>
                        <option value={0}>비공개</option>
                    </select>
                </div>

                <div>
                    <label>본문:</label>
                    <div ref={editorRef}></div>
                </div>

                {boardCategory !== 1 && (
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
                            <button onClick={addHashtag} className="btn btn-secondary mt-1">추가</button>
                        </div>

                        <div className="hashtag-list mt-2">
                            {hashtags.map((tag, index) => (
                                <span key={index} className="badge bg-primary me-1">
                                    #{tag}
                                    <button type="button" className="btn btn-sm btn-danger ms-1" onClick={() => removeHashtag(tag)}>x</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" className="btn btn-primary mt-3">수정 완료</button>
            </form>
        </div>
    );
};

export default BoardModify;
