import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { EMERGENCY_RED_FLAGS, EMERGENCY_HELPLINES } from "../data/healthKnowledge";
import { 
  getNearbyDoctorsForLocation, 
  getAddressFromCoords 
} from "../data/emergencyDoctorsCatalog";
import { 
  AlertTriangle, 
  Phone, 
  ShieldAlert, 
  X, 
  MapPin, 
  HeartPulse, 
  Hospital, 
  Navigation, 
  LocateFixed, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  ChevronDown 
} from "lucide-react";

export default function SOSModal() {
  const { isSOSOpen, setIsSOSOpen, userProfile, updateUserLocation, t } = useApp();

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState("");
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState("");

  if (!isSOSOpen) return null;

  const currentLocation = userProfile?.location || "Pune, Maharashtra";
  const nearbyData = getNearbyDoctorsForLocation(currentLocation);
  const doctorsList = nearbyData.doctors || [];

  // GPS Auto-detect handler (uses real reverse-geocoding for exact address)
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter your address manually.");
      return;
    }

    setIsDetectingGps(true);
    setGpsFeedback("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const resolvedAddress = await getAddressFromCoords(latitude, longitude);
          
          updateUserLocation(resolvedAddress);
          setGpsFeedback(`Current location detected: ${resolvedAddress}`);
          setTimeout(() => setGpsFeedback(""), 5000);
        } catch (err) {
          console.error("GPS detection error:", err);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn("GPS error:", error);
        alert("Location access was denied or timed out. Please enter your current address manually.");
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const handleCustomAddressSubmit = (e) => {
    e.preventDefault();
    if (customAddressInput.trim()) {
      updateUserLocation(customAddressInput.trim());
      setCustomAddressInput("");
      setIsChangingAddress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border-2 border-rose-300 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Urgent Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase">
                  {t("sos.badge", "Emergency Medical SOS")}
                </span>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {t("sos.immediate_action", "24/7 Clinical Triage")}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                {t("sos.header_title", "Immediate Clinical Support & Hospital Dispatch")}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsSOSOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Location Routing Bar */}
        <div className="my-3.5 p-3 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    {t("sos.location_label", "Active SOS Location:")}
                  </span>
                  <span className="text-[10px] font-black text-[var(--color-primary)] bg-white px-2 py-0.5 rounded-full border border-purple-100 shadow-2xs">
                    {nearbyData.matchedCity}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-900 truncate">
                  {currentLocation}
                </p>
              </div>
            </div>

            {/* Location Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={isDetectingGps}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-[var(--color-primary)] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                title="Detect exact address using GPS"
              >
                {isDetectingGps ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-primary)]" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                )}
                <span>{isDetectingGps ? "Detecting..." : "Use Current Location"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsChangingAddress(!isChangingAddress)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <span>Edit Address</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingAddress ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* GPS Auto-detect Feedback */}
          {gpsFeedback && (
            <div className="mt-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{gpsFeedback}</span>
            </div>
          )}

          {/* Address Edit Input */}
          {isChangingAddress && (
            <div className="mt-3 pt-3 border-t border-purple-200/60 animate-in fade-in duration-150 space-y-2">
              <p className="text-[11px] font-bold text-gray-700">Enter Your Current Address:</p>
              <form onSubmit={handleCustomAddressSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter current street, area, landmark, or city..."
                  value={customAddressInput}
                  onChange={(e) => setCustomAddressInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-95 cursor-pointer shrink-0"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Rapid Red-Flag Alert */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-3.5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 space-y-1">
              <p className="font-bold text-rose-900">{t("sos.red_flags_heading", "Critical Red-Flag Emergency Symptoms:")}</p>
              <p>• Heavy bleeding soaking 2+ pads/hr for 2 consecutive hours</p>
              <p>• Sudden severe unilateral lower pelvic pain with dizziness, syncope, or fever</p>
              <p>• Severe headache with blurred vision during pregnancy or postpartum</p>
              <p className="pt-0.5 text-[11px] text-rose-700 font-semibold">
                Do not wait for scheduled appointments; proceed to the nearest emergency facility below or dial 108/112.
              </p>
            </div>
          </div>
        </div>

        {/* DYNAMIC NEARBY EMERGENCY DOCTORS & HOSPITALS */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {t("sos.doctors_heading", "Nearby Verified Hospitals & Doctors")} ({nearbyData.matchedCity})
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              {doctorsList.length} Emergency Units
            </span>
          </div>

          <div className="space-y-2.5">
            {doctorsList.map((doc) => {
              const cleanPhone = (doc.phone || "").replace(/\s+/g, "");
              const cleanAltPhone = (doc.altPhone || "").replace(/\s+/g, "");
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.mapsQuery || `${doc.name} ${doc.address}`)}`;

              return (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl border border-gray-200 hover:border-rose-300 bg-white transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    
                    {/* Doctor / Hospital Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-xs sm:text-sm font-bold text-gray-900">
                          {doc.name}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          {doc.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 font-medium">
                        {doc.category}
                      </p>

                      <div className="flex items-start gap-1 text-[11px] text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="truncate">{doc.address}</span>
                      </div>

                      <p className="text-[11px] text-purple-900 font-medium bg-purple-50/60 px-2 py-1 rounded-lg border border-purple-100 inline-block">
                        🩺 <strong>Clinical Focus:</strong> {doc.specialty}
                      </p>
                    </div>

                    {/* Action Call & Navigation Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 pt-1 sm:pt-0">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex-1 sm:flex-none w-full px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
                        title={`Call ${doc.phone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {cleanPhone}</span>
                      </a>

                      {doc.altPhone && (
                        <a
                          href={`tel:${cleanAltPhone}`}
                          className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          title={`Secondary Line: ${doc.altPhone}`}
                        >
                          <Phone className="w-3 h-3 text-rose-600" />
                          <span>Alt: {doc.altPhone}</span>
                        </a>
                      )}

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 text-gray-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Get directions on Google Maps"
                      >
                        <Navigation className="w-3 h-3 text-rose-600" />
                        <span>{t("sos.directions_btn", "Directions")}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* 24/7 National Emergency Helplines */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {t("sos.helplines_heading", "24/7 Verified National Helplines (Toll-Free)")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EMERGENCY_HELPLINES.map((h, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded-xl border border-gray-200 hover:border-rose-300 transition-colors flex items-center justify-between bg-white"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{h.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{h.description}</p>
                </div>
                <a
                  href={`tel:${h.number}`}
                  className="ml-2 px-3 py-1.5 bg-gray-900 hover:bg-rose-600 text-white rounded-lg text-xs font-bold font-mono transition-colors shrink-0"
                >
                  {h.number}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
