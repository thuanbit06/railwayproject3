import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

const FareRules = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      class: "AC First (1A)",
      distance: "1-500 km",
      base: 50,
      perKm: 0.25,
      tax: 5,
    },
    {
      id: 2,
      class: "AC Second (2A)",
      distance: "1-500 km",
      base: 35,
      perKm: 0.18,
      tax: 5,
    },
    {
      id: 3,
      class: "Sleeper (SL)",
      distance: "1-500 km",
      base: 15,
      perKm: 0.08,
      tax: 2.5,
    },
    {
      id: 4,
      class: "AC First (1A)",
      distance: "501-1000 km",
      base: 80,
      perKm: 0.22,
      tax: 5,
    },
    {
      id: 5,
      class: "AC Second (2A)",
      distance: "501-1000 km",
      base: 55,
      perKm: 0.15,
      tax: 5,
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    class: "",
    distance: "",
    base: "",
    perKm: "",
    tax: "",
  });

  /* =======================
     HANDLERS
  ======================== */
  const startEdit = (rule) => {
    setEditingId(rule.id);
    setForm(rule);
    setShowAdd(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ class: "", distance: "", base: "", perKm: "", tax: "" });
  };

  const saveEdit = () => {
    setRules(rules.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    cancelEdit();
  };

  const deleteRule = (id) => {
    if (window.confirm("Delete this fare rule?")) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      class: form.class,
      distance: form.distance,
      base: Number(form.base),
      perKm: Number(form.perKm),
      tax: Number(form.tax),
    };
    setRules([...rules, newRule]);
    setShowAdd(false);
    setForm({ class: "", distance: "", base: "", perKm: "", tax: "" });
  };

  /* =======================
     UI
  ======================== */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fare Rules"
        subtitle="Configure ticket pricing rules by class and distance."
        actions={[
          {
            label: showAdd ? "Close" : "Add Rule",
            icon: showAdd ? <X size={16} /> : <Plus size={16} />,
            primary: !showAdd,
            onClick: () => {
              setShowAdd(!showAdd);
              setEditingId(null);
              setForm({
                class: "",
                distance: "",
                base: "",
                perKm: "",
                tax: "",
              });
            },
          },
        ]}
      />

      {/* ADD / EDIT FORM */}
      {(showAdd || editingId) && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Class"
              value={form.class}
              onChange={(v) => setForm({ ...form, class: v })}
            />
            <Input
              placeholder="Distance"
              value={form.distance}
              onChange={(v) => setForm({ ...form, distance: v })}
            />
            <Input
              type="number"
              placeholder="Base Fare ($)"
              value={form.base}
              onChange={(v) => setForm({ ...form, base: v })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Per KM ($)"
              value={form.perKm}
              onChange={(v) => setForm({ ...form, perKm: v })}
            />
            <Input
              type="number"
              step="0.1"
              placeholder="Tax (%)"
              value={form.tax}
              onChange={(v) => setForm({ ...form, tax: v })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
              Cancel
            </button>
            <button
              onClick={editingId ? saveEdit : addRule}
              className="px-4 py-2 rounded-xl bg-[#003A8C] hover:bg-[#1677FF] text-white text-sm font-semibold flex items-center gap-2">
              <Check size={14} /> {editingId ? "Save Changes" : "Add Rule"}
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[#f4f7ff] text-[10px] uppercase text-gray-500">
              <tr>
                <th className="p-4">Class</th>
                <th className="p-4">Distance</th>
                <th className="p-4">Base Fare</th>
                <th className="p-4">Per KM</th>
                <th className="p-4">Tax</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{r.class}</td>
                  <td className="p-4 text-xs">{r.distance}</td>
                  <td className="p-4 text-xs font-bold">${r.base}</td>
                  <td className="p-4 text-xs">${r.perKm}</td>
                  <td className="p-4 text-xs">{r.tax}%</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => startEdit(r)}
                      className="text-blue-500 hover:text-blue-700 mr-3">
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteRule(r.id)}
                      className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =======================
    REUSABLE INPUT
======================== */
const Input = ({ value, onChange, placeholder, type = "text", step }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    step={step}
    className="w-full px-3 py-2 bg-[#f4f7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#1677FF] text-sm"
  />
);

export default FareRules;
