import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    birth: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        form
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-200 px-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-700 hover:text-purple-700"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl border border-purple-200">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
          />

          {/* Full Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
          />

          {/* Email */}
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
            className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-3 text-gray-500 hover:text-purple-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Phone */}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
          />

          {/* DOB */}
          <div>
            <label className="text-gray-600 text-sm">Date of Birth</label>
            <input
              name="birth"
              value={form.birth}
              onChange={handleChange}
              type="date"
              className="w-full px-4 py-3 mt-1 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-gray-600 text-sm">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border rounded-xl bg-white focus:ring-2 focus:ring-purple-400 outline-none text-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-700 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
