import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import blogPosts from "../data/blogData";
import Starfield from "../Components/Starfield";

// Copyable Code Block Component
const CodeBlock = ({ code, language, accentColors, accentColor }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative group my-6">
            {/* Language badge & Copy button */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-black/80 border-b border-gray-800 rounded-t-lg">
                <span className={`text-xs font-mono ${accentColors[accentColor]}`}>
                    {language || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded transition-all ${copied
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="bg-black/60 border border-gray-800 rounded-lg pt-12 pb-4 px-4 overflow-x-auto">
                <code className={`text-sm font-mono text-gray-300 language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

const BlogPost = () => {
    const { accentColor, accentColors } = useContext(ThemeContext);
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine where to navigate back to
    const handleBack = () => {
        const from = location.state?.from;
        if (from === 'home') {
            navigate('/#blog');
        } else if (from === 'blog') {
            navigate('/blog');
        } else {
            navigate(-1); // Fallback to browser history
        }
    };

    // Find the post
    const post = blogPosts.find(p => p.slug === slug);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // If post not found, redirect to blog
    if (!post) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${accentColors[accentColor]}`}>
                        Post Not Found
                    </h1>
                    <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
                    <Link
                        to="/blog"
                        className={`inline-flex items-center px-6 py-3 border ${accentColors[accentColor]} rounded-md hover:shadow-glow transition-all`}
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    // Get related posts (same tags)
    const relatedPosts = blogPosts
        .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 2);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Simple markdown-like content renderer
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeContent = [];
        let codeLanguage = '';

        lines.forEach((line, index) => {
            // Skip horizontal rules
            if (line.trim() === '---') {
                return;
            }

            // Code block start
            if (line.startsWith('```') && !inCodeBlock) {
                inCodeBlock = true;
                codeLanguage = line.slice(3);
                codeContent = [];
                return;
            }

            // Code block end
            if (line.startsWith('```') && inCodeBlock) {
                inCodeBlock = false;
                elements.push(
                    <CodeBlock
                        key={`code-${index}`}
                        code={codeContent.join('\n')}
                        language={codeLanguage}
                        accentColors={accentColors}
                        accentColor={accentColor}
                    />
                );
                return;
            }

            // Inside code block
            if (inCodeBlock) {
                codeContent.push(line);
                return;
            }

            // H2 headers
            if (line.startsWith('## ')) {
                elements.push(
                    <h2
                        key={index}
                        className={`text-2xl font-bold mt-10 mb-4 ${accentColors[accentColor]}`}
                    >
                        {line.slice(3)}
                    </h2>
                );
                return;
            }

            // H3 headers
            if (line.startsWith('### ')) {
                elements.push(
                    <h3
                        key={index}
                        className="text-xl font-bold mt-8 mb-3 text-white"
                    >
                        {line.slice(4)}
                    </h3>
                );
                return;
            }

            // List items
            if (line.startsWith('- ')) {
                elements.push(
                    <li key={index} className="text-gray-300 ml-6 mb-2 list-disc">
                        {renderInlineCode(line.slice(2))}
                    </li>
                );
                return;
            }

            // Numbered list
            if (/^\d+\.\s/.test(line)) {
                const content = line.replace(/^\d+\.\s/, '');
                elements.push(
                    <li key={index} className="text-gray-300 ml-6 mb-2 list-decimal">
                        {renderInlineCode(content)}
                    </li>
                );
                return;
            }

            // Empty lines
            if (line.trim() === '') {
                return;
            }

            // Regular paragraphs
            elements.push(
                <p key={index} className="text-gray-300 leading-relaxed mb-4">
                    {renderInlineCode(line)}
                </p>
            );
        });

        return elements;
    };

    // Render inline code and bold text
    const renderInlineCode = (text) => {
        const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={i}
                        className={`px-2 py-0.5 bg-black/60 rounded text-sm font-mono ${accentColors[accentColor]}`}
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
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
            <header className="py-6 px-4 border-b border-gray-800 sticky top-0 bg-[#0D0D0D]/90 backdrop-blur-sm z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={handleBack}
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
                        Back
                    </button>
                    <Link to="/" className={`text-xl font-bold ${accentColors[accentColor]}`}>
                        {"</>"}
                    </Link>
                </div>
            </header>

            <main className="py-16 px-4 relative z-10">
                {/* Decorative elements */}
                <div
                    className={`absolute top-20 right-10 w-64 h-64 border-2 ${accentColors[accentColor]
                        .replace("text-", "border-")
                        .replace("shadow-", "")} rounded-full opacity-5 blur-sm`}
                ></div>

                <motion.article
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Cover image */}
                    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent"></div>
                    </div>

                    {/* Post header */}
                    <header className="mb-12">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    to={`/blog?tag=${tag}`}
                                    className={`text-sm px-3 py-1 rounded-full border ${accentColors[accentColor]} hover:shadow-glow transition-all`}
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${accentColors[accentColor]} leading-tight`}>
                            {post.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-gray-500">
                            <span>{formatDate(post.date)}</span>
                            <span>•</span>
                            <span className={accentColors[accentColor]}>{post.readTime}</span>
                        </div>
                    </header>

                    {/* Post content */}
                    <div className="prose prose-invert max-w-none">
                        {renderContent(post.content)}
                    </div>

                    {/* Divider */}
                    <div className={`my-16 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent`}></div>

                    {/* Related posts */}
                    {relatedPosts.length > 0 && (
                        <section>
                            <h2 className={`text-2xl font-bold mb-8 ${accentColors[accentColor]}`}>
                                Related Articles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        to={`/blog/${relatedPost.slug}`}
                                        className="group bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={relatedPost.coverImage}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className={`font-bold ${accentColors[accentColor]} group-hover:opacity-80 transition-opacity`}>
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">{relatedPost.readTime}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Back to blog */}
                    <div className="mt-16 text-center">
                        <Link
                            to="/blog"
                            className={`inline-flex items-center px-6 py-3 border ${accentColors[accentColor]} rounded-md hover:shadow-glow transition-all`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
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
                            All Articles
                        </Link>
                    </div>
                </motion.article>
            </main>
        </div>
    );
};

export default BlogPost;
