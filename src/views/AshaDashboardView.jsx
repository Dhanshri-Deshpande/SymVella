import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Search, 
  FileCheck,
  Send
} from "lucide-react";

export default function AshaDashboardView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: "ASHA-01",
      name: "Pooja Patil",
      age: 26,
      village: "Rampur Sub-Centre",
      status: "PCOS Tendency Flagged",
      urgency: "Medium",
      lastCheckIn: "Today (Oct 24)",
      stage: "Reproductive / Irregular Cycles",
      notes: "±11 days cycle variance. Scheduled for Day-3 hormone test at PHC."
    },
    {
      id: "ASHA-02",
      name: "Sunita Devi",
      age: 23,
      village: "Rampur Sub-Centre",
      status: "Pregnancy Week 24",
      urgency: "Normal",
      lastCheckIn: "Yesterday",
      stage: "Second Trimester",
      notes: "Iron & Folic Acid tablets distributed. Fetal movements normal."
    },
    {
      id: "ASHA-03",
      name: "Lakshmi Rao",
      age: 31,
      village: "Shivpur Hamlet",
      status: "Severe Pelvic Pain Alert",
      urgency: "High Alert",
      lastCheckIn: "2 hours ago",
      stage: "Suspected Endometriosis",
      notes: "VAS Pain 8/10 reported with nausea. ASHA alerted for urgent PHC referral."
    },
    {
      id: "ASHA-04",
      name: "Meena Kumari",
      age: 28,
      village: "Rampur Sub-Centre",
      status: "Postpartum Day 18",
      urgency: "Normal",
      lastCheckIn: "Oct 22",
      stage: "Postpartum Care",
      notes: "Lochia flow normal. PHQ-2 mental wellness score 1/6 (Low risk)."
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newStage, setNewStage] = useState("Reproductive");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newEntry = {
      id: `ASHA-0${beneficiaries.length + 1}`,
      name: newName,
      age: Number(newAge) || 24,
      village: "Rampur Sub-Centre",
      status: "Newly Enrolled",
      urgency: "Normal",
      lastCheckIn: "Pending Initial Check-in",
      stage: newStage,
      notes: "Enrolled via ASHA tablet portal."
    };
    setBeneficiaries([newEntry, ...beneficiaries]);
    setNewName("");
    setNewAge("");
    setShowAddModal(false);
  };

  const filtered = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">ASHA / ANM Field Worker Portal</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Rural Outreach Mode
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Community Health Worker field dashboard for assisted enrolments & high-risk alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" /> Enrol New Woman
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-[11px] text-gray-500 block">Total Beneficiaries</span>
            <span className="text-xl font-black text-gray-900 font-mono">{beneficiaries.length}</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
            <span className="text-[11px] text-rose-700 block">High Risk Flags</span>
            <span className="text-xl font-black text-rose-700 font-mono">1</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-[11px] text-blue-700 block">Active Pregnancies</span>
            <span className="text-xl font-black text-blue-700 font-mono">1</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[11px] text-emerald-700 block">Offline Cache Sync</span>
            <span className="text-xs font-bold text-emerald-700 block mt-1">100% Up to Date</span>
          </div>
        </div>
      </div>

      {/* Beneficiary List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Assigned Community Members
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, hamlet or flag..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.urgency === "High Alert"
                  ? "bg-rose-50/60 border-rose-300 shadow-xs"
                  : b.urgency === "Medium"
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{b.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">({b.id})</span>
                    </div>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" /> {b.village} • {b.age} yrs • {b.stage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    b.urgency === "High Alert"
                      ? "bg-rose-600 text-white"
                      : b.urgency === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-700 bg-white/80 p-2.5 rounded-xl border border-black/5 mt-2">
                <strong>Field Log:</strong> {b.notes}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span>Last Logged: {b.lastCheckIn}</span>
                <button
                  onClick={() => alert(`Assisting ${b.name} with audio symptom check-in.`)}
                  className="font-bold text-amber-800 hover:underline"
                >
                  Assist Check-in →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Enrol New Beneficiary</h3>
            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Radhika Verma"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="24"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Life Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Adolescent">Adolescent</option>
                  <option value="Reproductive">Reproductive Age</option>
                  <option value="Pregnancy">Pregnancy</option>
                  <option value="Postpartum">Postpartum</option>
                  <option value="Perimenopause">Perimenopause</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save & Enrol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
