import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { motion } from 'framer-motion';

const Contact = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);

  return (
    <section id="contact" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.h2
        className={`text-4xl font-bold mb-8 ${accentColors[accentColor]} animate-glitch`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        // Contact
      </motion.h2>
      <motion.form
        className="space-y-4"
        initial={{ opacityrikes: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label className="block text-gray-300">Name</label>
          <motion.input
            type="text"
            className={`w-full p-2 bg-transparent border-b ${accentColors[accentColor]} focus:outline-none focus:shadow-glow transition-shadow`}
            placeholder="Enter your name"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
        <div>
          <label className="block text-gray-300">Email</label>
          <motion.input
            type="email"
            className={`w-full p-2 bg-transparent border-b ${accentColors[accentColor]} focus:outline-none focus:shadow-glow transition-shadow`}
            placeholder="Enter your email"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
        <div>
          <label className="block text-gray-300">Message</label>
          <motion.textarea
            className={`w-full p-2 bg-transparent border-b ${accentColors[accentColor]} focus:outline-none focus:shadow-glow transition-shadow`}
            placeholder="Your message"
            rows="4"
            whileFocus={{ scale: 1.02 }}
          ></motion.textarea>
        </div>
        <motion.button
          type="button"
          className={`px-6 py-2 border ${accentColors[accentColor]} rounded hover:shadow-glow transition-shadow`}
          whileHover={{ scale: 1.05 }}
        >
          Send
        </motion.button>
      </motion.form>
      <motion.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <a href="https://github.com" className={`hover:shadow-glow ${accentColors[accentColor]}`}>GitHub</a>
        <a href="https://linkedin.com" className={`hover:shadow-glow ${accentColors[accentColor]}`}>LinkedIn</a>
      </motion.div>
    </section>
  );
};

export default Contact;