import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import AuthContext from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", formData);

    localStorage.setItem("token", response.data.token);

    // update auth context immediately
    try {
      const { fetchProfile } = authContext;
      if (fetchProfile) await fetchProfile();
    } catch (e) {}

    alert(response.data.message);

    navigate("/dashboard");
 } catch (error) {
  console.log(error);
  console.log(error.response);

  alert(
    error.response?.data?.message ||
    error.message ||
    "Login Failed"
  );
}
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;