import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const About = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Terminal-style code snippet
  const codeSnippet = `const developer = {
  name: "Shamit Mishra",
  type: "Full-Stack Developer",
  location: "Neo Tokyo",
  skills: ["React", "Node.js", "Python"],
  passion: "Building cyberpunk-inspired UIs"
};`;

  return (
    <section id="about" className="pt-0 mt-0 py-24 px-4 relative">
      {/* Background grid accent */}
      <div className="absolute right-0 top-20 w-64 h-64 border border-dashed rounded-full opacity-10 blur-sm"></div>
      <div className={`absolute left-10 bottom-20 w-32 h-32 ${accentColors[accentColor].replace('text-', 'bg-').replace('border-', 'bg-').replace('shadow-', 'bg-')} opacity-5 rounded-full filter blur-xl`}></div>
      
      <div className="max-w-4xl mx-auto">
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
            // About Me
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  I'm a <span className={accentColors[accentColor]}>full-stack developer</span> with a passion for creating immersive digital experiences. With 5+ years of experience in web development, I specialize in building scalable applications with modern frameworks and technologies.
                </p>
                <p>
                  My approach combines technical expertise with creative problem-solving to deliver solutions that not only meet functional requirements but also provide engaging user experiences.
                </p>
                <p>
                  When I'm not coding, you can find me exploring the latest in AI technology, contributing to open-source projects, or designing retro-futuristic interfaces.
                </p>
              </div>
              
              <motion.div 
                className="mt-8 flex gap-4"
                variants={itemVariants}
              >
                <motion.a 
                  href="#projects"
                  className={`px-6 py-2 border ${accentColors[accentColor]} rounded hover:shadow-glow transition-shadow`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Projects
                </motion.a>
                <motion.a 
                  href="/resume.pdf"
                  className="px-6 py-2 border border-gray-700 rounded hover:border-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Resume
                </motion.a>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className={`bg-black/50 backdrop-blur-sm p-6 rounded-lg border ${accentColors[accentColor].replace('text-', 'border-').replace('shadow-', 'border-')} font-mono overflow-hidden relative`}>
                <div className={`absolute top-0 left-0 right-0 h-6 bg-black/80 flex items-center px-4 ${accentColors[accentColor].replace('text-', 'border-b-')}`}>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="pt-6">
                  <pre className="text-xs sm:text-sm whitespace-pre-wrap text-gray-300">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              </div>
              
              {/* Stats section */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-6 mt-8"
              >
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>5+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>20+</div>
                  <div className="text-gray-400 text-sm">Projects Completed</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>10+</div>
                  <div className="text-gray-400 text-sm">Happy Clients</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>3</div>
                  <div className="text-gray-400 text-sm">Open Source Contributions</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;