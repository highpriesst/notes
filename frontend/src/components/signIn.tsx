import * as React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        document.cookie = `sessionId=${token}; path=/`;
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response); // Extract error message
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 rounded-lg shadow-lg overflow-hidden p-10">
      <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
            Sign In
          </button>
        </div>
      </form>

      <div className="text-sm text-gray-600 mt-2 flex items-center justify-center mt-5">
        If you don't have an account,{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          go here
        </a>
      </div>
    </div>
  );
}
