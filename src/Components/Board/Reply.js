import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import MateBoardApi from "../../api/MateBoardApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/Replay.module.css"
const Reply = ({ boardNo, category }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState(""); 
    const token = localStorage.getItem("accessToken");

    //  어떤 API를 사용할지 선택
    const api = category === 3 ? MateBoardApi : BoardApi;

    // 로그인한 사용자 정보 가져오기
    useEffect(() => {
        if (!token) return;

        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token);
                if (res.data) {
                    setLoggedInUserId(res.data.id);
                    console.log("🔑 로그인한 사용자 ID:", res.data.id);
                }
            } catch (error) {
                console.error("❌ 사용자 정보 가져오기 실패:", error);
            }
        };
        fetchUserInfo();
    }, [token]);

    // 댓글 목록 불러오기
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const res = await api.getReplies(boardNo);
                const tree = buildReplyTree(res.data);
                setReplies(tree);
            } catch (error) {
                console.error("❌ 댓글 불러오기 실패:", error);
            }
        };

        fetchReplies();
    }, [boardNo, api]);

    // 대댓글 트리 구조 생성
    const buildReplyTree = (replies) => {
        const map = {};
        const roots = [];

        replies.forEach(reply => {
            map[reply.repNo] = { ...reply, children: [] };
        });

        replies.forEach(reply => {
            if (reply.parentNo === 0) {
                roots.push(map[reply.repNo]);
            } else {
                map[reply.parentNo]?.children.push(map[reply.repNo]);
            }
        });

        return roots;
    };

    // 댓글 작성 (대댓글 포함)
    const handleAddReply = async (parentNo = 0) => {
        const content = replyContent[parentNo] || newReply;

        if (!content.trim()) {
            alert("댓글 내용을 입력하세요.");
            return;
        }

        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 🛠️ 서버에 보낼 데이터 구성
        const replyData = {
            boardNo: boardNo,
            repContent: content,
            parentNo: parentNo,
            id: loggedInUserId, // ChatApi에서 가져온 사용자 ID 사용
        };
        
        console.log("🚀 댓글 작성 요청 데이터:", replyData);
        console.log("🔑 보낼 토큰:", token);

        try {
            const res = await api.addReply(replyData, token);
            console.log("댓글 응답 데이터:", res.data);
            if (res.status === 200) {
                alert("댓글이 작성되었습니다.");
                setReplyContent({ ...replyContent, [parentNo]: "" });
                setNewReply(""); // 댓글 작성 후 입력 필드 초기화
                window.location.reload(); // 새로고침
            }
        } catch (error) {
            console.error("❌ 댓글 작성 실패:", error);
        }
    };

    // 댓글 삭제
    const handleDeleteReply = async (replyNo) => {
        console.log('replyNo',replyNo);
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await api.deleteReply(replyNo, token);
                alert("댓글이 삭제되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error("❌ 댓글 삭제 실패:", error);
            }
        }
    };

    // 대댓글 입력창 토글
    const toggleReplyInput = (repNo) => {
        setShowReplyInput((prev) => ({
            ...prev,
            [repNo]: !prev[repNo]
        }));
    };

    // 날짜 포맷 변경
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

  // 댓글 렌더링 (재귀 호출)
  const renderReplies = (replies, depth = 0) => {
    return replies.map((reply) => (
      <div key={reply.repNo} className={`Shadow ${style.replyItem}`}>
        <p>
          <span className={style.id}> {reply.id}</span>
          <span className={style.date}> {formatDate(reply.repDate)}</span>
        </p>
        <span className={style.content}>{reply.repContent}</span>
        <div style={style.replyEditContiner}>
          <button
            className={style.newReplyBtn}
            onClick={() => toggleReplyInput(reply.repNo)}
          >
            답글
          </button>

          <button
            className={style.newReplyBtn}
            onClick={() => handleDeleteReply(reply.repNo)}
          >
            삭제
          </button>
        </div>

        {/* 대댓글 입력창 */}
        {showReplyInput[reply.repNo] && (
          <div className={`${style.newReplyContainer}`}>
            <textarea
              className={style.textarea}
              value={replyContent[reply.repNo] || ""}
              onChange={(e) =>
                setReplyContent({
                  ...replyContent,
                  [reply.repNo]: e.target.value,
                })
              }
              placeholder="답글을 입력하세요"            />
            <button
              className={style.newReplyBtn}
              onClick={() => handleAddReply(reply.repNo)}
            >
              작성
            </button>
          </div>
        )}

                {/* 자식 댓글 재귀 호출 */}
                {reply.children?.length > 0 && renderReplies(reply.children, depth + 1)}
            </div>
        ));
    };

  return (
    <div className={style.replyContainer}>
      {/* <h3>💬 댓글 목록</h3> */}

      {replies.length > 0 ? renderReplies(replies) : <p>댓글이 없습니다.</p>}

      {/* 새 댓글 작성 */}
      <h3>댓글</h3>
      <div className={`Shadow ${style.newReplyContainer}`}>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={() => handleAddReply(0)} className={style.newReplyBtn}>
          작성
        </button>
      </div>w
    </div>
  );
};

export default Reply;
