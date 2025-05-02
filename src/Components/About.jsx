import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const About = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);

  return (
    <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.h2
        className={`text-4xl font-bold mb-8 ${accentColors[accentColor]} animate-glitch`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        // About Me
      </motion.h2>
      <motion.div
        className="flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:w-1/2">
          <p className="text-gray-300 mb-4">
            I'm a passionate developer with a knack for crafting immersive digital experiences. My journey began with a curiosity for code and evolved into a career building scalable, user-centric applications.
          </p>
          <p className="text-gray-300">
            When I'm not coding, you'll find me exploring cyberpunk aesthetics or tinkering with new tech.
          </p>
        </div>
        <motion.div
          className="md:w-1/2 font-mono text-sm text-gray-400"
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <pre className="animate-glitch">
            {`
┳━━┓ ┳━┓┳┓ ┳ ┳┓ ┳ ┳┓
┣┳┓┣┻┓┃┗┳┣┫┣┻┣┻┣┫
┻┻┻┻┻┻┻ ┻┻┻┻┻┻ ┻┻
            `}
          </pre>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;