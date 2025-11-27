import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../utils/animations';

const HowToUsePage = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: <MessageSquare className="w-6 h-6 text-primary" />,
            title: "Chat with AI",
            description: "Start a conversation with our AI stylist. Ask for outfit recommendations, style advice, or specific clothing items. The AI understands context and your preferences."
        },
        {
            icon: <User className="w-6 h-6 text-primary" />,
            title: "Create Your Profile",
            description: "Sign up to save your chat history and personalize your experience. Your profile stores your basic information and allows you to manage your account security."
        },
        {
            icon: <Settings className="w-6 h-6 text-primary" />,
            title: "Set Preferences",
            description: "Tell us what you like! In the Preferences section, you can select your favorite styles, colors, brands, and more. The AI uses this information to tailor its recommendations specifically to you."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-primary" />,
            title: "Get Recommendations",
            description: "Receive curated product suggestions with images and details. You can ask follow-up questions to refine the results until you find exactly what you're looking for."
        }
    ];

    return (
        <div className="min-h-screen bg-background dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex items-center gap-4 mb-12"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-text-dark dark:text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-roboto font-bold text-text-dark dark:text-white mb-2">
                            How to Use StyleFinder
                        </h1>
                        <p className="text-text-medium dark:text-gray-400">
                            Your comprehensive guide to getting the most out of your personal AI stylist.
                        </p>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                                {section.title}
                            </h3>
                            <p className="text-text-medium dark:text-gray-400 leading-relaxed">
                                {section.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ / Tips Section */}
                <motion.div
                    className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 border border-primary/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-6">
                        Pro Tips
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                            <p className="text-text-dark dark:text-gray-300">
                                <strong>Be specific:</strong> The more details you provide (occasion, weather, budget), the better the recommendations.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                            <p className="text-text-dark dark:text-gray-300">
                                <strong>Update often:</strong> As your style evolves, update your preferences to keep recommendations fresh.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
                            <p className="text-text-dark dark:text-gray-300">
                                <strong>Give feedback:</strong> Tell the AI what you like or dislike about its suggestions to help it learn.
                            </p>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default HowToUsePage;
