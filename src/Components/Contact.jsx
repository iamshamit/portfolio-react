import { useContext, useState } from 'react';
import { ThemeContext } from '../App';
import { motion } from 'framer-motion';

const Contact = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('access_key', '4943bd77-bdef-4853-a1b1-4ad34dc1cb70');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setFormStatus(null);
        }, 3000);
      } else {
        setFormStatus('error');
        setTimeout(() => {
          setFormStatus(null);
        }, 3000);
      }
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: `0 0 10px 2px ${accentColor === 'neon-blue' ? '#00FFFF30' : accentColor === 'neon-green' ? '#00FF8830' : '#B388FF30'}` },
    blur: { scale: 1, boxShadow: 'none' }
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/iamshamit/', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
  ];

  return (
    <section id="contact" className="py-24 px-4 relative">
      {/* Decorative elements */}
      <div className={`absolute -bottom-20 -right-20 w-80 h-80 ${accentColors[accentColor].replace('text-', 'bg-').replace('border-', 'bg-').replace('shadow-', 'bg-')} opacity-5 rounded-full blur-3xl`}></div>
      <div className="absolute top-20 left-10 w-20 h-20 border border-gray-700 rounded-full opacity-20"></div>
      
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
            {'// Contact'}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <p className="text-gray-300 mb-8">
                Have a project in mind or want to collaborate? Feel free to reach out. I&apos;m always open to discussing new opportunities and ideas.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <motion.a
                    href="mailto:shamitmishra22@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full border ${accentColors[accentColor]} flex items-center justify-center hover:shadow-glow transition-shadow`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.a>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-gray-200">shamitmishra22@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.a
                    href="https://en.wikipedia.org/wiki/Odisha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full border ${accentColors[accentColor]} flex items-center justify-center hover:shadow-glow transition-shadow`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.a>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-gray-200">Odisha, India</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4">Find me on</h4>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full border ${accentColors[accentColor]} flex items-center justify-center hover:shadow-glow transition-shadow`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={link.name}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-current"
                      >
                        <path d={link.icon} />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.form
                className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Name</label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 bg-black/50 border-b ${accentColors[accentColor]} rounded focus:outline-none transition-all`}
                    placeholder="Your name"
                    required
                    whileFocus="focus"
                    whileTap="focus"
                    variants={inputVariants}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email</label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 bg-black/50 border-b ${accentColors[accentColor]} rounded focus:outline-none transition-all`}
                    placeholder="your.email@example.com"
                    required
                    whileFocus="focus"
                    whileTap="focus"
                    variants={inputVariants}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Message</label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 bg-black/50 border-b ${accentColors[accentColor]} rounded focus:outline-none transition-all`}
                    placeholder="Your message"
                    rows="4"
                    required
                    whileFocus="focus"
                    whileTap="focus"
                    variants={inputVariants}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  className={`w-full px-6 py-3 border ${accentColors[accentColor]} rounded hover:shadow-glow transition-all flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Message Sent!</span>
                    </>
                  ) : formStatus === 'error' ? (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>Error! Try Again</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;