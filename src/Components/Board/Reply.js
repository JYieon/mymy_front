import React, { useEffect, useState } from "react";
import BoardApi from "../../api/BoardApi";
import MateBoardApi from "../../api/MateBoardApi";

const Reply = ({ boardNo, category }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});

    // **어떤 API를 사용할지 선택**
    const api = category === 3 ? MateBoardApi : BoardApi;

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

        const replyData = {
            boardNo: boardNo,
            repContent: content,
            parentNo: parentNo,
            id: "a" // 임시 아이디 (로그인 연동 후 변경)
        };

        try {
            await api.addReply(replyData);
            alert("댓글이 작성되었습니다.");
            setReplyContent({ ...replyContent, [parentNo]: "" });
            setNewReply("");
            window.location.reload();
        } catch (error) {
            console.error("❌ 댓글 작성 실패:", error);
        }
    };

    // 댓글 삭제
    const handleDeleteReply = async (replyNo) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await api.deleteReply(replyNo);
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
        return replies.map(reply => (
            <div key={reply.repNo} style={{ marginLeft: `${depth * 20}px`, padding: "10px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "10px" }}>
                <p>
                    <strong>{reply.id}</strong> | {formatDate(reply.repDate)} <br />
                    {reply.repContent}
                </p>
                <button onClick={() => toggleReplyInput(reply.repNo)}>답글</button>
                <button onClick={() => handleDeleteReply(reply.repNo)}>삭제</button>

                {/* 대댓글 입력창 */}
                {showReplyInput[reply.repNo] && (
                    <div style={{ marginTop: "10px" }}>
                        <textarea
                            value={replyContent[reply.repNo] || ""}
                            onChange={(e) => setReplyContent({ ...replyContent, [reply.repNo]: e.target.value })}
                            placeholder="답글을 입력하세요"
                            style={{ width: "100%", height: "60px" }}
                        />
                        <button onClick={() => handleAddReply(reply.repNo)}>답글 등록</button>
                    </div>
                )}

                {/* 자식 댓글 재귀 호출 */}
                {reply.children?.length > 0 && renderReplies(reply.children, depth + 1)}
            </div>
        ));
    };

    return (
        <div>
            <h3>💬 댓글 목록</h3>
            {replies.length > 0 ? renderReplies(replies) : <p>댓글이 없습니다.</p>}

            {/* 새 댓글 작성 */}
            <h3>📝 댓글 작성</h3>
            <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="댓글을 입력하세요"
                style={{ width: "100%", height: "80px" }}
            />
            <button onClick={() => handleAddReply(0)}>댓글 등록</button>
        </div>
    );
};

export default Reply;
