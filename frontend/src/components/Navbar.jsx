import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  BarChart3,
  Users,
  Info,
  LogOut,
  Settings,
  User as UserIcon,
  Home,
  ShieldCheck,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/civix-icon.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (user) setDropdownOpen(!dropdownOpen);
    else navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };
  const getAvatar = () => {
    if (user?.avatar) return user.avatar;
    const gender = user?.gender?.toLowerCase();
    switch (gender) {
      case "male":
        return "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
      case "female":
        return "https://cdn-icons-png.flaticon.com/512/4140/4140061.png";
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-50">
      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between px-6 py-3 relative">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center hover:rotate-12 transition-transform duration-300">
            <img
              src={logo}
              alt="logo"
              className="w-7 h-7 object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>
          <Link
            to="/"
            className="text-xl font-extrabold text-emerald-700 tracking-wide hover:text-emerald-800 transition"
          >
            Civix
          </Link>
        </div>

        {/* Profile Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {getAvatar() ? (
            <img
              src={getAvatar()}
              alt="user"
              onClick={handleProfileClick}
              title={user ? `${user.name}` : "Login"}
              className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover cursor-pointer hover:scale-110 hover:ring-2 hover:ring-purple-300 transition-all duration-300 shadow-sm"
            />
          ) : (
            <div
              onClick={handleProfileClick}
              title={user ? `${user.name}` : "Login"}
              className="w-10 h-10 rounded-full border-2 border-purple-300 bg-purple-100 text-purple-700 flex items-center justify-center cursor-pointer hover:scale-110 hover:ring-2 hover:ring-purple-300 transition-all duration-300 shadow-sm"
            >
              <UserIcon size={20} />
            </div>
          )}

          {/* --- Animated Dropdown with Frosted Effect --- */}
          <AnimatePresence>
            {dropdownOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-48 rounded-2xl shadow-xl border border-purple-100 bg-white/70 backdrop-blur-lg ring-1 ring-purple-100 overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-purple-100/40 transition"
                >
                  <UserIcon size={18} className="mr-2 text-purple-600" />
                  Profile
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-purple-100/40 transition"
                  >
                    <ShieldCheck size={18} className="mr-2 text-emerald-600" />
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => toast("Settings coming soon!")}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-purple-100/40 transition"
                >
                  <Settings size={18} className="mr-2 text-purple-600" />
                  Settings
                </button>
                <hr className="my-1 border-purple-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100/40 transition"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Category Icons Row --- */}
      <div className="grid grid-cols-5 bg-white py-3 border-t border-purple-100">
        <NavIcon
          icon={<Home size={22} />}
          color="purple"
          label="Home"
          to="/"
          active={location.pathname === "/"}
        />
        <NavIcon
          icon={<ClipboardList size={22} />}
          color="blue"
          label="Post"
          to="/report"
          active={location.pathname === "/report"}
        />
        <NavIcon
          icon={<BarChart3 size={22} />}
          color="green"
          label="Compare"
          to="/compare"
          active={location.pathname === "/compare"}
        />
        <NavIcon
          icon={<Users size={22} />}
          color="orange"
          label="Community"
          to="/community"
          active={location.pathname === "/community"}
        />
        <NavIcon
          icon={<Info size={22} />}
          color="indigo"
          label="About"
          to="/about"
          active={location.pathname === "/about"}
        />
      </div>
    </header>
  );
}

/* --- Reusable Nav Icon --- */
function NavIcon({ icon, color, label, to, active }) {
  const colorMap = {
    purple: {
      base: "border-purple-400 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:shadow-md hover:shadow-purple-200",
      active: "bg-purple-600 text-white shadow-md shadow-purple-200",
    },
    blue: {
      base: "border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-200",
      active: "bg-blue-600 text-white shadow-md shadow-blue-200",
    },
    green: {
      base: "border-green-400 bg-green-50 text-green-600 hover:bg-green-100 hover:shadow-md hover:shadow-green-200",
      active: "bg-green-600 text-white shadow-md shadow-green-200",
    },
    orange: {
      base: "border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:shadow-md hover:shadow-orange-200",
      active: "bg-orange-600 text-white shadow-md shadow-orange-200",
    },
    indigo: {
      base: "border-indigo-400 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-200",
      active: "bg-indigo-600 text-white shadow-md shadow-indigo-200",
    },
  };

  return (
    <Link to={to}>
      <div className="flex flex-col items-center space-y-1 transition-all duration-300">
        <div
          className={`p-3 border-2 rounded-full transition-all duration-300 ${
            active ? colorMap[color].active : colorMap[color].base
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-semibold ${
            active ? `text-${color}-700` : "text-gray-700"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}
