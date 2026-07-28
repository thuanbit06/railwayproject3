import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.success) navigate("/search");
    else setError(res.message);
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6">Railway Reservation</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="text-xs mt-4 text-gray-500">
        admin/Default@123 or user1/Default@123
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
