import BoardThumbnailCom from "../BoardThumbnail/BoardThumbnail";
import "./BoardThumbnailList.css"
const BoardThumbnailListCom=()=>{

    const link="https://picsum.photos/300/300";
    const TitleList=["aaa","bbb","ccc",'ddd','eee','fff',"hhh","jjj"]
    const Title="title";

    return(<>
        <div className="Thumbnail Wrap">
            <BoardThumbnailCom link={link} Title={TitleList[0]}/>
        </div>


    </>)
};

export default BoardThumbnailListCom;