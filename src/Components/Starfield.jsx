import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 400;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-initialize stars on resize to fill screen properly
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 0.5 + 0.1, // Slower horizontal speed
          speedY: Math.random() * 0.3 + 0.05, // Even slower vertical speed
          parallax: Math.random() * 0.5 + 0.5,
        });
      }
    };
    
    resizeCanvas();

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Different star colors for depth perception
      stars.forEach((star) => {
        // Adjust opacity based on radius (smaller stars are dimmer)
        const opacity = 0.4 + (star.radius / 2);
        
        // Change color slightly based on parallax for depth
        if (star.parallax > 0.8) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        } else if (star.parallax > 0.5) {
          ctx.fillStyle = `rgba(220, 220, 255, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(180, 180, 220, ${opacity * 0.8})`;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        star.x += star.speedX;
        star.y += star.speedY;
        
        // Reset stars when they move off-screen
        if (star.x > canvas.width) {
          star.x = 0;
        }
        if (star.y > canvas.height) {
          star.y = 0;
        }
      });
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate normalized mouse position (-1 to 1)
      const mouseXNorm = (clientX - centerX) / centerX;
      const mouseYNorm = (clientY - centerY) / centerY;
      
      stars.forEach((star) => {
        // Apply parallax effect based on star's parallax value
        const parallaxStrength = 2; // Adjust strength of effect
        const dx = mouseXNorm * star.parallax * parallaxStrength;
        const dy = mouseYNorm * star.parallax * parallaxStrength;
        
        star.x += dx;
        star.y += dy;
        
        // Keep stars within boundaries with some buffer
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;
      });
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -2,
        display: 'block',
        background: 'transparent',
      }}
    />
  );
};

export default Starfield;