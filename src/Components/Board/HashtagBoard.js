import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../Css/HashtagBoard.module.css";

const HashtagBoard = () => {
  const [hashtags, setHashtags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get("http://localhost:8080/mymy/board/hashtags");
        setHashtags(response.data);
      } catch (error) {
        console.error("❌ 해시태그 목록 불러오기 실패:", error);
      }
    };
    fetchHashtags();
  }, []);

  return (
    <div className={style.hashtagBoard}>
      <h1>📌 인기 해시태그</h1>
      <div className={style.hashtagList}>
        {hashtags.length > 0 ? (
          hashtags.map((tag, index) => (
            <button
              key={index}
              className={style.hashtag}
              onClick={() => navigate(`/board/list?category=2&searchType=tag&keyword=${encodeURIComponent(tag.TAG_NAME)}`)}
            >
              #{tag.TAG_NAME} ({tag.TAG_COUNT})
            </button>
          ))
        ) : (
          <p>등록된 해시태그가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default HashtagBoard;
