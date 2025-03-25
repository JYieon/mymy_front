import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../Css/HashtagBoard.module.css";

const HashtagBoard = () => {
  const [testTags, setTestTags] = useState([]);
  const [normalTags, setNormalTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSplitHashtags = async () => {
      try {
        const response = await axios.get("http://localhost:8080/mymy/board/hashtags/split");
        setTestTags(response.data.testTags);
        setNormalTags(response.data.normalTags);
      } catch (error) {
        console.error("❌ 해시태그 불러오기 실패:", error);
      }
    };
    fetchSplitHashtags();
  }, []);

  const renderTags = (tags) => {
    return tags.map((tag, index) => (
      <button
        key={index}
        className={style.hashtag}
        onClick={() =>
          navigate(
            `/board/list?category=2&searchType=tag&keyword=${encodeURIComponent(tag.TAG_NAME)}`
          )
        }
      >
        #{tag.TAG_NAME} ({tag.TAG_COUNT})
      </button>
    ));
  };

  return (
    <div className={style.hashtagBoard}>
      <section className={style.section}>
  <h2 className={`${style.title} ${style.cat}`}>여행자 유형 해시태그</h2>
  <div className={style.hashtagList}>
    {testTags.length > 0 ? renderTags(testTags) : <p>등록된 해시태그가 없습니다.</p>}
  </div>
</section>

<section className={style.section}>
  <h2 className={`${style.title} ${style.pin}`}>일반 해시태그</h2>
  <div className={style.hashtagList}>
    {normalTags.length > 0 ? renderTags(normalTags) : <p>등록된 해시태그가 없습니다.</p>}
  </div>
</section>


    </div>
  );
  
};

export default HashtagBoard;
