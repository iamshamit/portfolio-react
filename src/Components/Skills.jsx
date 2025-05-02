import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';
const skills = [
  { name: 'React', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'sophomore', icon: '📜' },
  { name: 'Python', icon: '🐍' },
  { name: 'Docker', icon: '🐳' },
];

const Skills = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [viewMode, setViewMode] = useState('grid');

  return (
    <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
      <motion.h2
        className={`text-4xl font-bold mb-8 ${accentColors[accentColor]} animate-glitch`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        // Skills
      </motion.h2>
      <motion.button
        className={`mb-4 px-4 py-2 font-mono ${accentColors[accentColor]} border rounded hover:shadow-glow transition-shadow`}
        onClick={() => setViewMode(viewMode === 'grid' ? 'terminal' : 'grid')}
        whileHover={{ scale: 1.05 }}
      >
        Toggle {viewMode === 'grid' ? 'Terminal' : 'Grid'} View
      </motion.button>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className={`p-4 border ${accentColors[accentColor]} rounded-lg text-center hover:shadow-glow transition-shadow`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="text-3xl">{skill.icon}</span>
              <p className="mt-2">{skill.name}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="font-mono text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <pre>
            {skills.map((skill) => `> ${skill.name}`).join('\n')}
          </pre>
        </motion.div>
      )}
    </section>
  );
};

export default Skills;