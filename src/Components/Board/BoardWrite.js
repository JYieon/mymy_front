import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import BoardApi from "../../api/BoardApi";
import SummernoteLite from "react-summernote-lite";

import "react-summernote-lite/dist/summernote-lite.min.css";
// ✅ Summernote 관련 CSS & JS 불러오기


const BoardWrite = () => {
  const [title, setTitle] = useState("");
  const [boardOpen, setBoardOpen] = useState(1); // 기본값 공개 (1)
  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ jQuery 로드 확인 후 할당
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
            console.log("✅ Summernote 초기화 완료");
          },
        },
      });
    }

    return () => {
      if (editor) {
        $(editor).summernote("destroy"); // ✅ 컴포넌트 언마운트 시 제거
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
      console.error("❌ 이미지 업로드 실패:", err);
      alert("이미지 업로드 실패");
    }
  };

  // ✅ 게시글 작성 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = $(editorRef.current).summernote("code"); // Summernote 내용 가져오기
    const postData = { title, boardOpen, content };

    try {
      const res = await BoardApi.writeSave(postData);
      if (res.status === 200) {
        alert("게시글이 등록되었습니다!");
       navigate("/board/list");
      }
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
      alert("게시글 등록 실패");
    }
  };

  return (
    <div>
        <h2>📄 게시글 작성</h2>
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
                <select
                    value={boardOpen}
                    onChange={(e) => setBoardOpen(parseInt(e.target.value))}
                    className="form-control"
                >
                    <option value={1}>공개</option>
                    <option value={0}>비공개</option>
                </select>
            </div>

            <div>
                <label>본문:</label>
                <div ref={editorRef}></div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
                작성 완료
            </button>
        </form>
    </div>
  );
};

export default BoardWrite;