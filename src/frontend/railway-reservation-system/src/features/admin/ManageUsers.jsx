// src/features/admin/ManageUsers.js
import React, { useState } from "react";
import { users } from "../../data";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ManageUsers = () => {
  const [userList, setUserList] = useState([...users]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ loginName: "", role: "USER" });

  const handleEdit = (user) => {
    setEditingId(user.loginId);
    setForm({ loginName: user.loginName, role: user.role });
  };

  const handleSave = () => {
    const updated = userList.map((u) =>
      u.loginId === editingId ?
        { ...u, loginName: form.loginName, role: form.role }
      : u,
    );
    setUserList(updated);
    setEditingId(null);
    // Trong thực tế cần update mockData.users
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setUserList(userList.filter((u) => u.loginId !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Username
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.loginId} className="border-t">
                <td className="px-4 py-3">{user.loginId}</td>
                <td className="px-4 py-3">
                  {editingId === user.loginId ?
                    <Input
                      value={form.loginName}
                      onChange={(e) =>
                        setForm({ ...form, loginName: e.target.value })
                      }
                    />
                  : user.loginName}
                </td>
                <td className="px-4 py-3">
                  {editingId === user.loginId ?
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="px-2 py-1 border rounded">
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  : <span
                      className={`px-2 py-1 rounded text-xs ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {user.role}
                    </span>
                  }
                </td>
                <td className="px-4 py-3">
                  {editingId === user.loginId ?
                    <Button size="sm" variant="success" onClick={handleSave}>
                      Save
                    </Button>
                  : <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user.loginId)}>
                        Delete
                      </Button>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Note: Password management is handled via the Change Password feature.
      </p>
    </div>
  );
};

export default ManageUsers;
