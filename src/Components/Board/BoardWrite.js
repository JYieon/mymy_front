import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import $, { post } from "jquery";
import BoardApi from "../../api/BoardApi";
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";
import MypageApi from "../../api/MypageApi";

const BoardWrite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const token = localStorage.getItem("accessToken")
  // URL에서 category 값 가져오기
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get("category") ? parseInt(searchParams.get("category")) : 1;
  const [category, setCategory] = useState(initialCategory);

  const [title, setTitle] = useState("");
  const [boardOpen, setBoardOpen] = useState(1);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [plans, setPlans] = useState([]); // 계획 목록
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Summernote 초기화
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인 이후 이용 부탁드립니다")
      window.location.href = "/"
    } else {
      if (!window.$ || !window.jQuery) {
        window.$ = window.jQuery = $;
      }
      const editor = editorRef.current;
      if (editor) {
        $(editor).summernote({
          height: 300,
          lang: "ko-KR",
          callbacks: {
            onImageUpload: function (files) {
              uploadImage(files[0]);
            },
          },
        });
      }
      return () => {
        if (editor) $(editor).summernote("destroy");
      };
    }


  }, []);

  // 기록 게시글 작성 시, 기존 계획 게시글 목록 불러오기
  useEffect(() => {
    if (category === 2) {
      BoardApi.getBoardList(1, 1, token).then((res) => {
        setPlans(res.data.boardList);
      });
    }
  }, [category]);

  // 이미지 업로드
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

  //레벨 업데이트
  const handleAfterActivity = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await MypageApi.updateLevel(token);
      console.log("레벨 갱신 성공");
    } catch (e) {
      console.error(" 레벨 갱신 실패:", e);
    }
  };

  // 계획 불러오기
  const handleLoadPlan = () => {
    if (selectedPlan) {
      BoardApi.detail(selectedPlan).then((res) => {
        $(editorRef.current).summernote("code", res.data.post.content);
      });
    }
  };

  // 게시글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = $(editorRef.current).summernote("code");
    const postData = { title, boardCategory: category, content };

    if (category === 2) postData.boardOpen = boardOpen;
    if (category === 2) postData.hashtags = hashtags;

    console.log("전송할 데이터:", postData);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("로그인 후 이용 부탁드립니다.");
        window.location.href = "/login";
        return;
      }

      // 게시글 저장 API 요청
      const res = await BoardApi.writeSave(postData, token);
      console.log("📩 서버 응답 데이터:", res.data);

      if (res.status === 200) {
        const boardNo = res.data.boardNo;
        console.log("✅ 반환된 boardNo:", boardNo);

        // 레벨 갱신 호출 추가
        await handleAfterActivity();

        if (category === 1) {
          // 계획 게시글 → 타임라인 페이지로 이동
          navigate(`/timeline/${boardNo}`);
        } else if (category === 2) {
          alert("게시글이 등록되었습니다!");
          navigate(`/board/list?category=${category}`);
        }
      }
    } catch (error) {
      alert("게시글 등록 실패");
      console.error("❌ 게시글 작성 오류:", error);
    }
  };




  return (
    <div>
      <h2>📄 {category === 1 ? "계획 게시글 작성" : "기록 게시글 작성"}</h2>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div>
          <label>제목:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        {/* 기록 게시글에만 공개 여부 & 해시태그 추가 */}
        {category === 2 && (
          <>
            <div>
              <label>공개 여부:</label>
              <select value={boardOpen} onChange={(e) => setBoardOpen(parseInt(e.target.value))}>
                <option value={1}>공개</option>
                <option value={0}>비공개</option>
              </select>
            </div>

            <div>
              <label>해시태그:</label>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
              <button onClick={addHashtag}>추가</button>
              {hashtags.map((tag, index) => (
                <span key={index} onClick={() => removeHashtag(tag)}>#{tag} ❌</span>
              ))}
            </div>

            {/* 계획 불러오기 버튼 */}
            <div>
              <label>계획 불러오기:</label>
              <select onChange={(e) => setSelectedPlan(e.target.value)}>
                <option value="">선택</option>
                {plans.map((plan) => (
                  <option key={plan.boardNo} value={plan.boardNo}>{plan.title}</option>
                ))}
              </select>
              <button type="button" onClick={handleLoadPlan}>불러오기</button>
            </div>
          </>
        )}

        {/* 본문 */}
        <div>
          <label>본문:</label>
          <div ref={editorRef}></div>
        </div>

        {/* 작성 완료 */}
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default BoardWrite;
