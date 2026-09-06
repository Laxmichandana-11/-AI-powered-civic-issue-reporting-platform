import { useState } from "react";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function QA() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "About us",
      answer:
        "We are solving problems related to different areas, filling the gaps between the common and elites. Here one becomes the head of an area and tries to make it the best possible.",
    },
    {
      question: "Privacy Policies",
      answer:
        "We ensure your data remains private and secure. User details are not shared without consent and only used to improve your experience.",
    },
    {
      question: "Community Rules",
      answer:
        "Be respectful, avoid hate speech, and engage positively. We aim to build a safe and constructive civic space.",
    },
    {
      question: "Upgrade Plans",
      answer:
        "Access premium civic insights, analytics, and priority engagement with local leaders by upgrading your plan.",
    },
    {
      question: "Password Help",
      answer:
        "If you forgot your password, use the reset link on the login page. You’ll receive a secure reset link via email.",
    },
    {
      question: "Account Help",
      answer:
        "Need help with your account? Contact support via the help center or email us directly.",
    },
  ];

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 p-5 flex flex-col items-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <Link to="/community" className="text-gray-600 hover:text-orange-500">
          <ArrowLeft size={24} />
        </Link>

        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-full border border-orange-400">
            <HelpCircle size={26} className="text-orange-600" />
          </div>
          <h1 className="text-xl font-bold text-orange-600">Q&A Sessions</h1>
        </div>

        <div className="w-6" />
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Ask Anything"
          className="w-full border border-orange-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center bg-orange-200 px-4 py-2 rounded-md text-left font-semibold text-gray-800 focus:outline-none"
              >
                {faq.question}
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-orange-300 text-black p-4 mt-1 rounded-md text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">
        Thanks for interacting 💬
      </p>
    </motion.div>
  );
}