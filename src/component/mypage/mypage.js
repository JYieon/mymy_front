import React, { useState, useEffect } from 'react';
import MypageApi from "../../Api/MypageApi"

function MyPage({ userData }) {
  // 상태 관리
  const [formData, setFormData] = useState({
    id: userData?.id || "", // 초기값을 서버에서 받은 데이터로 설정
    pwd: "",
    pwdCheck: "",
    phone: "",
    email: "",
    aaa: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
        if (userData) {
          setFormData({
            id: userData.id,
            pwd: "",
            pwdCheck: "",
            phone: userData?.phone,
            email: userData?.email,
          });
        }
  }, [userData]);

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // 폼 제출 시 처리할 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
    });


     // 비밀번호 일치 확인
     if (formData.pwd && formData.pwd !== formData.pwdCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 입력 필드 검사
    if (!formData.email || !formData.phone) {
      setError("모든 필드를 입력해야 합니다.");
      return;
    }


    try {
      const res = await MypageApi.modify(formDataToSend)
      //console.log(res)

      if (res.status === 200) {
        alert("수정이 완료되었습니다!");
        //window.location.href = "/mypage_main";
      }
    } catch (err) {
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    }

  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <hr />

      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <p>{userData?.id}</p>
        </div>

        <div>
          <label>여행자 레벨</label>
          <p>{userData?.level}</p>
        </div>

        <div>
          <label>비밀번호</label>
          <input type="password" name="pwd" value={formData?.pwd} onChange={handleChange} />
        </div>


        <div>
          <label>비밀번호 확인</label>
          <input type="password" name="pwdCheck" value={formData?.pwdCheck || ""} onChange={handleChange} />
          <button type="button" onClick={() => alert("비밀번호가 변경되었습니다.")}>변경</button> 
        </div>


        <div>
          <label>이메일</label>
          <input type="email" name="email" value={formData?.email} onChange={handleChange} />
          <button type="button" onClick={() => alert("이메일이 변경되었습니다.")}>변경</button> 
        </div>


        <div>
          <label>전화번호</label>
          <input type="text" name="phone" value={formData?.phone} onChange={handleChange} />
          <button type="button" onClick={() => alert("전화번호가가 변경되었습니다.")}>변경</button> 
        </div>

        <button type="submit">저장</button>

      </form>
    </div>
  );
}

export default MyPage