import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const Skills = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('frontend');

  const skillsData = {
    frontend: [
      { name: 'React', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'HTML/CSS', level: 90 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'TypeScript', level: 75 },
      { name: 'Vue.js', level: 65 },
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'SQL', level: 70 },
      { name: 'GraphQL', level: 65 },
    ],
    tools: [
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'CI/CD', level: 70 },
      { name: 'Figma', level: 75 },
      { name: 'Jest', level: 70 },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (level) => ({
      width: `${level}%`,
      transition: { duration: 1, ease: "easeOut" }
    }),
  };

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Decorative elements */}
        <div className={`absolute -top-10 -left-10 w-40 h-40 ${accentColors[accentColor].replace('text-', 'border-').replace('shadow-', '')} border-2 rounded-lg opacity-10 transform -rotate-12`}></div>
        <div className="absolute -bottom-5 right-20 w-20 h-20 border border-gray-700 rounded-full opacity-20"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            className={`text-4xl font-bold mb-12 ${accentColors[accentColor]}`}
            variants={itemVariants}
          >
            // Technical Skills
          </motion.h2>

          <motion.div 
            className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start"
            variants={itemVariants}
          >
            {Object.keys(skillsData).map((category) => (
              <motion.button
                key={category}
                className={`px-6 py-2 rounded-md border transition-all ${
                  activeCategory === category
                    ? `${accentColors[accentColor]} shadow-glow`
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
            variants={containerVariants}
            key={activeCategory}
            initial="hidden"
            animate="visible"
          >
            {skillsData[activeCategory].map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="mb-4"
                variants={itemVariants}
                custom={index}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-mono">{skill.name}</span>
                  <span className={`${accentColors[accentColor]}`}>{skill.level}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${accentColors[accentColor].replace('text-', 'bg-').replace('border-', 'bg-').replace('shadow-', 'bg-')}`}
                    variants={barVariants}
                    custom={skill.level}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
            variants={itemVariants}
          >
            {/* Tech logos icons */}
            {['React', 'Node.js', 'MongoDB', 'Python', 'Docker', 'AWS'].map((tech) => (
              <motion.div
                key={tech}
                className="flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`text-2xl mb-2 ${accentColors[accentColor]}`}>
                  {/* Placeholder for tech logo */}
                  <div className="w-10 h-10 flex items-center justify-center border-2 rounded-md">
                    {tech.charAt(0)}
                  </div>
                </div>
                <span className="text-sm text-center">{tech}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;