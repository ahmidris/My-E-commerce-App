import React from 'react'
import exchange_icon from '../assets/exchange_icon.png'
import quality_icon from '../assets/quality_icon.png'
import support_img from '../assets/support_img.png'


const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>

      <div>
        <img className='w-12 m-auto mb-5' src={exchange_icon} alt="" />
        <p className='font-semibold'>Easy Exchange policy</p>
        <p className='text-gray-400'>We offer hassle free policy</p>
      </div>

    <div>
        <img className='w-12 m-auto mb-5' src={quality_icon} alt="" />
        <p className='font-semibold'>7 Days Return Policy</p>
        <p className='text-gray-400'>We Provide 7 days free return policy</p>
      </div>

     <div>
        <img className='w-12 m-auto mb-5' src={support_img} alt="" />
        <p className='font-semibold'>Best Customer Support</p>
        <p className='text-gray-400'>We provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default OurPolicy
