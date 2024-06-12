import React from 'react'
import './Contact.css'
import theme_pattern from '../../assets/theme_pattern.svg'
import mail_icon from '../../assets/mail_icon.svg'
import location_icon from '../../assets/location_icon.svg'
import call_icon from '../../assets/call_icon.svg'
import instagram_icon from '../../assets/instagram.svg'
import twitter_icon from '../../assets/twitter.svg'

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "4943bd77-bdef-4853-a1b1-4ad34dc1cb70");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      alert(res.message)
    }
  };
  return (
    <div className='contact' id='contact'>
      <div className="contact-title">
        <h1>Get in touch</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="contact-section">
        <div className="contact-left">
          <h1>Let's talk</h1>
          <p>I’m always excited to connect with fellow tech enthusiasts, collaborators, and potential employers. Whether you have a project in mind, need some coding assistance, or just want to discuss the latest trends in computer science, I’m here to chat. Feel free to reach out—let’s create something amazing together!</p>
          <div className="contact-details">
            <div className="contact-detail">
              <a href="mailto:shamitmishra22@gmail.com" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={mail_icon} alt="" style={{ marginRight: 20 }} /><br/>
                <p>shamitmishra22@gmail.com</p>
              </a>
            </div>
            <div className="contact-detail">
              <a href="https://www.google.com/maps/place/Odisha,+India" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={location_icon} alt="" style={{ marginRight: 30 }} />
                <p>Odisha, India</p>
              </a>
            </div>
            <div className="contact-detail">
              <a href="https://www.instagram.com/itzshamit21" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={instagram_icon} alt="" style={{ marginRight: 20 }} />
                <p>@itzshamit21</p>
              </a>
            </div>
            <div className="contact-detail">
              <a href="https://www.twitter.com/SimplyShamit" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={twitter_icon} alt="" style={{ marginRight: 20 }} />
                <p>@SimplyShamit</p>
              </a>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="contact-right">
          <label htmlFor="name">Your Name</label>
          <input type="text" placeholder='Enter your name' name='name' />
          <label htmlFor="email">Your Email</label>
          <input type="email" placeholder='Enter your email' name="email"/>
          <label htmlFor="message">Write your message here</label>
          <textarea name="message" rows="8" placeholder='Enter your message'></textarea>
          <button type='submit' className="contact-submit">Submit now</button>
        </form>
      </div>
    </div>
  )
}

export default Contact
