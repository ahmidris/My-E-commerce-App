import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext';
import dropdown_icon from '../assets/dropdown_icon.png'

const Collection = () => {
  const { prducts } = useContext(ShopContext);
  const [showFilter, setShowFilter] = React.useState(false);
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
     {/* Filter Options */}
     <div className='min-w-60'>
      <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
        <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={dropdown_icon} alt="" />
      </p>


      {/* Category Filter */}
      <div className={`border border-gray-300 pl-5 mt-6 py-3 ${showFilter ? '' : 'hidden'} sm:block`}>
         <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
         <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} /> Men
           </p>

           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} /> Women
           </p>

           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} /> Kids
           </p>
         </div>
      </div>
      {/*SubCategory  Filter */}
       <div className={`border border-gray-300 pl-5 my-5 py-3 ${showFilter ? '' : 'hidden'} sm:block`}>
         <p className='mb-3 text-sm font-medium'>TYPE</p>
         <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} /> Topwear
           </p>

           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} /> Bottomwear
           </p>

           <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} /> Winterwear
           </p>
         </div>
      </div>
     </div>

    </div>
  )
}

export default Collection
