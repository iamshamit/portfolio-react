import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import blogPosts from "../data/blogData";

const Blog = () => {
    const { accentColor, accentColors } = useContext(ThemeContext);
    const [activeTag, setActiveTag] = useState("all");

    // Get unique tags from all posts
    const allTags = ["all", ...new Set(blogPosts.flatMap(post => post.tags))];

    // Filter posts by tag
    const filteredPosts = activeTag === "all"
        ? blogPosts.slice(0, 6)
        : blogPosts.filter(post => post.tags.includes(activeTag)).slice(0, 6);

    // Animation variants
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
        hover: {
            y: -10,
            transition: { duration: 0.3 },
        },
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <section id="blog" className="py-24 px-4 relative">
            {/* Decorative elements */}
            <div
                className={`absolute top-20 left-10 w-40 h-40 border-2 ${accentColors[accentColor]
                    .replace("text-", "border-")
                    .replace("shadow-", "")} rounded-full opacity-10 blur-sm`}
            ></div>
            <div className="absolute right-0 top-0 w-full h-1/3 z-0"></div>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <motion.h2
                        className={`text-4xl font-bold mb-4 ${accentColors[accentColor]}`}
                        variants={itemVariants}
                    >
                        {"// Blog"}
                    </motion.h2>

                    <motion.p
                        className="text-gray-400 mb-12 max-w-2xl"
                        variants={itemVariants}
                    >
                        Thoughts, tutorials, and insights on web development, design, and technology.
                    </motion.p>

                    {/* Tag filters */}
                    <motion.div
                        className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start"
                        variants={itemVariants}
                    >
                        {allTags.slice(0, 8).map((tag) => (
                            <motion.button
                                key={tag}
                                className={`px-4 py-2 rounded-md border text-sm transition-all ${activeTag === tag
                                    ? `${accentColors[accentColor]} shadow-glow`
                                    : "border-gray-700 hover:border-gray-500 text-gray-300"
                                    }`}
                                onClick={() => setActiveTag(tag)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Blog posts grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        key={activeTag}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                className="group bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors flex flex-col"
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                {/* Cover image */}
                                <Link to={`/blog/${post.slug}`} state={{ from: 'home' }} className="relative h-48 overflow-hidden block">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>

                                    {/* Reading time badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm ${accentColors[accentColor]}`}>
                                            {post.readTime}
                                        </span>
                                    </div>
                                </Link>

                                {/* Post info */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        {/* Date */}
                                        <p className="text-gray-500 text-sm mb-2">{formatDate(post.date)}</p>

                                        {/* Title */}
                                        <Link to={`/blog/${post.slug}`} state={{ from: 'home' }}>
                                            <h3 className={`text-xl font-bold mb-3 ${accentColors[accentColor]} hover:opacity-80 transition-opacity`}>
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Excerpt */}
                                        <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-1 bg-gray-800/50 rounded-md text-gray-400"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Read more link */}
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        state={{ from: 'home' }}
                                        className={`inline-flex items-center mt-auto pt-4 border-t border-gray-800 ${accentColors[accentColor]} hover:opacity-80 transition-opacity`}
                                    >
                                        Read Article
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* View all posts button */}
                    <motion.div className="mt-12 text-center" variants={itemVariants}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                to="/blog"
                                className={`inline-flex items-center px-6 py-3 border ${accentColors[accentColor]} rounded-md hover:shadow-glow transition-all`}
                            >
                                View All Posts
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Blog;
