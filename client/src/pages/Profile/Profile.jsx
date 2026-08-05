import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-2"><strong>Name:</strong> {user.fullName}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-6"><strong>Role:</strong> {user.role}</p>

        <button
          onClick={() => logout()}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
