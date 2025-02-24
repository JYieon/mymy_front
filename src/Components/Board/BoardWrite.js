import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import BoardApi from "../../api/BoardApi";
import SummernoteLite from "react-summernote-lite"; // 없애면 작동 안됨

import "react-summernote-lite/dist/summernote-lite.min.css";
// summernote 연결

const BoardWrite = () => {
  const [title, setTitle] = useState("");
  const [boardOpen, setBoardOpen] = useState(1); // 기본값 공개 (1)
  const [hashtags, setHashtags] = useState([]); // 해시태그 상태
  const [tagInput, setTagInput] = useState(""); // 해시태그 입력 필드
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Summernote 에디터 초기화
  useEffect(() => {
    // jQuery 로드 확인 후 할당
    if (!window.$ || !window.jQuery) {
      window.$ = window.jQuery = $;
    }

    // ✅ editorRef.current를 지역 변수에 저장
    const editor = editorRef.current;

    if (editor) {
      $(editor).summernote({
        height: 300,
        lang: "ko-KR",
        callbacks: {
          onImageUpload: function (files) {
            uploadImage(files[0]);
          },
          onInit: function () {
            console.log("Summernote 초기화 완료");
          },
        },
      });
    }

    return () => {
      if (editor) {
        $(editor).summernote("destroy"); // 컴포넌트 언마운트 시 제거
      }
    };
  }, []);

  // ✅ 이미지 업로드 함수
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

  // ✅ 해시태그 추가 함수
  const addHashtag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !hashtags.includes(tagInput.trim())) {
      setHashtags([...hashtags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // ✅ 해시태그 삭제 함수
  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  // ✅ 게시글 작성 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = $(editorRef.current).summernote("code"); // Summernote 내용 가져오기
    const postData = { title, boardOpen, content, hashtags }; // 해시태그 포함

    try {
      const res = await BoardApi.writeSave(postData);
      if (res.status === 200) {
        alert("게시글이 등록되었습니다!");
        navigate("/board/list"); // 목록 페이지로
      }
    } catch (error) {
      alert("게시글 등록 실패");
    }
  };

  return (
    <div>
      <h2>📄 게시글 작성</h2>
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
            <button onClick={addHashtag} className="btn btn-secondary mt-1">추가</button>
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
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default BoardWrite;
