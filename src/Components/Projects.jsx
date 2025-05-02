import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'CyberShop',
    description: 'E-commerce platform with real-time inventory.',
    link: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'NeoChat',
    description: 'Encrypted messaging app with WebSocket.',
    link: 'https://github.com',
    demo: 'https://demo.com',
  },
];

const Projects = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);

  return (
    <section id="projects" className="py-20 px-4 max-w-6xl mx-auto">
      <motion.h2
        className={`text-4xl font-bold mb-8 ${accentColors[accentColor]} animate-glitch`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        // Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className={`p-6 border ${accentColors[accentColor]} rounded-lg hover:shadow-glow transition-shadow`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-bold">{project.title}</h3>
            <p className="text-gray-300 mt-2">{project.description}</p>
            <div className="mt-4 flex gap-4">
              <a href={project.link} className={`hover:shadow-glow ${accentColors[accentColor]}`}>GitHub</a>
              <a href={project.demo} className={`hover:shadow-glow ${accentColors[accentColor]}`}>Demo</a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;