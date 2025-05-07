import { useContext } from 'react';
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
  location: "Odisha, India",
  skills: ["React", "Python", "Java"],
  passion: "Learning new technologies"
};`;

  return (
    <section id="about" className="py-24 px-4 relative">
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
            {'// About Me'}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  I&apos;m a <span className={accentColors[accentColor]}>full-stack developer</span> and student with a passion for building innovative digital solutions. Currently balancing my academic studies with self-taught programming, I&apos;m constantly expanding my technical toolkit.
                </p>
                <p>
                  My approach combines fresh perspectives with a strong foundation in modern frameworks. I&apos;m driven by curiosity and the excitement of solving complex problems through elegant code.
                </p>
                <p>
                  When I&apos;m not coding or studying, you can find me exploring the latest tech trends, experimenting with new programming languages, or collaborating on interesting projects with fellow developers.
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
                  href="https://drive.google.com/file/d/1ybrVKj01x9G3aZBIjdrPAEZtHY5Rd4FV/view?usp=sharing"
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
                  <div className={`text-xl ${accentColors[accentColor]}`}>4</div>
                  <div className="text-gray-400 text-sm">Programming Languages</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>3+</div>
                  <div className="text-gray-400 text-sm">Personal Projects</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>3</div>
                  <div className="text-gray-400 text-sm">Years Self-Learning</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                  <div className={`text-xl ${accentColors[accentColor]}`}>∞</div>
                  <div className="text-gray-400 text-sm">Curiosity Level</div>
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