import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Landingpg = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased overflow-x-hidden">
      {/* Hero Section (Unchanged as per your request) */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative py-28 md:py-36 bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.2)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex md:items-center md:gap-12">
            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-wide leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  RemoteCollab
                </span>
                Next-Gen Teamwork
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
                Revolutionize your workflow with AI-driven task management and immersive collaboration tools.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} className="mt-8 inline-block">
                <Link
                  to="/sign-up"
                  className="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 backdrop-blur-md bg-opacity-80 border border-indigo-400/30"
                >
                  Launch Now
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:block flex-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-indigo-800/20 p-6 rounded-xl backdrop-blur-lg border border-indigo-500/20"
              >
                <p className="text-sm text-indigo-200 italic">“The future of remote work is here.”</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-16">
            Core Features
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "📋",
                title: "Project Creation & Management",
                desc: "Define projects with names, descriptions, dates, and team members. Send instant invites.",
              },
              {
                icon: "⚖️",
                title: "Smart Workload Balancer",
                desc: "Assign tasks by complexity and deadlines. Rebalance workloads automatically.",
              },
              {
                icon: "📂",
                title: "File Management & Versioning",
                desc: "Upload, version, and restore files with full history tracking.",
              },
              {
                icon: "💬",
                title: "Communication & Collaboration",
                desc: "Comment on tasks, chat live, and share files seamlessly.",
              },
              {
                icon: "📊",
                title: "Reports & Analytics",
                desc: "Track progress, performance, and productivity with detailed reports.",
              },
              {
                icon: "✅",
                title: "Project Archiving",
                desc: "Complete and archive projects for easy future access.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <span className="text-4xl mb-4 block text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-br from-indigo-900 to-black text-center"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
            Optimize Your Team Today
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Leverage AI and real-time tools to elevate collaboration and efficiency.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/sign-up"
              className="inline-block px-8 py-4 bg-indigo-500 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 backdrop-blur-md bg-opacity-80 border border-indigo-400/30"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">RemoteCollab</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Next-gen tools for project management and team collaboration.
              </p>
              <p className="text-xs text-gray-500 mt-4">Founded 2025 | 10K+ Users</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400 transition">Project Management</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Task Balancing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">File Versioning</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Guides</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="mailto:support@remotecollab.io" className="hover:text-indigo-400 transition">support@remotecollab.io</a></li>
                <li><a href="tel:+1-888-555-2025" className="hover:text-indigo-400 transition">+1-888-555-2025</a></li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-indigo-400 transition">X</a>
                  <a href="#" className="hover:text-indigo-400 transition">LinkedIn</a>
                  <a href="#" className="hover:text-indigo-400 transition">Discord</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 RemoteCollab Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <a href="#" className="hover:text-indigo-400 transition">Terms</a>
              <a href="#" className="hover:text-indigo-400 transition">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landingpg;