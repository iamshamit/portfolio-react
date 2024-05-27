import React, { useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.svg";
import underline from '../../assets/nav_underline.svg'
import AnchorLink from "react-anchor-link-smooth-scroll";
import menu_open from '../../assets/menu_open.svg'
import menu_close from '../../assets/menu_close.svg'

const Navbar = () => {

  const [menu,setMenu] = useState("home");
  const menuRef = useRef();

  const openMenu = ()=>{
    menuRef.current.style.right="0";
  }
  const closeMenu = ()=>{
    menuRef.current.style.right="-350px";
  }

  return (
    <div className="navbar" id="home">
      <img src={logo} alt="" />
      <img onClick={openMenu} className='nav-mob-open' src={menu_open} alt="" />
      <ul ref={menuRef} className="nav-menu" id="nav">
        <img onClick={closeMenu} src={menu_close} className='nav-mob-close' alt="" />
        <li><AnchorLink href="#home" className="anchor-link"><p onClick={()=>setMenu("home")}>Home</p>{menu==="home"?<img src={underline} alt=''/>:<></>}</AnchorLink></li>
        <li><AnchorLink href="#about" className="anchor-link" offset={50} ><p onClick={()=>setMenu("about")}>About Me</p>{menu==="about"?<img src={underline} alt=''/>:<></>}</AnchorLink></li>
        <li><AnchorLink href="#services" className="anchor-link" offset={50} ><p onClick={()=>setMenu("services")}>Services</p>{menu==="services"?<img src={underline} alt=''/>:<></>}</AnchorLink></li>
        <li><AnchorLink href="#mywork" className="anchor-link" offset={50} ><p onClick={()=>setMenu("work")}>Portfolio</p>{menu==="work"?<img src={underline} alt=''/>:<></>}</AnchorLink></li>
        <li><AnchorLink href="#contact" className="anchor-link" offset={50} ><p onClick={()=>setMenu("contact")}>Contact</p>{menu==="contact"?<img src={underline} alt=''/>:<></>}</AnchorLink></li>
      </ul>
      <div className="nav-connect">Connect With me</div>
    </div>
  );
};

export default Navbar;
