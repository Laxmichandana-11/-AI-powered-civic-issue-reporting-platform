import { Link, useNavigate } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Community() {
  const navigate = useNavigate();

  const options = [
    { name: "Go! Ahead", path: "/community/go-ahead", active: true },
    { name: "Discussion Starter", path: "/community/discussion" },
    { name: "Shoutouts & Spotlight", path: "/community/spotlight", active: true },
    { name: "Report", path: "/community/report", active: true },
    { name: "Impact Story", path: "/community/story" },
    { name: "Q&A sessions", path: "/community/qa", active: true },
    { name: "Community Polls", path: "/community/polls", active: true },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-200 px-5 py-6 flex flex-col items-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-52 h-52 bg-orange-400 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Header */}
      <motion.div
        className="flex items-center justify-between w-full max-w-2xl mb-8 z-10"
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition"
        >
          <ArrowLeft size={22} className="mr-1" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <motion.div
            className="bg-orange-100 p-3 rounded-full border border-orange-400 shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Users size={26} className="text-orange-600" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-700 tracking-tight">
            Community
          </h1>
        </div>

        <div className="w-10" />
      </motion.div>

      {/* Options */}
      <motion.div
        className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl z-10 pb-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {options.map((opt, i) => {
          const isCenterPoll = opt.name === "Community Polls";

          return (
            <motion.div
              key={i}
              className={isCenterPoll ? "lg:col-start-2" : ""}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(255,140,0,0.3)",
              }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link
                to={opt.path}
                className={`block text-center py-3 sm:py-4 px-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                  opt.active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:brightness-110"
                    : "bg-white border border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                }`}
              >
                {opt.name}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Text */}
      <motion.p
        className="text-gray-500 text-sm mt-8 z-10 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Thanks for engaging with the community 💬
      </motion.p>
    </motion.div>
  );
}
