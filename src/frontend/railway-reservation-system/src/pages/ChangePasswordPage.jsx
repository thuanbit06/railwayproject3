import React, { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

const ChangePasswordPage = () => {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [msg, setMsg] = useState("");
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await changePassword(oldPwd, newPwd);
    setMsg(res.message);
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Old Password"
          type="password"
          value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)}
        />
        <Input
          label="New Password"
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
        />
        <Button type="submit" className="w-full mt-4">
          Change
        </Button>
      </form>
      {msg && <p className="mt-4 text-green-600">{msg}</p>}
    </div>
  );
};

export default ChangePasswordPage;
