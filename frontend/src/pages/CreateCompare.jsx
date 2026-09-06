// src/pages/CreateCompare.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const predefinedCategories = [
  "Cleanliness", "Traffic", "Safety", "Infrastructure", "Public Transport",
  "Air Quality", "Water Supply", "Waste Management", "Street Lighting",
  "Healthcare", "Education", "Noise Level"
];

export default function CreateCompare() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");

  const [categories, setCategories] = useState([]);
  const [catInput, setCatInput] = useState("");
  const [catFocus, setCatFocus] = useState(false);

  // CATEGORY SUGGESTIONS LOGIC
  const filteredCatSuggestions = useMemo(() => {
    if (!catInput) return predefinedCategories;
    return predefinedCategories.filter((c) =>
      c.toLowerCase().includes(catInput.toLowerCase())
    );
  }, [catInput]);

  const addCategory = (value) => {
    const val = (value || catInput).trim();
    if (!val || categories.includes(val)) return;
    setCategories([...categories, val]);
    setCatInput("");
  };

  const removeCategory = (i) => {
    setCategories(categories.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !area1 || !area2 || categories.length === 0) {
      alert("Please fill all fields & add at least 1 category.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:4000/api/compare/add",
        { title, area1, area2, categories },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/compare");
    } catch (err) {
      console.error("Create Compare Error:", err);
      alert("Could not create comparison");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex flex-col items-center"
    >
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-700 px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back
          </motion.button>

          <h1 className="text-3xl font-extrabold text-green-800 tracking-tight">
            Create Comparison
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TITLE */}
            <div>
              <label className="text-green-800 font-semibold mb-1 block">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Eg: sec 24 vs sec 29"
                className="w-full rounded-xl border border-green-100 p-3 focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* AREAS — SIMPLE INPUTS */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-green-800 font-semibold mb-1 block">
                  Area 1
                </label>
                <input
                  value={area1}
                  onChange={(e) => setArea1(e.target.value)}
                  placeholder="Type Area 1"
                  className="w-full rounded-xl border border-green-100 p-3 focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="text-green-800 font-semibold mb-1 block">
                  Area 2
                </label>
                <input
                  value={area2}
                  onChange={(e) => setArea2(e.target.value)}
                  placeholder="Type Area 2"
                  className="w-full rounded-xl border border-green-100 p-3 focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>

            {/* CATEGORY SECTION */}
            <div>
              <label className="text-green-800 font-semibold block mb-2">
                Categories
              </label>

              {/* CATEGORY PILLS */}
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No categories added yet
                  </p>
                )}

                {categories.map((cat, i) => (
                  <motion.div
                    key={cat + i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-3 py-1 bg-white border border-green-200 rounded-full shadow-sm flex items-center gap-2"
                  >
                    <span className="text-green-800 text-sm">{cat}</span>
                    <button
                      onClick={() => removeCategory(i)}
                      type="button"
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* CATEGORY INPUT W/ SUGGESTIONS */}
              <div className="relative">
                <input
                  value={catInput}
                  onChange={(e) => setCatInput(e.target.value)}
                  onFocus={() => setCatFocus(true)}
                  onBlur={() => setTimeout(() => setCatFocus(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Type category and press Enter..."
                  className="w-full rounded-xl border border-green-100 p-3 focus:ring-2 focus:ring-green-300"
                />

                {/* DROPDOWN SUGGESTIONS */}
                {catFocus && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute w-full bg-white border border-green-100 rounded-xl shadow-md mt-2 max-h-48 overflow-auto z-20"
                  >
                    {filteredCatSuggestions.map((c, i) => (
                      <div
                        key={i}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addCategory(c);
                        }}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm text-green-900"
                      >
                        {c}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setArea1("");
                  setArea2("");
                  setCategories([]);
                  setCatInput("");
                }}
                className="px-5 py-2 border border-green-200 rounded-xl bg-white hover:bg-gray-50 text-green-700"
              >
                Reset
              </button>

              <button
                type="submit"
                className={`px-6 py-2 text-white rounded-xl font-semibold shadow ${
                  title && area1 && area2 && categories.length > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-300 cursor-not-allowed"
                }`}
              >
                Create Comparison
              </button>
            </div>

          </form>
        </div>
      </div>
    </motion.div>
  );
}
