import axios from "axios";

const domain = "http://localhost:8080/mymy";

const MypageApi = {
    modify: async (formData) => {
        return await axios.post(domain + "/modify",formData,{
            headers: { "Content-Type": "multipart/form-data" }});
    }
};

export default MypageApi;
