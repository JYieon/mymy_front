import React, { useState, useEffect } from 'react';
import MypageApi from "../../api/MypageApi";
// import axios from "axios";
// import { useParams } from "react-router-dom";
import ChatApi from '../../api/ChatApi';
import style from "../../Css/MyPage.module.css";
import Modal from "react-modal";


//회원 정보 수정
function MyPage({ userData }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const token = localStorage.getItem("accessToken")//사용자 토큰

  //초기 상태 설정 (userData 있으면 사용, 없으면 기본값)
  const [formData, setFormData] = useState(userData || {
    id: "",
    nick: "",
    pwd: "",
    pwdCheck: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [keepPosts, setKeepPosts] = useState(true); // 기본값은 게시글을 남기고 탈퇴
  const [deleteError, setDeleteError] = useState("");

  //사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await ChatApi.getUserInfo(token);//api 요청
        // console.log(res.data);
        // 기존 formData의 기본값을 유지하면서 데이터 업데이트
        setFormData(prevState => ({
          ...prevState,
          ...res.data //기존값 유지하면서 새로운 값 추가
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
    const { name, value } = e.target; //사용자가 입력한 값 가져오기
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

  //회원 정보 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 입력 필드 검사
    if (!formData.nick || !formData.pwd || !formData.pwdCheck || !formData.email || !formData.phone) {
      setError("모든 필드를 입력해야 합니다.");
      return;
    }

    try {
      const res = await MypageApi.modify(formData);//api 요청청
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
      const updateData = { id: formData.id, [field]: formData[field] }; // 수정할 데이터 구성성
      const res = await MypageApi.modify(updateData);//api 요청청

      if (res.status === 200) {
        alert(`${field === "pwd" ? "비밀번호" : field === "email" ? "이메일" : field === "nick" ? "닉네임" : "전화번호"} 성공적으로 변경되었습니다!`);
      }
    } catch (err) {
      alert("변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const openDeleteModalBtn = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  //회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (!token) {
      alert("로그인 후 탈퇴할 수 있습니다.");
      return;
    }

    try {
      const res = await MypageApi.deleteAccount(keepPosts); // 탈퇴 API 요청
      if (res.status === 200) {
        alert("회원 탈퇴가 완료되었습니다.");
        // 탈퇴 후 로그인 화면으로 리디렉션 또는 홈으로 이동
        window.location.href = '/';  // 탈퇴 후 로그인 화면으로 이동
      }
    } catch (err) {
      setDeleteError("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <hr className="hr"/>
      <form onSubmit={handleSubmit}
        className={style.grid} id='userInfoModifyForm'>


        <div className={style.gridItem}>
          <label className={style.label}>아이디</label>
          <input type='text' className={`${style.input} ${style.readOnlyId}`} value={formData.id} readOnly />

          <button type="button" readOnly className={style.readonly}>변경</button>
        </div>

        <div className={style.gridItem}>
          <label className={style.label}>닉네임</label>
          <input className={`Shadow ${style.input}`} type="text" name="nick" value={formData.nick} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("nick")} className={style.modifybutton}>변경</button>
        </div>

        <div className={style.gridItem}>
          <label className={style.label}>비밀번호</label>
          <input className={`Shadow ${style.input}`} type="password" name="pwd" value={formData.pwd} onChange={handleChange} />
          <button type="button" readOnly className={style.readonly}>변경</button>


        </div>

        <div className={style.gridItem}>
          <label className={style.label}>비밀번호 확인</label>
          <input className={`Shadow ${style.input}`} type="password" name="pwdCheck" value={formData.pwdCheck} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("pwd")} className={style.modifybutton}>변경</button>
        </div>
        {/* 비밀번호 오류 메시지 표시 */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={style.gridItem}>
          <label className={style.label}>이메일</label>
          <input className={`Shadow ${style.input}`} type="email" name="email" value={formData.email} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("email")} className={style.modifybutton} >변경</button>
        </div>

        <div className={style.gridItem}>
          <label className={style.label}>전화번호</label>
          <input className={`Shadow ${style.input}`} type="text" name="phone" value={formData.phone} onChange={handleChange} />
          <button type="button" onClick={() => handleUpdateField("phone")} className={style.modifybutton}>변경</button>
        </div>
      </form>

      <button className={style.submitBtn} type="submit" form='userInfoModifyForm'>저장</button>


      {/* 회원 탈퇴 처리 */}


      <div>
        <Modal
          isOpen={openDeleteModal}
          ariaHideApp={true}
          onRequestClose={openDeleteModalBtn}
          className={`Shadow modal`}
        >
          <label className={style.label}>게시글을 남기고 탈퇴하시겠습니까?</label>
          <span>게시글 삭제를 원하신다면 체크를 풀어주세요!</span>
          <input
            type="checkbox"
            checked={keepPosts}
            onChange={() => setKeepPosts(!keepPosts)}
          />

          {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

          <button type="button" onClick={handleDeleteAccount} className={style.deleteAccountBtn}>
            탈퇴</button>
        </Modal>
      </div>

      <button type="button" onClick={openDeleteModalBtn} className={style.deleteAccountBtn}>
      회원 탈퇴</button>
    </div>
  );
}

export default MyPage;
