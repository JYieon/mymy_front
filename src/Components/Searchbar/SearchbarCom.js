import "./Searchbar.css";
const Searchbar=()=>{
    return(<>
        <form className="SearchbarForm Shadow">
            
            <input type="search" name="SearchInput" placeholder="입력"/>
            <input type="submit" value="검색"/>
        </form>
    </>)
};

export default Searchbar;