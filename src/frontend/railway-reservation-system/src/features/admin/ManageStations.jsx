// src/features/admin/ManageStations.js
import React, { useState } from "react";
import { stations } from "../../data";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ManageStations = () => {
  const [stationList, setStationList] = useState([...stations]);
  const [form, setForm] = useState({ code: "", name: "", division: "" });
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    if (!form.code || !form.name) return;
    const newStation = {
      stationId: `ST${String(stationList.length + 1).padStart(3, "0")}`,
      ...form,
    };
    setStationList([...stationList, newStation]);
    setForm({ code: "", name: "", division: "" });
  };

  const handleEdit = (station) => {
    setEditingId(station.stationId);
    setForm({
      code: station.code,
      name: station.name,
      division: station.division,
    });
  };

  const handleSave = () => {
    const updated = stationList.map((s) =>
      s.stationId === editingId ? { ...s, ...form } : s,
    );
    setStationList(updated);
    setEditingId(null);
    setForm({ code: "", name: "", division: "" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Stations</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">Add / Edit Station</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Station Code (e.g., NDLS)"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />
          <Input
            placeholder="Station Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Division"
            value={form.division}
            onChange={(e) => setForm({ ...form, division: e.target.value })}
          />
          <Button
            variant={editingId ? "success" : "primary"}
            onClick={editingId ? handleSave : handleAdd}>
            {editingId ? "Update" : "Add"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Code
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Division
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stationList.map((station) => (
              <tr key={station.stationId} className="border-t">
                <td className="px-4 py-3 font-mono">{station.code}</td>
                <td className="px-4 py-3">{station.name}</td>
                <td className="px-4 py-3">{station.division}</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(station)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStations;
