import React, { useState, useEffect } from 'react';
import axios from "axios";
import MypageApi from "../../api/MypageApi";
import { useParams } from "react-router-dom";
import ChatApi from '../../api/ChatApi';

function MyPage({ userData }) { //userData가 props로 들어올 수도 있음
  const token = localStorage.getItem("accessToken")

  //초기 상태 설정 (userData 있으면 사용, 없으면 기본값)
  const [formData, setFormData] = useState(userData || {
    id: "",
    nick:"",
    pwd: "",
    pwdCheck: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");

  //사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const res = await ChatApi.getUserInfo(token);
            console.log(res.data);
            // 기존 formData의 기본값을 유지하면서 데이터 업데이트
            setFormData(prevState => ({
                ...prevState, 
                ...res.data
            }));
        } catch (error) {
            console.error("로그인 정보 가져오기 실패:", error);
        }
    };

    fetchUserInfo();
}, [token]); 


    // axios.get("http://localhost:8080/mymy/userinfo/me", { })
    //   .then(response => {
    //     console.log("로그인된 사용자:", response.data);
    //     setFormData(response.data); //로그인된 사용자 정보로 상태 업데이트
    //   })
    //   .catch(error => {
    //     console.error("로그인 정보 가져오기 실패:", error);
    //   });
  

  //입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    //비밀번호 & 비밀번호 확인 입력값이 다르면 오류 메시지 표시
    if (name === "pwd" || name === "pwdCheck") {
      if (name === "pwd" && value !== formData.pwdCheck) {
      } else if (name === "pwdCheck" && value !== formData.pwd) {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        setError(""); // 비밀번호가 일치하면 오류 메시지 초기화
      }
    }
  };

  //폼 제출 시 처리할 함수 (정보 수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 입력 필드 검사
    if (!formData.nick ||!formData.pwd || !formData.pwdCheck || !formData.email || !formData.phone) {
      setError("모든 필드를 입력해야 합니다.");
      return;
    }

    try {
      const res = await MypageApi.modify(formData);
      if (res.status === 200) {
        alert("수정이 완료되었습니다!");
      }
    } catch (err) {
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //특정 필드만 업데이트하는 함수
  const handleUpdateField = async (field) => {
    if (!formData[field]) {
      alert(`${field === "pwd" ? "비밀번호" : field === "email" ? "이메일" : field === "nick" ? "닉네임" : "전화번호"}를 입력해주세요.`);
      return;
    }
  
    try {
      const updateData = { id: formData.id, [field]: formData[field] };
      const res = await MypageApi.modify(updateData);
  
      if (res.status === 200) {
        alert(`${field === "pwd" ? "비밀번호" : field === "email" ? "이메일" : field === "nick" ? "닉네임" : "전화번호"} 성공적으로 변경되었습니다!`);
      }
    } catch (err) {
      alert("변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <hr />

      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <p>{formData.id}</p>
        </div>

        <div>
          <label>닉네임</label>
          <input type="text" name="nick" value={formData.nick} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("nick")}>변경</button>
        </div>

        <div>
          <label>비밀번호</label>
          <input type="password" name="pwd" value={formData.pwd} onChange={handleChange} />
        </div>

        <div>
          <label>비밀번호 확인</label>
          <input type="password" name="pwdCheck" value={formData.pwdCheck} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("pwd")}>변경</button>
        </div>
        {/* 비밀번호 오류 메시지 표시 */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>이메일</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("email")}>변경</button>
        </div>

        <div>
          <label>전화번호</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("phone")}>변경</button>
        </div>

        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default MyPage;
