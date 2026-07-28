// src/features/admin/ManageTrains.js
import React, { useState } from "react";
import { trains } from "../../data";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

const ManageTrains = () => {
  const [trainList, setTrainList] = useState([...trains]);
  const [form, setForm] = useState({
    trainNo: "",
    trainName: "",
    upDownStatus: "UP",
    AC1: 0,
    AC2: 0,
    AC3: 0,
    Sleeper: 0,
    General: 0,
    scheduleDays: [],
  });
  const [editingNo, setEditingNo] = useState(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleToggleDay = (day) => {
    const current = form.scheduleDays;
    if (current.includes(day)) {
      setForm({ ...form, scheduleDays: current.filter((d) => d !== day) });
    } else {
      setForm({ ...form, scheduleDays: [...current, day] });
    }
  };

  const handleAdd = () => {
    if (!form.trainNo || !form.trainName) return;
    const newTrain = {
      trainNo: form.trainNo,
      trainName: form.trainName,
      upDownStatus: form.upDownStatus,
      routeId: `RT${form.trainNo}`,
      coaches: {
        AC1: parseInt(form.AC1),
        AC2: parseInt(form.AC2),
        AC3: parseInt(form.AC3),
        Sleeper: parseInt(form.Sleeper),
        General: parseInt(form.General),
      },
      scheduleDays: form.scheduleDays,
      schedule: [
        { stationCode: "NDLS", arrival: "-", departure: "00:00", distance: 0 },
      ],
    };
    setTrainList([...trainList, newTrain]);
    resetForm();
  };

  const handleEdit = (train) => {
    setEditingNo(train.trainNo);
    setForm({
      trainNo: train.trainNo,
      trainName: train.trainName,
      upDownStatus: train.upDownStatus,
      AC1: train.coaches.AC1,
      AC2: train.coaches.AC2,
      AC3: train.coaches.AC3,
      Sleeper: train.coaches.Sleeper,
      General: train.coaches.General,
      scheduleDays: train.scheduleDays,
    });
  };

  const handleSave = () => {
    const updated = trainList.map((t) =>
      t.trainNo === editingNo ?
        {
          ...t,
          trainName: form.trainName,
          upDownStatus: form.upDownStatus,
          coaches: {
            AC1: parseInt(form.AC1),
            AC2: parseInt(form.AC2),
            AC3: parseInt(form.AC3),
            Sleeper: parseInt(form.Sleeper),
            General: parseInt(form.General),
          },
          scheduleDays: form.scheduleDays,
        }
      : t,
    );
    setTrainList(updated);
    resetForm();
  };

  const resetForm = () => {
    setEditingNo(null);
    setForm({
      trainNo: "",
      trainName: "",
      upDownStatus: "UP",
      AC1: 0,
      AC2: 0,
      AC3: 0,
      Sleeper: 0,
      General: 0,
      scheduleDays: [],
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Trains</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">
          {editingNo ? "Edit Train" : "Add New Train"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          <Input
            placeholder="Train No"
            value={form.trainNo}
            onChange={(e) => setForm({ ...form, trainNo: e.target.value })}
            disabled={!!editingNo}
          />
          <Input
            placeholder="Train Name"
            value={form.trainName}
            onChange={(e) => setForm({ ...form, trainName: e.target.value })}
            className="md:col-span-2"
          />
          <Select
            label="Direction"
            options={[
              { value: "UP", label: "UP" },
              { value: "DOWN", label: "DOWN" },
            ]}
            value={form.upDownStatus}
            onChange={(e) => setForm({ ...form, upDownStatus: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-5 gap-3 mb-3">
          <Input
            placeholder="AC1 Coaches"
            type="number"
            value={form.AC1}
            onChange={(e) => setForm({ ...form, AC1: e.target.value })}
          />
          <Input
            placeholder="AC2 Coaches"
            type="number"
            value={form.AC2}
            onChange={(e) => setForm({ ...form, AC2: e.target.value })}
          />
          <Input
            placeholder="AC3 Coaches"
            type="number"
            value={form.AC3}
            onChange={(e) => setForm({ ...form, AC3: e.target.value })}
          />
          <Input
            placeholder="Sleeper Coaches"
            type="number"
            value={form.Sleeper}
            onChange={(e) => setForm({ ...form, Sleeper: e.target.value })}
          />
          <Input
            placeholder="General Coaches"
            type="number"
            value={form.General}
            onChange={(e) => setForm({ ...form, General: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Running Days</p>
          <div className="flex gap-2 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleToggleDay(day)}
                className={`px-3 py-1 rounded text-sm ${form.scheduleDays.includes(day) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={editingNo ? "success" : "primary"}
            onClick={editingNo ? handleSave : handleAdd}>
            {editingNo ? "Update Train" : "Add Train"}
          </Button>
          {editingNo && (
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Train No
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Coaches
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Days
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {trainList.map((train) => (
              <tr key={train.trainNo} className="border-t">
                <td className="px-4 py-3 font-mono">{train.trainNo}</td>
                <td className="px-4 py-3">{train.trainName}</td>
                <td className="px-4 py-3 text-sm">
                  AC1:{train.coaches.AC1} AC2:{train.coaches.AC2} AC3:
                  {train.coaches.AC3} SL:{train.coaches.Sleeper} GN:
                  {train.coaches.General}
                </td>
                <td className="px-4 py-3 text-xs">
                  {train.scheduleDays.join(", ")}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(train)}>
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

export default ManageTrains;
