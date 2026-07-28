import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import Button from "./Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-800 text-white shadow">
      <div className="container flex justify-between items-center py-3">
        <Link to="/" className="text-xl font-bold">
          🚂 Indian Railways
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.loginName} ({user.role})
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                logout();
                navigate("/login");
              }}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
