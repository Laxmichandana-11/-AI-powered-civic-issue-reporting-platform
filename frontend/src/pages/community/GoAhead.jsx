import { ArrowLeft, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function GoAhead() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 p-6 flex flex-col items-center">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between w-full max-w-md mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.div whileHover={{ x: -3 }}>
          <Link
            to="/community"
            className="flex items-center gap-1 text-orange-600 font-semibold hover:text-orange-700 transition"
          >
            <ArrowLeft size={20} className="text-orange-600" />
            <span className="text-sm">Back</span>
          </Link>
        </motion.div>

        {/* Center Icon + Title */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="bg-orange-100 p-2 rounded-full border border-orange-400 shadow-sm"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Flag size={26} className="text-orange-600" />
          </motion.div>
          <h1 className="text-xl font-bold text-orange-600">Go Ahead</h1>
        </motion.div>

        <div className="w-6" />
      </motion.div>

      {/* Intro Section */}
      <motion.div
        className="bg-white/90 rounded-xl shadow-md border border-orange-100 p-6 w-full max-w-md mb-4 backdrop-blur"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ y: -4, boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}
      >
        <motion.h2
          className="text-lg font-bold text-orange-600 text-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          ✨ Go! Ahead
        </motion.h2>

        <motion.p
          className="text-gray-700 text-sm leading-relaxed text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Welcome to our community — a space for people who want to create real
          change. Our platform brings together stories, ideas, and actions that
          inspire better living and a better society.
        </motion.p>

        <motion.div
          className="mt-4 text-gray-600 text-sm space-y-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.5 },
            },
          }}
        >
          {[
            "🌱 Join meaningful conversations",
            "📣 Share your voice & experiences",
            "🤝 Connect with others who care",
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: { opacity: 1, x: 0 },
              }}
            >
              <strong>{text}</strong>
            </motion.p>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-gray-700 mt-4 font-medium"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Go ahead — explore, participate, and be part of a movement that turns
          small steps into big impact. ✨
        </motion.p>
      </motion.div>
    </div>
  );
}
