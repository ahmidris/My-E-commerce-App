import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>
         <div>
            <img className='mb-5 w-32' src={logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
         </div>
         <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privary Policy</li>
            </ul>
         </div>
         <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                 <li>+1-212-456-7890</li>
                 <li>contact@foreveryou.com</li>
            </ul>
         </div>
      </div>
    <div>
        <hr />
        <p className='py-5 text-sm text-center'>
            &copy; 2025 ForeverYou. All rights reserved.
        </p>
    </div>
    </div>
  )
}

export default Footer
