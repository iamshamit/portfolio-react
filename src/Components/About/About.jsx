import React from 'react'
import './About.css'
import theme_pattern from '../../assets/theme_pattern.svg'
import profile_image from '../../assets/about.JPG'

const About = () => {
  return (
    <div className="about" id='about'>
        <div className="about-title">
            <h1>About me</h1>
            <img src={theme_pattern} alt="" />
        </div>
        <div className="about-sections">
            <div className="about-left">
                <img src={profile_image} alt="" />
            </div>
            <div className="about-right">
                <div className="about-para">
                    <p>I am a dedicated and enthusiastic computer science student with a passion for technology and a drive to innovate. Through hands-on experience and rigorous coursework, I have honed my skills in coding, web development, and problem-solving.</p>
                    <p>I thrive in collaborative environments, leveraging my communication skills to work effectively in teams and deliver high-quality results. Always eager to learn and adapt to new challenges, I am committed to pushing the boundaries of what is possible in the world of technology.</p>
                </div>
                <div className="about-skills">
                    <div className="about-skill"><p>HTML & CSS</p><hr style={{width:"50%"}}/></div>
                    <div className="about-skill"><p>React JS</p><hr style={{width:"70%"}}/></div>
                    <div className="about-skill"><p>Java Script</p><hr style={{width:"60%"}}/></div>
                    <div className="about-skill"><p>Flask</p><hr style={{width:"30%"}}/></div>
                </div>
            </div>
        </div>
        <div className="about-achievements">
            {/* 
                <div className="about-achievement">
                    <h1>10+</h1>
                    <p>YEARS OF EXPERIENCE</p>
                </div>
                <div className="about-achievement">
                    <h1>90+</h1>
                    <p>PROJECTS COMPLETED</p>
                </div>
                <div className="about-achievement">
                    <h1>15+</h1>
                    <p>HAPPY CLIENTS</p>
                </div>
                */} 
        </div>
    </div>
  )
}

export default About
