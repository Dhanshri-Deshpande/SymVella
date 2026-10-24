import React from "react";
import { useApp } from "../context/AppContext";
import { EMERGENCY_RED_FLAGS, EMERGENCY_HELPLINES } from "../data/healthKnowledge";
import { AlertTriangle, Phone, ShieldAlert, X, MapPin, HeartPulse } from "lucide-react";

export default function SOSModal() {
  const { isSOSOpen, setIsSOSOpen, userProfile } = useApp();

  if (!isSOSOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-rose-300 animate-in fade-in zoom-in duration-200">
        
        {/* Urgent Header */}
        <div className="flex items-start justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold tracking-wider uppercase mb-1">
                Emergency Medical SOS
              </span>
              <h3 className="text-xl font-bold text-gray-900">Immediate Clinical Support</h3>
            </div>
          </div>
          <button
            onClick={() => setIsSOSOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rapid Red-Flag Alert */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 my-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 space-y-1">
              <p className="font-semibold text-rose-900">Critical Red-Flag Warning Signs:</p>
              <p>• Heavy bleeding soaking 2+ pads/hr for 2 consecutive hours</p>
              <p>• Sudden severe unilateral lower pelvic pain with dizziness or fever</p>
              <p>• Severe headache with blurred vision during pregnancy or postpartum</p>
              <p className="pt-1 text-[11px] text-rose-700 font-medium">Do not wait for an app check-in; seek physical emergency evaluation immediately.</p>
            </div>
          </div>
        </div>

        {/* Primary Contact Dial */}
        <div className="mb-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
              MD
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Registered Physician</p>
              <p className="text-sm font-bold text-gray-900">{userProfile.emergencyContact.name}</p>
              <p className="text-xs font-mono text-gray-600">{userProfile.emergencyContact.phone}</p>
            </div>
          </div>
          <a
            href={`tel:${userProfile.emergencyContact.phone}`}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" /> Call Doctor
          </a>
        </div>

        {/* 24/7 National Emergency Helplines */}
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">24/7 Verified Helplines (Toll-Free)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {EMERGENCY_HELPLINES.map((h, i) => (
            <div key={i} className="p-3 rounded-xl border border-gray-200 hover:border-rose-300 transition-colors flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-900">{h.name}</p>
                <p className="text-[11px] text-gray-500">{h.description}</p>
              </div>
              <a
                href={`tel:${h.number}`}
                className="ml-2 px-3 py-1.5 bg-gray-900 text-white hover:bg-rose-600 rounded-lg text-xs font-bold font-mono transition-colors"
              >
                {h.number}
              </a>
            </div>
          ))}
        </div>

        {/* Location Broadcast Simulator */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Emergency Location Sharing active: <strong>New Delhi, India (Approx 10m radius)</strong></span>
          </div>
          <button
            onClick={() => alert("Simulated: SMS with Live GPS coordinates broadcasted to Dr. Kavita Verma and trusted emergency contacts.")}
            className="text-xs font-semibold text-amber-900 underline whitespace-nowrap"
          >
            Send SOS SMS
          </button>
        </div>
      </div>
    </div>
  );
}
