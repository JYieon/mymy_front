import { useState } from "react"
import ChatApi from "../../api/ChatApi"
import { useNavigate } from "react-router-dom";

const ChatCreate = () => {
    const [roomName, setRoomName] = useState('')
    const navigate = useNavigate();

    const createRoom = async () => {
        const token = localStorage.getItem("accessToken")
        console.log(token)
        const res = await ChatApi.createRoom(token, roomName)

        console.log(res)
        if(res.data === 1){
            alert("채팅방 생성 완료")
            navigate(`/chatlist`);
        }else{
            alert("채팅방 생성 실패")
        }
    }

    return(<div>
        <h2>채팅방 생성</h2>
        <input type="text" onChange={(e) => {setRoomName(e.target.value)}} placeholder="채팅방 이름" ></input>
        <button onClick={createRoom}>만들기</button>
    </div>)
}

export default ChatCreate