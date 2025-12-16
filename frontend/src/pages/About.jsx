import React from 'react'
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import about_img from '../assets/about_img.png'


const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
       <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
         <img className='w-full md:max-w-[450px]' src={about_img} alt="" />
         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
           <p>Welcome to ShopEase, your one-stop destination for quality products at unbeatable prices. Discover the latest trends, exclusive deals, and essentials designed to fit your lifestyle. Shop smart, shop fast, and enjoy a seamless online shopping experience.</p>
           <p>Explore our carefully selected collection of best-selling products. Each item is crafted with attention to quality, durability, and style. Whether you’re upgrading your home, wardrobe, or tech gear, we have something just for you.</p>
           <b className='text-gray-800'>Our Mission</b>
           <p>
            Our mission is to provide customers with high-quality products at affordable prices while delivering a seamless, secure, and enjoyable online shopping experience. We are committed to innovation, reliability, and customer satisfaction, ensuring every purchase brings value, convenience, and trust.
           </p>
           </div>
      </div>
      <div className='text-xl py-4'>
       <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Don’t miss out on our limited-time offers. Start shopping today and enjoy exclusive discounts on your favorite products. Add to cart now and experience shopping made simple.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Each item is crafted with attention to quality, durability, and style. Whether you’re upgrading your home, wardrobe, or tech gear, we have something just for you.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Made from high-quality materials, it combines modern design with practical functionality. Perfect for everyday use and special occasions alike.</p>
        </div>

      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About
