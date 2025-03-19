import { useState } from "react";
import BoardWrite from "../../Components/Board/BoardWrite";
import Timeline from "../../Components/Board/Timeline";
import { motion } from "framer-motion";
import style from "../../Css/BoardWritePage.module.css";
import KakaoMap from "../../Components/Board/KakaoMap";


const BoardWritePage = () => {
  const [TimelineOpen, setTimelineOpen] = useState(false);

  const TimelineOpenBtn = () => {
    setTimelineOpen(true);
  };

  const TimelineCloseBtn = () => {
    setTimelineOpen(false);
  };

  return (
    <div className={style.BoardWriteContainer}>
      <div className={style.Btns}>
        <button onClick={TimelineOpenBtn}>타임라인</button>
        <button onClick={TimelineCloseBtn}>글 작성</button>
      </div>
      <div>
        <motion.div
          initial={{ scaleY: 0 }}
          transition={{
            delay: TimelineOpen ? 0.3 : 0,
          }}
          animate={{
            scaleY: TimelineOpen ? 1 : 0,
            opacity: TimelineOpen ? 1 : 0,
            display: TimelineOpen ? "block" : "none",
          }}
        >
          {/* <h1>📅 여행 타임라인</h1> */}
          <div className={style.TimelineWrap}>
            <KakaoMap />
            <Timeline />
          </div>
        </motion.div>
        <motion.div
          initial={{ display: "block" }}
          transition={{
            delay: !TimelineOpen ? 0.3 : 0,
          }}
          animate={{
            scaleY: !TimelineOpen ? 1 : 0,
            opacity: !TimelineOpen ? 1 : 0,
            display: !TimelineOpen ? "block" : "none",
          }}
        >
          <BoardWrite />
        </motion.div>
      </div>
    </div>
  );
};

export default BoardWritePage;
