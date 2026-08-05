import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CiviQ
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">

          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>

          <Link to="/report-issue" className="text-gray-700 hover:text-blue-600 transition">
            Report Issue
          </Link>

          <Link to="/issues" className="text-gray-700 hover:text-blue-600 transition">
            Issues
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link to="/my-reports" className="text-gray-700 hover:text-blue-600 transition">
                My Reports
              </Link>
              <Link to="/my-activity" className="text-gray-700 hover:text-blue-600 transition">
                My Activity
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                Profile
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">Admin</Link>
              )}

              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>

              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;