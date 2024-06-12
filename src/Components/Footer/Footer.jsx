import React from 'react'
import './Footer.css'
import footer_logo from '../../assets/footer_logo.svg'
import user_icon from '../../assets/user_icon.svg'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        {/* 
            <div className="footer-top">
                <div className="footer-top-left">
                    <img src={footer_logo} alt="" />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nesciunt quas veniam aspernatur vel magnam dolore quibusdam enim! Quos, dolorum.</p>
                </div>
                <div className="footer-top-right">
                    <div className="footer-email-input">
                        <img src={user_icon} alt="" />
                        <input type="email" placeholder='Enter your email' />
                    </div>
                    <div className="footer-subscribe">Subscribe</div>
                </div>
            </div>
        */}
        <hr />
        <div className="footer-bottom">
            <p className="footer-bottom-left">© 2024 Shamit Mishra.  All Rights</p>
            <div className="footer-bottom-right">
                <p>Term of Services</p>
                <p>Privacy policy</p>
                <a target="_blank" href='https://www.linkedin.com/in/shamitmishra/' style={{ textDecoration: 'none', color: 'white' }}><p style={{ color: 'white', textDecoration: 'none' }}>Connect with me</p></a>
            </div>
        </div>
    </div>
  )
}

export default Footer
