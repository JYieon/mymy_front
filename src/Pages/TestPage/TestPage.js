// import { Link } from "react-router-dom";
import TestCon from "../../Components/Test/TestCon";
import styles from "../../Css/TestPage.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TestPage = () => {
  const TestStart = () => {
    document.getElementById("StartPage").style.display = "none";
    document.getElementById("MainPage").style.display = "block";
    document.getElementById("1").style.display = "block";
  };
  // const test=document.getElementById('Thumbnail').clientWidth;
  // console.log(test);

  // const Width=()=>{
  // console.log(document.getElementById('Thumbnail').offsetWidth)
  // return document.getElementById('Thumbnail').clientWidth;
  // };
  const [startAnimate, SetStartAnimate] = useState(false);

  useEffect(() => {
    SetStartAnimate(true);
  }, []);

  return (
    <>
      <div className={`${styles.TestLayout} Shadow`}>
        {/* 시작 페이지 */}
        <motion.div
          className={styles.StartPage}
          id="StartPage"
          initial={{ opacity: 0 }}
          transition={{ delay: startAnimate ? 0.4 : 0 }}
          animate={{ opacity: startAnimate ? 100 : 0 }}
        >
          <h1 className={styles.title}>여행 단짝 고양이 테스트</h1>
          <h2 className={styles.subtitle}> 나와 여행을 떠날 고양이는 어떤 고양이일까?</h2>
          <img
            className={styles.mainPic}
            src={`https://picsum.photos/600/400`}
            alt="can't load img"
          />
          <button className={styles.TestStartBtn} onClick={TestStart}>
            시작하기
          </button>
        </motion.div>

        {/* 테스트 문제 페이지 */}
        <div className={styles.MainPage} id="MainPage">
          <TestCon />
        </div>
      </div>
    </>
  );
};
export default TestPage;
