import BoardApi from "../../api/BoardApi";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Reply from "./Reply";
import style from "../../Css/BoardDetail.module.css";
import { input } from "framer-motion/client";

const Detail = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [bookmarked, setBookmarked] = useState(false); // 북마크 상태
  const [hashtags, setHashtags] = useState([]); // 해시태그 상태
  const token = localStorage.getItem("accessToken");

  // 게시글 상세 정보 불러오기
  useEffect(() => {
    console.log("게시글 상세 정보 불러오기");
    const fetchData = async () => {
      try {
        const res = await BoardApi.detail(boardNo);
        if (res.status === 200) {
          console.log("받은 데이터:", res.data);
          setData(res.data.post); // 게시글 정보
          setHashtags(res.data.hashtags); // 해시태그
          checkBookmark();
          checkLike();
        }
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 해시태그 클릭 시 해당 해시태그 검색 기능 추가
  const handleTagClick = (tag) => {
    console.log("해시태그 클릭 시 해당 해시태그 검색 기능 추가");
    navigate(
      `/board/list?category=2&searchType=tag&keyword=${encodeURIComponent(tag)}`
    );
  };

  // 좋아요 상태 확인
  useEffect(() => {
    console.log("좋아요 상태 확인");
    if (data?.boardCategory === 2) {
      checkLike();
      checkBookmark();
    }
  }, [liked]);

  const checkLike = async () => {
    try {
      console.log("checkLike");
      const res = await BoardApi.checkLike(boardNo);
      setLiked(res.liked);
      setData((prev) => ({ ...prev, boardLikes: res.likes }));
    } catch (error) {
      console.error("좋아요 상태 확인 실패:", error);
    }
  };

  // 좋아요 토글
  const toggleLike = async () => {
    try {
      console.log("toggleLike");
      const res = await BoardApi.toggleLike(boardNo);
      if (res) {
        setLiked(res.liked);
        setData((prev) => ({ ...prev, boardLikes: res.likes }));
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 북마크 상태 확인
  const checkBookmark = async () => {
    try {
      console.log("checkBookmark");
      const res = await BoardApi.checkBookmark(boardNo, token);
      setBookmarked(res.data);
    } catch (error) {
      console.error("북마크 상태 확인 실패", error);
    }
  };

  // 북마크 토글
  const toggleBookmark = async () => {
    try {
      console.log("toggleBookmark");
      const success = await BoardApi.toggleBookmark(boardNo, token);
      if (success) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error("북마크 토글 실패", error);
    }
  };

  // 게시글 삭제
  const deletePost = async () => {
    console.log("deletePost");
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const res = await BoardApi.delete(boardNo);
        if (res.status === 200) {
          alert("게시글이 삭제되었습니다.");
          navigate("/board/list");
        }
      } catch (error) {
        console.error("게시글 삭제 실패", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 수정 버튼 클릭 시 해당 카테고리의 글쓰기 페이지로 이동
  const handleModify = () => {
    console.log("handleModify");
    if (data.boardCategory === 1) {
      navigate(`/board/modifyForm/${data.boardNo}`); // 계획 게시글 수정
    } else if (data.boardCategory === 2) {
      navigate(`/board/modifyForm/${data.boardNo}`); // 기록 게시글 수정
    }
  };

  const kakaoShare=()=>{};
  const urlShare=()=>{};
  const PDFShare=()=>{};


  // 로딩 처리
  if (!data) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className={style.boardDetailContainer}>
      <Link to={`../list?category=${data.boardCategory}`} className="link">
        뒤로가기
      </Link>
      <div className={style.postContainer}>
        <div className={style.postInfoContainer}>
          <h1 className={style.title}>{data.title}</h1>
          <div className={style.postInfo}>
            <div>
              <span className={style.writer}>작성자 | {data.id}</span>
              <span className={style.date}>{data.date} 작성</span>
            </div>
            <hr />
            <div className={style.postStatus}>
              <span className={style.boardCnt}>조회수 {data.boardCnt}</span>
              <span className={style.boardLike}>좋아요 {data.boardLikes}</span>
              <div
                style={{ marginBottom: "20px" }}
                className={style.editBtnContainer}
              >
                {/* 계획 & 기록 게시글 모두 수정 & 삭제 가능 */}

                <button
                  onClick={handleModify}
                  className={style.editBtn}
                >
                  수정
                </button>
                <button onClick={deletePost} className={style.deleteBtn}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 본문 렌더링 */}
        <div
          className={style.content}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {/* 해시태그 표시 & 클릭 기능 추가 (기록 게시글만 표시) */}
        {data.boardCategory === 2 && (
          <div>
            {/* <h4>📌 해시태그:</h4> */}
            {hashtags.length > 0 ? (
              hashtags.map((tag, index) => (
                <span
                  key={index}
                  className={style.hashtag}
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p>해시태그가 없습니다.</p>
            )}
          </div>
        )}
      </div>
      <hr />

      {/* 기록 게시글(2)만 좋아요 & 북마크 가능 */}
      {data.boardCategory === 2 && (
        <div className={style.userReaction}>
          {/* 좋아요 버튼 */}
          <button onClick={toggleLike} className={style.likeBtn}>
            {liked ? (
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="tomato"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.36129 3.46995C6.03579 3.16081 6.76287 3 7.50002 3C8.23718 3 8.96425 3.16081 9.63875 3.46995C10.3129 3.77893 10.9185 4.22861 11.4239 4.78788C11.7322 5.12902 12.2678 5.12902 12.5761 4.78788C13.5979 3.65726 15.0068 3.00001 16.5 3.00001C17.9932 3.00001 19.4021 3.65726 20.4239 4.78788C21.4427 5.91515 22 7.42425 22 8.9792C22 10.5342 21.4427 12.0433 20.4239 13.1705L14.2257 20.0287C13.0346 21.3467 10.9654 21.3467 9.77429 20.0287L3.57613 13.1705C3.07086 12.6115 2.67474 11.9531 2.40602 11.2353C2.13731 10.5175 2 9.75113 2 8.9792C2 8.20728 2.13731 7.44094 2.40602 6.72315C2.67474 6.00531 3.07086 5.34694 3.57613 4.78788C4.08157 4.22861 4.68716 3.77893 5.36129 3.46995Z"
                  fill="tomato"
                />
              </svg>
            ) : (
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.8824 12.9557L10.5021 19.3071C11.2981 20.2067 12.7019 20.2067 13.4979 19.3071L19.1176 12.9557C20.7905 11.0649 21.6596 8.6871 20.4027 6.41967C18.9505 3.79992 16.2895 3.26448 13.9771 5.02375C13.182 5.62861 12.5294 6.31934 12.2107 6.67771C12.1 6.80224 11.9 6.80224 11.7893 6.67771C11.4706 6.31934 10.818 5.62861 10.0229 5.02375C7.71053 3.26448 5.04945 3.79992 3.59728 6.41967C2.3404 8.6871 3.20947 11.0649 4.8824 12.9557Z"
                  stroke="tomato"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            )}{" "}
            좋아요 {data.boardLikes}
          </button>
          {/* 북마크 버튼 */}
          <button onClick={toggleBookmark} className={style.bookmarkBtn}>
            {bookmarked ? (
              <svg
                className={style.bookmarkIcon}
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.75 3.25H8.24999C7.52064 3.25 6.82117 3.53973 6.30545 4.05546C5.78972 4.57118 5.49999 5.27065 5.49999 6V20C5.49898 20.1377 5.53587 20.2729 5.60662 20.391C5.67738 20.5091 5.77926 20.6054 5.90112 20.6695C6.02298 20.7335 6.16012 20.7627 6.2975 20.754C6.43488 20.7453 6.56721 20.6989 6.67999 20.62L12 16.91L17.32 20.62C17.4467 20.7063 17.5967 20.7516 17.75 20.75C17.871 20.7486 17.9903 20.7213 18.1 20.67C18.2203 20.6041 18.3208 20.5072 18.3911 20.3894C18.4615 20.2716 18.499 20.1372 18.5 20V6C18.5 5.27065 18.2103 4.57118 17.6945 4.05546C17.1788 3.53973 16.4793 3.25 15.75 3.25Z"
                  fill="#000000"
                />
              </svg>
            ) : (
              <svg
                className={style.bookmarkIcon}
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.75 20.75C17.5974 20.747 17.4487 20.702 17.32 20.62L12 16.91L6.68 20.62C6.56249 20.6915 6.42757 20.7294 6.29 20.7294C6.15243 20.7294 6.01751 20.6915 5.9 20.62C5.78491 20.5607 5.68741 20.4722 5.61722 20.3634C5.54703 20.2546 5.50661 20.1293 5.5 20V6C5.5 5.27065 5.78973 4.57118 6.30546 4.05546C6.82118 3.53973 7.52065 3.25 8.25 3.25H15.75C16.4793 3.25 17.1788 3.53973 17.6945 4.05546C18.2103 4.57118 18.5 5.27065 18.5 6V20C18.5005 20.1362 18.4634 20.2698 18.3929 20.3863C18.3223 20.5027 18.2209 20.5974 18.1 20.66C17.9927 20.7189 17.8724 20.7498 17.75 20.75ZM12 15.25C12.1532 15.2484 12.3033 15.2938 12.43 15.38L17 18.56V6C17 5.66848 16.8683 5.35054 16.6339 5.11612C16.3995 4.8817 16.0815 4.75 15.75 4.75H8.25C7.91848 4.75 7.60054 4.8817 7.36612 5.11612C7.1317 5.35054 7 5.66848 7 6V18.56L11.57 15.38C11.6967 15.2938 11.8468 15.2484 12 15.25Z"
                  fill="#000000"
                />
              </svg>
            )}
          </button>
        </div>
      )}
      <div>
        <input type="url" value={`현재 주소`} readOnly/>
        <button className={style.KakaoShare}>카톡 공유</button>
        <button className={style.pdfShare}>PDF 공유</button>
      </div>
      <button className="Sharebtn">공유하기</button>
      {/* 기록 게시글(2)만 댓글 가능 */}
      {data.boardCategory === 2 && (
        <>
          {/* 댓글 섹션 */}
          <Reply boardNo={boardNo} />
        </>
      )}
    </div>
  );
};

export default Detail;
