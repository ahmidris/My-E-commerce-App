import React from 'react'
import { ShopContext } from '../context/shopContext.jsx';
import search_icon from '../assets/search_icon.png';
import cross_icon from '../assets/cross_icon.png';

const SearchBar = () => {
    const {search, setSearch,showSearch, setShowSearch} = React.useContext(ShopContext);
  return showSearch ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4  sm:w-1/2'>
       <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type="text"  placeholder='Search'/>
       <img className='w-4' src={search_icon} alt="" />
      </div>
      <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer' src={cross_icon} alt="" />
    </div>
  ) : null;
}

export default SearchBar
