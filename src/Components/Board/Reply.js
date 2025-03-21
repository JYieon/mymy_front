import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import MateBoardApi from "../../api/MateBoardApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/Replay.module.css";

const Reply = ({ boardNo, category }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState("");
    const token = localStorage.getItem("accessToken");
    const [ nickname , setNickname]= useState("");

    console.log(`🔍 댓글 컴포넌트 실행 - boardNo: ${boardNo}, category: ${category}`);

    // API 선택 (카테고리에 따라 BoardApi 또는 MateBoardApi 사용)
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
                    setNickname(res.data.nick);
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
                console.log(`🔍 댓글 가져오기 요청: boardNo = ${boardNo}, category = ${category}`);

                const res = await api.getReplies(boardNo);
                console.log("✅ 댓글 API 응답:", res);

                // `res.data`가 존재하는지 확인하여 사용
                const replyData = res.data || res;
                if (!Array.isArray(replyData) || replyData.length === 0) {
                    console.warn("⚠️ 댓글 데이터 없음!", replyData);
                    setReplies([]);
                    return;
                }

                console.log("📌 변환된 댓글 데이터:", replyData);
                setReplies(buildReplyTree(replyData));
            } catch (error) {
                console.error("❌ 댓글 불러오기 실패:", error);
            }
        };

        fetchReplies();
    }, [boardNo, category]);

    // 대댓글 트리 구조 생성
    const buildReplyTree = (replies) => {
        console.log("🔄 댓글 트리 변환 시작", replies);

        const map = {};
        const roots = [];

        replies.forEach(reply => {
            map[reply.repNo] = { ...reply, children: [] };
        });

        replies.forEach(reply => {
            if (reply.parentNo === 0 || !map[reply.parentNo]) {
                // 부모 댓글이 없거나 parentNo가 0이면 최상위 댓글로 간주
                roots.push(map[reply.repNo]);
            } else {
                map[reply.parentNo].children.push(map[reply.repNo]);
            }
        });

        console.log("🌳 변환된 트리 구조:", roots);
        return roots;
    };


    // ✅ 댓글 작성 (기록 게시판 & 메이트 게시판 대응)
const handleAddReply = async (parentNo = 0) => {
    const content = replyContent[parentNo] || newReply;

    if (!content.trim()) {
        alert("🚨 댓글 내용을 입력하세요.");
        return;
    }

    if (!token) {
        alert("🚨 로그인이 필요합니다.");
        return;
    }

    // 🔹 현재 게시판의 category 가져오기 (2: 기록 게시판, 3: 메이트 게시판)
    const replyData = {
        boardNo: boardNo,
        repContent: content,
        parentNo: parentNo,
        id: loggedInUserId,
    };

    try {
        const res = await api.addReply(replyData, token);
        if (res.status === 200) {
            alert("✅ 댓글이 작성되었습니다.");
            setReplyContent({ ...replyContent, [parentNo]: "" });
            setNewReply("");

            // ✅ 기록 게시판(2)과 메이트 게시판(3)에 따라 댓글 API 분리
            let updatedReplies;
            if (category === 2) {
                updatedReplies = await BoardApi.getReplies(boardNo);
            } else {
                updatedReplies = await MateBoardApi.getReplies(boardNo);
            }

            setReplies(buildReplyTree(updatedReplies.data || updatedReplies));
        }
    } catch (error) {
        console.error("❌ 댓글 작성 실패:", error);
    }
};


    // ✅ 댓글 삭제
const handleDeleteReply = async (replyNo) => {
    if (window.confirm("⚠️ 정말 삭제하시겠습니까?")) {
        try {
            await api.deleteReply(replyNo, token);
            alert("✅ 댓글이 삭제되었습니다.");

            // ✅ 삭제 후 목록 갱신 (기록 게시판 & 메이트 게시판 구분)
            let updatedReplies;
            if (category === 2) {
                updatedReplies = await BoardApi.getReplies(boardNo);
            } else {
                updatedReplies = await MateBoardApi.getReplies(boardNo);
            }

            setReplies(buildReplyTree(updatedReplies.data || updatedReplies));
        } catch (error) {
            console.error("❌ 댓글 삭제 실패:", error);

            if (error.response && error.response.status === 403) {
                alert("🚨 삭제 권한이 없습니다.");
            } else {
                alert("❌ 댓글 삭제에 실패했습니다.");
            }
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
        return replies.map(reply => (
            <div key={reply.repNo} className={`${style.replyItem} Shadow`} style={{ marginLeft: `${depth * 20}px` }}>
                <p>
                    <span className={style.id}>{reply.id}</span>
                    <span className={style.date}>{formatDate(reply.repDate)}</span>
                </p>
                <span className={style.content}>{reply.repContent}</span>

                <div className={style.replyEditContainer}>
                    <button className={style.newReplyBtn} onClick={() => toggleReplyInput(reply.repNo)}>답글</button>
                    <button className={style.newReplyBtn} onClick={() => handleDeleteReply(reply.repNo)}>삭제</button>
                </div>

                {/* 대댓글 입력창 */}
                {showReplyInput[reply.repNo] && (
                    <div className={`${style.newReplyContainer}`}>
                        <textarea
                            className={style.textarea}
                            value={replyContent[reply.repNo] || ""}
                            onChange={(e) => setReplyContent({ ...replyContent, [reply.repNo]: e.target.value })}
                            placeholder="답글을 입력하세요"
                        />
                        <button className={style.newReplyBtn} onClick={() => handleAddReply(reply.repNo)}>답글 등록</button>
                    </div>
                )}

                {/* 자식 댓글 재귀 호출 */}
                {reply.children?.length > 0 && renderReplies(reply.children, depth + 1)}
            </div>
        ));
    };

    return (
        <div className={style.replyContainer}>
            <h3>💬</h3>
        <hr className={style.hr}/>

            {/* {replies.length > 0 ? renderReplies(replies) : <h5>댓글이 없습니다.</h5>} */}
            
            {/* 새 댓글 작성 */}
            {/* <h3>📝 댓글 작성</h3> */}
            <div className={`Shadow ${style.newReplyContainer}`}>
                <span className={style.userNickname}>
                {nickname}
                </span>
                <textarea
                    className={style.textarea}
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button className={style.newReplyBtn} onClick={() => handleAddReply(0)}>등록</button>
            </div>
        </div>
    );
};

export default Reply;
