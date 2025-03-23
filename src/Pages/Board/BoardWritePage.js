import React, { useState } from "react";
import BoardWrite from "../../Components/Board/BoardWrite";
import { motion } from "framer-motion";
import style from "../../Css/BoardWritePage.module.css";
import KakaoMap from "../../Components/Board/KakaoMap";


const BoardWritePage = () => {
  const [TimelineOpen, setTimelineOpen] = useState(false);
  const [boardNo, setBoardNo] = useState(null); // ✅ boardNo 상태 추가
  const [Timeline, setTimeline] = useState("");

  // 게시글 전체 저장
  const savePost = () => {


  }


  const savePostWithoutTl = () => {

  }
  return (
    <div className={style.BoardWriteContainer}>
      {/* <div className={style.Btns}>
        <button onClick={TimelineOpenBtn}>타임라인</button>
        <button onClick={TimelineCloseBtn}>글 작성</button>
      </div> */}
      <div>
        <motion.div
          initial={{ scaleY: 0 }}
          transition={{ delay: TimelineOpen ? 0.3 : 0 }}
          animate={{
            scaleY: TimelineOpen ? 1 : 0,
            opacity: TimelineOpen ? 1 : 0,
            display: TimelineOpen ? "block" : "none",
          }}
        >
          <div className={style.TimelineWrap}>
            <KakaoMap boardNo={boardNo} />
            {Timeline}
          </div>
          
          <button onClick={savePost}>저장</button>
        </motion.div>

        <motion.div
          initial={{ display: "block" }}
          transition={{ delay: !TimelineOpen ? 0.3 : 0 }}
          animate={{
            scaleY: !TimelineOpen ? 1 : 0,
            opacity: !TimelineOpen ? 1 : 0,
            display: !TimelineOpen ? "block" : "none",
          }}
        >
          <BoardWrite
            setTimelineOpen={setTimelineOpen} setBoardNo={setBoardNo} boardNo={boardNo} setTimeline={setTimeline}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BoardWritePage;
