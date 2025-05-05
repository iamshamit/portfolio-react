import React, { useContext, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ThemeContext } from '../App';

const Skills = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('frontend');

  const skillsData = {
    frontend: [
      { name: 'React', level: 70 },
      { name: 'JavaScript', level: 75 },
      { name: 'HTML/CSS', level: 90 },
      { name: 'Bootstrap', level: 90 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'Vite', level: 80 },
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
    ],
    tools: [
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 70 },
    ],
  };

  // Map accent colors to background colors directly
  const getProgressBarColor = () => {
    // Extract color name from accentColors[accentColor]
    const colorClass = accentColors[accentColor];
    
    // Map common color names to their bg equivalents
    if (colorClass.includes('text-blue')) return 'bg-blue-500';
    if (colorClass.includes('text-green')) return 'bg-green-500';
    if (colorClass.includes('text-red')) return 'bg-red-500';
    if (colorClass.includes('text-yellow')) return 'bg-yellow-500';
    if (colorClass.includes('text-purple')) return 'bg-purple-500';
    if (colorClass.includes('text-pink')) return 'bg-pink-500';
    if (colorClass.includes('text-indigo')) return 'bg-indigo-500';
    if (colorClass.includes('text-cyan')) return 'bg-cyan-500';
    if (colorClass.includes('text-teal')) return 'bg-teal-500';
    if (colorClass.includes('text-orange')) return 'bg-orange-500';
    
    // Default fallback
    return 'bg-blue-500';
  };

  // Custom ProgressBar component with animation
  const ProgressBar = ({ level }) => {
    const controls = useAnimation();
    
    useEffect(() => {
      controls.start({
        width: `${level}%`,
        transition: { duration: 1.2, ease: "easeOut" }
      });
    }, [controls, level, activeCategory]);
    
    return (
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full shadow-md ${getProgressBarColor()}`}
          initial={{ width: "0%" }}
          animate={controls}
        />
      </div>
    );
  };

  // Tech logo components
  const TechLogos = {
    React: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path 
          fill="currentColor" 
          d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85s-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z" 
        />
      </svg>
    ),
    'Node.js': () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path 
          fill="currentColor" 
          d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 01-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0L10 19.65c-.08-.03-.16-.04-.21-.01-.53.3-.65.36-1.16.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 00-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16C18.21 8.9 17.22 8 14 8z" 
        />
      </svg>
    ),
    MongoDB: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 24" className="w-full h-full">
        <path 
          fill="currentColor" 
          d="m10.562 9.518c-1.263-5.56-4.242-7.387-4.562-8.086-.262-.408-.508-.879-.711-1.372l-.022-.06c0 .019 0 .031-.005.049v.013.039.015.026.026.012s0 .009 0 .013v-.001.021c0 .003.001.007.001.011s0 .007-.001.011v.02.032l-.009.05v.01.006s0 .004 0 .006v.041h-.005v.016h-.036v.057h-.006v.046h-.024v.038.003s0 .002 0 .003v.01.005s0 .003 0 .005l-.023.017-.005.007v.022h-.005v.018h-.006v.045h-.006v.019h-.005v.018h-.005v.022h-.045v.015h-.005v.019h-.005v.015h-.006v.023h-.005v.006s0 0 0 0v.003s0 .002 0 .004c-.019.009-.035.021-.049.034-.003.003-.006.006-.009.01s0 0 0 0v.058h-.005v-.008h-.005v.01h-.005v.008h-.005v.022h-.061v.01h-.01v.02h-.03v.01h-.005v.006h-.01v.01h-.03v.006h-.005v.058h-.006v.01h-.005v.006h-.005v.006c-.004.006-.009.011-.014.016l-.012.01c-.014.01-.027.021-.039.032-.008.006-.015.011-.022.017l-.049.039-.074.062c-.057.047-.117.1-.186.159-.169.148-.37.338-.6.568l-.015.015c-2.234 2.374-3.637 5.553-3.729 9.059v.018c-.008.155-.013.336-.013.518 0 .22.007.439.02.656l-.001-.03v.009c.112 1.765.628 3.389 1.456 4.808l-.028-.052c.308.54.614.999.948 1.435l-.022-.03c.727.963 1.555 1.795 2.483 2.503l.031.023c.255.766.403 1.647.403 2.563 0 .076-.001.152-.003.227v-.011l.644.215c-.027-.303-.043-.655-.043-1.01 0-.533.035-1.058.102-1.572l-.006.061c.065-.257.186-.48.35-.664l-.001.002c.298-.213.559-.424.806-.651l-.006.006c.018-.019.028-.036.044-.054 2.227-2.09 3.614-5.051 3.614-8.337 0-.801-.082-1.582-.239-2.337l.013.074z"
        />
      </svg>
    ),
    Python: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
        <polygon fill="currentColor" points="18.231 7.357 18.232 7.357 18.232 7.353" />
        <path 
          fill="currentColor" 
          d="M20.699,17.748c1.666,0,2.282-1.162,2.861-2.904c0.6-1.794,0.574-3.52,0-5.818c-0.413-1.655-1.194-2.904-2.861-2.904h-2.147v2.541c0,1.971-1.672,3.632-3.578,3.632H9.252c-1.565,0-2.861,1.339-2.861,2.909v5.454c0,1.553,1.35,2.464,2.861,2.909c1.81,0.53,3.552,0.626,5.721,0c1.441-0.418,2.861-1.26,2.861-2.909v-2.181h-5.717v-0.728H20.699z M15.332,19.929c0.594,0,1.077,0.488,1.077,1.088c0,0.606-0.482,1.093-1.077,1.093c-0.59,0-1.077-0.493-1.077-1.093C14.261,20.411,14.744,19.929,15.332,19.929z"
        />
        <path 
          fill="currentColor" 
          d="M3.444,17.749H5.41v-2.615c0-1.891,1.634-3.558,3.578-3.558h5.721c1.591,0,2.861-1.312,2.861-2.909V3.209c0-1.553-1.307-2.717-2.861-2.978c-1.918-0.317-4.002-0.299-5.721,0.006l0.001-0.001C6.567,0.664,6.129,1.558,6.129,3.213v2.181h5.727v0.729H3.98c-1.666,0-3.124,1.002-3.578,2.904c-0.525,2.181-0.546,3.541,0,5.818C0.808,16.538,1.779,17.749,3.444,17.749z M8.63,3.937c-0.594,0-1.077-0.488-1.077-1.088C7.56,2.243,8.036,1.756,8.63,1.756c0.59,0,1.077,0.492,1.077,1.093S9.225,3.937,8.63,3.937z"
        />
      </svg>
    ),
    Docker: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path 
          fill="currentColor" 
          d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .183-.185V9.006a.185.185 0 0 0-.183-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" 
        />
      </svg>
    )
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
            {'// Technical Skills'}
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
                {/* Use the animated progress bar component */}
                <ProgressBar level={skill.level} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
            variants={itemVariants}
          >
            {['React', 'Node.js', 'MongoDB', 'Python', 'Docker'].map((tech) => (
              <motion.div
                key={tech}
                className="flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`text-2xl mb-2 ${accentColors[accentColor]}`}>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {TechLogos[tech] ? React.createElement(TechLogos[tech]) : tech.charAt(0)}
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