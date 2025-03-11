import "./Searchbar.css";
const Searchbar=()=>{
    return(<>
        <form className="SearchbarForm Shadow">
            <div className="Fillter">제목+글</div>
            <input type="search" name="Search" placeholder="검색어를 입력해주세요."/>
            <input type="submit" value="검색"/>
        </form>
    </>)
};

export default Searchbar;