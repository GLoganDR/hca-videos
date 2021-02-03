import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';

function Header () {

    const [inputSearch, setInputSearch] = useState('');
    const [isCovidLinkClicked, setIsCovidLinkClicked] = useState(false);

    return (
        <div className='header'>
          <div className="header__left">
            HCA Videos Library
          </div>
          
          <div className="header__center">
            <Link to={`/video/covidVideos`}>
              <span className="pad_rt" onClick={() => setInputSearch(true)} >
                Covid 19 Videos
              </span>
            </Link>
            <Link to={`/video/allVideos`}>
              All Videos
            </Link>
            
          </div>

          <div className="header__right">
            <div className="search_bar">
              <input type='text' onChange={(e) => setInputSearch(e.target.value)} value={inputSearch}/>
              <Link to={`/search/${inputSearch}`}>
                <SearchIcon className='header__searchbutton'/>
              </Link>
            </div>

            <span>Welcome Lorel</span>
          </div>
          
        </div>
    )
}

export default Header;
