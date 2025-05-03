import { useEffect, useRef } from 'react';

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
    };
    resizeCanvas();

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width * 2 - canvas.width, // Start beyond the screen
        y: Math.random() * canvas.height * 2 - canvas.height, // Start beyond the screen
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 2 ,
        parallax: Math.random() * 0.5 + 0.5,
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.x += star.speed;
        star.y += star.speed;
        if (star.x > canvas.width || star.y > canvas.height) {
          star.x = Math.random() * canvas.width * 2 - canvas.width;
          star.y = Math.random() * canvas.height * 2 - canvas.height;
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
      stars.forEach((star) => {
        const dx = (clientX - centerX) * star.parallax * 0.005;
        const dy = (clientY - centerY) * star.parallax * 0.005;
        star.x += dx * 0.1;
        star.y += dy * 0.1;
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
        zIndex: -1,
        filter: 'blur(0.5px)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
};

export default Starfield;
