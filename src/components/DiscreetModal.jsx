import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Lock, Calculator, ArrowRight } from "lucide-react";

export default function DiscreetModal() {
  const { isDiscreetMode, setIsDiscreetMode, userProfile } = useApp();
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");

  if (!isDiscreetMode) return null;

  const handleNumClick = (val) => {
    setCalcDisplay(prev => (prev === "0" ? String(val) : prev + val));
  };

  const handleClear = () => {
    setCalcDisplay("0");
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput === (userProfile.discreetPin || "1234")) {
      setIsDiscreetMode(false);
      setPinInput("");
      setError(false);
    } else {
      setError(true);
      setPinInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1e24] text-white flex flex-col items-center justify-center p-4">
      {/* Disguised Header */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between border-b border-gray-700 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-400" />
          <span className="font-mono text-sm tracking-wide text-gray-300">Daily Calculator & Notes</span>
        </div>
        <span className="text-xs text-gray-500">v2.4.1</span>
      </div>

      {/* Calculator Disguise Container */}
      <div className="w-full max-w-sm bg-[#2b2b36] p-5 rounded-2xl shadow-xl border border-gray-700">
        <div className="bg-[#17171d] p-4 rounded-xl text-right font-mono text-3xl mb-4 text-emerald-400 overflow-x-auto min-h-[60px] flex items-center justify-end">
          {calcDisplay}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {["7", "8", "9", "/"].map((b) => (
            <button key={b} onClick={() => handleNumClick(b)} className="p-3 bg-gray-700 rounded-lg font-mono text-lg hover:bg-gray-600 active:scale-95 transition-transform">{b}</button>
          ))}
          {["4", "5", "6", "*"].map((b) => (
            <button key={b} onClick={() => handleNumClick(b)} className="p-3 bg-gray-700 rounded-lg font-mono text-lg hover:bg-gray-600 active:scale-95 transition-transform">{b}</button>
          ))}
          {["1", "2", "3", "-"].map((b) => (
            <button key={b} onClick={() => handleNumClick(b)} className="p-3 bg-gray-700 rounded-lg font-mono text-lg hover:bg-gray-600 active:scale-95 transition-transform">{b}</button>
          ))}
          {["C", "0", "=", "+"].map((b) => (
            <button
              key={b}
              onClick={b === "C" ? handleClear : () => handleNumClick(b)}
              className={`p-3 rounded-lg font-mono text-lg active:scale-95 transition-transform ${b === "C" ? "bg-rose-900 text-rose-200" : b === "=" ? "bg-emerald-600 text-white" : "bg-gray-700"}`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Discreet PIN Unlock Vault */}
        <div className="pt-4 border-t border-gray-700">
          <form onSubmit={handleUnlock} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-pink-400" /> Enter Vault PIN to restore SakhiAI:</span>
              <span className="text-[11px] text-gray-500 font-mono">(Default: 1234)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4-digit PIN"
                className="flex-1 bg-[#17171d] border border-gray-600 rounded-xl px-4 py-2.5 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                Unlock <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 text-center mt-1">Incorrect PIN. Try 1234</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
