import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Phone, Mail, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const navigate = useNavigate();

  const founder = {
    name: "Laxmi Chandana",
    role: "Founder & Developer",
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
    email: "chandanayanamandra2611@gmail.com",
    bio: "I created Civix to help people report local issues, participate in civic conversations, and make communities more responsive and connected.",
    story: "This project began with a simple idea: every citizen deserves a direct, easy way to raise concerns, track change, and contribute to a better neighborhood.",
  };

  const gmailComposeUrl = (email) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 flex flex-col items-center px-6 py-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating Glow Effects */}
      <motion.div
        className="absolute top-20 left-10 w-44 h-44 bg-indigo-300 rounded-full blur-3xl opacity-25"
        animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-400 rounded-full blur-3xl opacity-25"
        animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          <ArrowLeft size={22} className="mr-1" /> Back
        </button>

        <h2 className="text-3xl font-bold text-indigo-700 text-center flex-1">
          About Us
        </h2>

        <div className="w-6" />
      </div>

      {/* About Box */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center max-w-xl border border-indigo-100 relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mx-auto mb-4 bg-indigo-100 p-3 w-fit rounded-full shadow-md"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Heart size={28} className="text-indigo-600" />
        </motion.div>

        <p className="text-gray-700 leading-relaxed text-base">
          <strong className="text-indigo-700">Civix</strong> is a civic
          engagement platform that empowers citizens to voice their concerns,
          solve local issues, and make communities stronger. Together, we build
          transparent and connected neighborhoods where every voice matters. 🌍
        </p>
      </motion.div>

      {/* Founder Section */}
      <motion.div
        className="mt-16 max-w-3xl w-full relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-center text-3xl font-bold text-indigo-700 mb-8 flex items-center justify-center gap-2">
          <Users className="text-indigo-600" /> Project Creator
        </h3>

        <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100 text-center">
          <motion.img
            src={founder.img}
            alt={founder.name}
            className="w-24 h-24 mx-auto rounded-full border-3 border-indigo-200 shadow-md object-cover mb-4"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />

          <h4 className="text-2xl font-bold text-gray-800">{founder.name}</h4>
          <p className="text-indigo-700 font-semibold mt-1">{founder.role}</p>
          <p className="text-gray-600 leading-relaxed mt-4 max-w-xl mx-auto">{founder.bio}</p>
          <p className="text-gray-500 leading-relaxed mt-3 max-w-xl mx-auto italic">{founder.story}</p>

          <a
            href={gmailComposeUrl(founder.email)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm text-indigo-700 font-medium hover:underline"
          >
            <Mail size={14} className="text-indigo-600" />
            {founder.email}
          </a>
        </div>
      </motion.div>
      <motion.div
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mt-12 border border-indigo-100 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-indigo-700 font-bold mb-3 text-lg">Help & Support</h3>

        <div className="space-y-3 text-gray-700 text-sm text-center">
          <p className="flex items-center justify-center gap-2">
            <Phone size={16} className="text-indigo-500" /> +91 9505695287
          </p>

          <a
            href={gmailComposeUrl("Happytohelp@myonemile.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-600 hover:underline text-sm justify-center"
          >
            <Mail size={16} className="text-indigo-500" />
            Happytohelp@myonemile.com
          </a>
        </div>
      </motion.div>
      <motion.div
        className="w-full max-w-md mt-10 mb-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-semibold text-sm inline-block mb-3 shadow-sm">
          Terms & Conditions
        </h3>

        <div className="bg-white p-5 rounded-xl shadow-md text-gray-700 text-sm leading-relaxed border border-indigo-100">
          <ul className="list-disc list-inside space-y-1">
            <li>Registered identity should be legal & government approved.</li>
            <li>You own the content you post.</li>
            <li>Our mission is to help people who are facing problems.</li>
            <li>We don’t endorse or verify user-generated content.</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}


