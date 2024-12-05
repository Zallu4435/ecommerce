import React from 'react'
import Header from '../../components/user/Header'
import Navbar from '../../components/user/Navbar'
import HeroSection_1 from '../../components/user/heroSection/HeroSection_1'
import HeroSection_3 from '../../components/user/heroSection/HeroSection_3'
import HeroSection_4 from '../../components/user/heroSection/HeroSection_4'
import { CardContainer } from '../../components/user/ShoppingCards'
import Brand from '../../components/user/heroSection/Brand'
import HeroSection_6 from '../../components/user/heroSection/HeroSection_6'
import HeroSection_5 from '../../components/user/heroSection/HeroSection_5'
import Footer from '../../components/user/Footer'

const Home = () => {
  return (
    <div className='space-y-32'>
      <div>
        <Header />
        <Navbar />
        <HeroSection_1 />
      </div>

      <HeroSection_3 />

      <HeroSection_4 /> 

      <div className="p-4">
         <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl m-7 text-center md:text-left">Popular Products</h1> 
         <CardContainer /> 
      </div>

      <Brand />

      {/* <HeroSection_6 /> */}

      {/* <HeroSection_5 /> */}

      {/* <Footer /> */}


    </div>
  )
}

export default Home
