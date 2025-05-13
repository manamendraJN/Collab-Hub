import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Users, FileText, MessageSquare, BarChart, Archive, ChevronRight, Star } from "lucide-react";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(45, 156, 219, 0.2)" },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative py-20 md:py-28 bg-gradient-to-r from-teal-50 to-indigo-50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,156,219,0.2)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:flex md:items-center md:gap-12">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
              >
                Collaborate with Ease
                <span className="block text-teal-600">RemoteCollab</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0"
              >
                Empower your team with AI-driven tools for seamless project management and collaboration.
              </motion.p>
<div className="mt-8">
  <Link
    to="/sign-up"
    className="inline-flex items-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 transition-all duration-300"
    aria-label="Start using RemoteCollab"
  >
    Start Now
    <ChevronRight className="ml-2" size={18} />
  </Link>
</div>
            </div>
            <div className="hidden md:block flex-1 mt-8 md:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-4 bg-white rounded-full shadow-md"
                >
                  <Rocket className="text-teal-500" size={48} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4"
          >
            Streamline Your Workflow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-base text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            Discover tools designed to make collaboration effortless and enjoyable.
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Rocket className="text-teal-500" size={28} />,
                title: "Project Management",
                desc: "Organize projects with intuitive tools for task assignments and deadlines.",
              },
              {
                icon: <Users className="text-teal-500" size={28} />,
                title: "Workload Optimization",
                desc: "Balance tasks intelligently to keep your team productive and stress-free.",
              },
              {
                icon: <FileText className="text-teal-500" size={28} />,
                title: "File Management",
                desc: "Securely store and version files with easy access and tracking.",
              },
              {
                icon: <MessageSquare className="text-teal-500" size={28} />,
                title: "Seamless Communication",
                desc: "Connect instantly with team chats and task discussions.",
              },
              {
                icon: <BarChart className="text-teal-500" size={28} />,
                title: "Insightful Analytics",
                desc: "Gain clarity with detailed reports on team performance.",
              },
              {
                icon: <Archive className="text-teal-500" size={28} />,
                title: "Project Archiving",
                desc: "Keep completed projects organized for future reference.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            Trusted by Teams Worldwide
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                quote: "RemoteCollab transformed our remote workflow with its intuitive tools and real-time insights.",
                author: "Sarah M., Project Manager",
              },
              {
                quote: "The workload balancer is a game-changer, making task distribution effortless and fair.",
                author: "James T., Team Lead",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
              >
                <Star className="text-teal-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600 italic">"{testimonial.quote}"</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">{testimonial.author}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-r from-teal-50 to-indigo-50 text-center"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Start Collaborating Today
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams using RemoteCollab to enhance productivity and teamwork.
          </p>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/sign-up"
              className="inline-flex items-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 transition-all duration-300"
              aria-label="Get started with RemoteCollab"
            >
              Get Started
              <ChevronRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Rocket className="mr-2 text-teal-400" size={24} />
                RemoteCollab
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Simplifying team collaboration with innovative, AI-powered tools.
              </p>
              <p className="text-xs text-gray-500 mt-4">Founded 2025 | 10K+ Happy Users</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="#" className="hover:text-teal-400 transition">Project Management</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">Workload Optimization</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">File Management</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="#" className="hover:text-teal-400 transition">Help Center</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">Guides</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">FAQ</Link></li>
                <li><Link to="#" className="hover:text-teal-400 transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="mailto:support@remotecollab.io" className="hover:text-teal-400 transition">support@remotecollab.io</a></li>
                <li><a href="tel:+1-888-555-2025" className="hover:text-teal-400 transition">+1-888-555-2025</a></li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-teal-400 transition">X</a>
                  <a href="#" className="hover:text-teal-400 transition">LinkedIn</a>
                  <a href="#" className="hover:text-teal-400 transition">Discord</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 RemoteCollab Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link to="#" className="hover:text-teal-400 transition">Terms</Link>
              <Link to="#" className="hover:text-teal-400 transition">Privacy</Link>
              <Link to="#" className="hover:text-teal-400 transition">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;