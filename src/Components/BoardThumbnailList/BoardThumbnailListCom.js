import { Link, useLocation} from "react-router-dom";
import BoardThumbnailCom from "../BoardThumbnail/BoardThumbnail";
import "./BoardThumbnailList.css"
import DummyData from "../DummyData/DummyData";
const BoardThumbnailListCom=()=>{

    const link="https://picsum.photos/300/300";
    
    const TitleList=["aaa","bbb","ccc",'ddd','eee','fff',"hhh","jjj"]
    const Title="title";

    DummyData.forEach(data=>{
        
    })
    return(<>
        <div className="Thumbnail List">
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
        </div>
        <div className="bar">
            <Link to="/Board/BookMark/next">다음</Link>
            [
            <Link to="/page/1">1</Link>
            ]
            <Link to="/Board/BookMark/next">이전</Link>
        </div>


    </>)
};

export default BoardThumbnailListCom;