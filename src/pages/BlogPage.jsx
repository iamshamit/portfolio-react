import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import blogPosts from "../data/blogData";
import Starfield from "../Components/Starfield";

const BlogPage = () => {
    const { accentColor, accentColors } = useContext(ThemeContext);
    const [activeTag, setActiveTag] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique tags from all posts
    const allTags = ["all", ...new Set(blogPosts.flatMap(post => post.tags))];

    // Filter posts by tag and search
    const filteredPosts = blogPosts.filter(post => {
        const matchesTag = activeTag === "all" || post.tags.includes(activeTag);
        const matchesSearch = searchQuery === "" ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

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
            y: -5,
            transition: { duration: 0.3 },
        },
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
            {/* Starfield background */}
            <div className="fixed inset-0 z-0">
                <Starfield />
            </div>

            {/* Scanlines effect */}
            <div className="scanlines"></div>

            {/* Header */}
            <header className="py-6 px-4 border-b border-gray-800 relative z-10 bg-[#0D0D0D]/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link
                        to="/"
                        className={`flex items-center ${accentColors[accentColor]} hover:opacity-80 transition-opacity`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Home
                    </Link>
                    <span className={`text-2xl font-bold ${accentColors[accentColor]}`}>
                        {"<Blog />"}
                    </span>
                </div>
            </header>

            <main className="py-16 px-4 relative z-10">
                {/* Decorative elements */}
                <div
                    className={`absolute top-40 right-10 w-48 h-48 border-2 ${accentColors[accentColor]
                        .replace("text-", "border-")
                        .replace("shadow-", "")} rounded-full opacity-5 blur-sm`}
                ></div>
                <div
                    className={`absolute bottom-40 left-10 w-32 h-32 border-2 ${accentColors[accentColor]
                        .replace("text-", "border-")
                        .replace("shadow-", "")} opacity-5 blur-sm`}
                ></div>

                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            className={`text-5xl font-bold mb-4 ${accentColors[accentColor]}`}
                            variants={itemVariants}
                        >
                            {"// All Posts"}
                        </motion.h1>

                        <motion.p
                            className="text-gray-400 mb-8 max-w-2xl"
                            variants={itemVariants}
                        >
                            Explore all articles on web development, programming, and technology.
                        </motion.p>

                        {/* Search bar */}
                        <motion.div className="mb-8" variants={itemVariants}>
                            <div className="relative max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full px-4 py-3 pl-12 bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors`}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Tag filters */}
                        <motion.div
                            className="flex flex-wrap gap-3 mb-12"
                            variants={itemVariants}
                        >
                            {allTags.map((tag) => (
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

                        {/* Results count */}
                        <motion.p className="text-gray-500 mb-8" variants={itemVariants}>
                            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                        </motion.p>

                        {/* Blog posts list */}
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            key={`${activeTag}-${searchQuery}`}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredPosts.map((post) => (
                                <motion.article
                                    key={post.id}
                                    className="group bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors"
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <Link to={`/blog/${post.slug}`} state={{ from: 'blog' }} className="flex flex-col md:flex-row">
                                        {/* Cover image */}
                                        <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 md:block hidden"></div>
                                        </div>

                                        {/* Post info */}
                                        <div className="p-6 flex-grow flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-gray-500 text-sm">{formatDate(post.date)}</span>
                                                <span className={`text-xs px-3 py-1 rounded-full bg-black/60 ${accentColors[accentColor]}`}>
                                                    {post.readTime}
                                                </span>
                                            </div>

                                            <h2 className={`text-2xl font-bold mb-3 ${accentColors[accentColor]} group-hover:opacity-80 transition-opacity`}>
                                                {post.title}
                                            </h2>

                                            <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
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

                                        {/* Arrow indicator */}
                                        <div className="hidden md:flex items-center justify-center px-6">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-6 w-6 ${accentColors[accentColor]} transition-transform group-hover:translate-x-2`}
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
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}

                            {filteredPosts.length === 0 && (
                                <motion.div
                                    className="text-center py-16"
                                    variants={itemVariants}
                                >
                                    <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                                    <button
                                        onClick={() => { setActiveTag("all"); setSearchQuery(""); }}
                                        className={`mt-4 ${accentColors[accentColor]} hover:opacity-80 transition-opacity`}
                                    >
                                        Clear filters
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default BlogPage;
