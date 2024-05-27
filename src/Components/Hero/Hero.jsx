import React from 'react'
import './Hero.css'
import profile_img from '../../assets/profile_img.svg'

const Hero = () => {
  return (
    <div className='hero' id='hero'>
        <img src={profile_img} alt="" />
        <h1><span>I'm Shamit Mishra,</span> frontend developer based in India.</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quisquam temporibus officia, consectetur quidem commodi accusamus, harum modi deserunt mollitia odit magni nesciunt nulla! Ipsam, ipsa autem. Repellendus, fugit dignissimos?</p>
        <div className="hero-action">
            <div className="hero-connect">Connect With me</div>
            <div className="hero-resume">My Resume</div>
        </div>
    </div>
  )
}

export default Hero
