import React from 'react'
import './Hero.css'
import profile_img from '../../assets/profile.jpg'

const Hero = () => {
  return (
    <div className='hero' id='hero'>
        <img src={profile_img} alt="" />
        <h1><span>I'm Shamit Mishra,</span> Full Stack developer based in India.</h1>
        <p>Welcome to my portfolio! I'm passionate about coding and web development, experienced in various languages.</p>
        <p>I enjoy solving complex problems with innovative solutions and constantly seek opportunities to learn and contribute.</p>
        <div className="hero-action">
            <a target="_blank" href='https://www.linkedin.com/in/shamitmishra/'><div className="hero-connect">Connect With me</div></a>
            <div className="hero-resume">My Resume</div>
        </div>
    </div>  
  )
}

export default Hero
