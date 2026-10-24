import React from "react";
import { useApp } from "../context/AppContext";
import { X, Check } from "lucide-react";

export default function PaletteModal() {
  const { activePaletteModal, setActivePaletteModal, theme, setTheme, palettes } = useApp();

  if (!activePaletteModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Custom Color Palettes</h3>
            <p className="text-xs text-gray-500">Pick any palette matching your design reference</p>
          </div>
          <button
            onClick={() => setActivePaletteModal(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-5 max-h-[60vh] overflow-y-auto pr-1">
          {palettes.map((p) => {
            const isSelected = theme === p.themeAttr;
            return (
              <button
                key={p.id}
                onClick={() => setTheme(p.themeAttr)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] shadow-sm"
                    : "border-gray-200 hover:border-pink-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-800">{p.name}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">{p.description}</p>
                <div className="flex items-center gap-1.5">
                  {p.swatches.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setActivePaletteModal(false)}
            className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[var(--color-primary)] hover:opacity-95 shadow-md"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}
