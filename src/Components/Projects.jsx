import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const Projects = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'NeoChat',
      description: 'End-to-end encrypted messaging application with cyberpunk-inspired UI',
      image: '/api/placeholder/600/400',
      category: 'frontend',
      stack: ['React', 'Firebase', 'TailwindCSS'],
      demoLink: 'https://neochat.example.com',
      codeLink: 'https://github.com/johndoe/neochat',
      featured: true
    },
    {
      id: 2,
      title: 'CyberShop',
      description: 'Full-stack e-commerce platform for digital products with secure payment integration',
      image: '/api/placeholder/600/400',
      category: 'fullstack',
      stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      demoLink: 'https://cybershop.example.com',
      codeLink: 'https://github.com/johndoe/cybershop',
      featured: true
    },
    {
      id: 3,
      title: 'Network Monitor',
      description: 'Real-time network monitoring dashboard for system administrators',
      image: '/api/placeholder/600/400',
      category: 'backend',
      stack: ['Python', 'Flask', 'D3.js', 'WebSockets'],
      demoLink: 'https://netmonitor.example.com',
      codeLink: 'https://github.com/johndoe/network-monitor',
      featured: false
    },
    {
      id: 4,
      title: 'AI Code Assistant',
      description: 'AI-powered code completion and refactoring tool',
      image: '/api/placeholder/600/400',
      category: 'ai',
      stack: ['Python', 'TensorFlow', 'React', 'Express'],
      demoLink: 'https://ai-code.example.com',
      codeLink: 'https://github.com/johndoe/ai-code-assistant',
      featured: true
    },
    {
      id: 5,
      title: 'Weather Data Visualizer',
      description: 'Interactive weather data visualization with historical comparisons',
      image: '/api/placeholder/600/400',
      category: 'frontend',
      stack: ['Vue.js', 'D3.js', 'Weather API'],
      demoLink: 'https://weather-viz.example.com',
      codeLink: 'https://github.com/johndoe/weather-viz',
      featured: false
    },
    {
      id: 6,
      title: 'Task Management API',
      description: 'RESTful API for task management with advanced filtering and sorting',
      image: '/api/placeholder/600/400',
      category: 'backend',
      stack: ['Node.js', 'Express', 'MongoDB', 'Jest'],
      demoLink: 'https://task-api.example.com/docs',
      codeLink: 'https://github.com/johndoe/task-api',
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : activeFilter === 'featured'
      ? projects.filter(project => project.featured)
      : projects.filter(project => project.category === activeFilter);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="projects" className="py-24 px-4 relative">
      {/* Decorative elements */}
      <div className={`absolute top-40 right-10 w-32 h-32 border-2 ${accentColors[accentColor].replace('text-', 'border-').replace('shadow-', '')} rounded-full opacity-10 blur-sm`}></div>
      <div className="absolute left-0 bottom-0 w-full h-1/3 z-0"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2 
            className={`text-4xl font-bold mb-12 ${accentColors[accentColor]}`}
            variants={itemVariants}
          >
            // Projects
          </motion.h2>

          <motion.div 
            className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start"
            variants={itemVariants}
          >
            {['all', 'featured', 'frontend', 'backend', 'fullstack', 'ai'].map((filter) => (
              <motion.button
                key={filter}
                className={`px-6 py-2 rounded-md border transition-all ${
                  activeFilter === filter
                    ? `${accentColors[accentColor]} shadow-glow`
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            key={activeFilter}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors"
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Project image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className={`text-xs px-2 py-1 rounded-md ${accentColors[accentColor].replace('text-', 'bg-').replace('border-', 'bg-').replace('shadow-', 'bg-')} bg-opacity-30`}>
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Project info */}
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${accentColors[accentColor]}`}>{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack.map((tech) => (
                      <span 
                        key={tech} 
                        className="text-xs px-2 py-1 bg-gray-800 rounded-md text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  <div className="flex gap-4">
                    <a 
                      href={project.demoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`px-4 py-2 border ${accentColors[accentColor]} rounded hover:shadow-glow transition-shadow text-sm`}
                    >
                      Live Demo
                    </a>
                    <a 
                      href={project.codeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-700 rounded hover:border-gray-500 transition-colors text-sm"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Show more projects button */}
          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <motion.a
              href="https://github.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-6 py-3 border ${accentColors[accentColor]} rounded-md hover:shadow-glow transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              View More Projects
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
      );
    };
    
    export default Projects;