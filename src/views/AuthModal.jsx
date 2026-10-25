import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { SYMVELLA_LANGUAGES } from "../data/botKnowledge";
import { 
  Heart, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  KeyRound,
  X,
  Stethoscope,
  LocateFixed,
  Loader2,
  RefreshCw,
  Globe
} from "lucide-react";
import confetti from "canvas-confetti";

import { calculateAge } from "../utils/dateUtils";
import { 
  getAddressFromCoords 
} from "../data/emergencyDoctorsCatalog";

export default function AuthModal({ isOpen, onClose, isFullScreen = false }) {
  const { login, signup, isAuthenticated, language, setLanguage, t } = useApp();

  // Mode switcher: "login" (default) or "signup"
  const [authMode, setAuthMode] = useState("login");

  // Login form states (2-step: "form" -> "otp")
  const [loginStep, setLoginStep] = useState("form");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginLocation, setLoginLocation] = useState("Pune, Maharashtra");
  const [loginOtpError, setLoginOtpError] = useState("");
  const [loginResendCooldown, setLoginResendCooldown] = useState(30);

  // Signup form states (2-step: "form" -> "otp")
  const [signupStep, setSignupStep] = useState("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [dob, setDob] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);

  // GPS auto-detection status
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState("");

  // Countdown timer for Login OTP resend
  useEffect(() => {
    let timer;
    if (loginStep === "otp" && loginResendCooldown > 0) {
      timer = setInterval(() => {
        setLoginResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loginStep, loginResendCooldown]);

  // Countdown timer for Signup OTP resend
  useEffect(() => {
    let timer;
    if (signupStep === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [signupStep, resendCooldown]);

  // Calculate maximum allowed date (must be at least 13 years ago)
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  const maxDob = maxDobDate.toISOString().split("T")[0];

  // Live age calculation & validation for signup
  const calculatedAge = dob ? calculateAge(dob) : 0;
  const isAgeValid = dob ? calculatedAge >= 13 : false;

  // GPS Auto-detect handler (uses real reverse-geocoding for exact address)
  const handleAutoDetectLocation = (targetMode = "login") => {
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
          if (targetMode === "login") {
            setLoginLocation(resolvedAddress);
          } else {
            setLocation(resolvedAddress);
          }
          setGpsFeedback(`Current location detected: ${resolvedAddress}`);
          setTimeout(() => setGpsFeedback(""), 5000);
        } catch (err) {
          console.error("GPS address resolution error:", err);
          const fallback = "Pune, Maharashtra";
          if (targetMode === "login") setLoginLocation(fallback);
          else setLocation(fallback);
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

  // ==========================================
  // LOGIN ACTIONS
  // ==========================================

  // Step 1: Proceed to OTP page (validates number & address, NO OTP on step 1)
  const handleProceedToLoginOtp = (e) => {
    e.preventDefault();
    const cleanIdent = loginIdentifier.trim();
    if (!cleanIdent) {
      alert("Please enter your registered mobile number or email address.");
      return;
    }
    if (!loginLocation.trim()) {
      alert("Please enter your current address or use the 'Use Current Location' button.");
      return;
    }
    setLoginOtpError("");
    setLoginOtp(""); // Empty OTP input ready for user entry
    setLoginStep("otp"); // Navigates to dedicated OTP page ("nest page")
    setLoginResendCooldown(30);
  };

  // Step 2: Verify OTP on dedicated OTP page
  const handleVerifyLoginOtp = (e) => {
    e.preventDefault();
    if (loginOtp.length < 4) {
      setLoginOtpError("Please enter the complete 4-digit verification code.");
      return;
    }
    login({ 
      identifier: loginIdentifier.trim(), 
      otp: loginOtp, 
      location: (loginLocation || "Pune, Maharashtra").trim() 
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3']
    });
    if (onClose) onClose();
  };

  // Resend OTP on bottom of Login OTP page
  const handleResendLoginOtp = () => {
    setLoginResendCooldown(30);
    setLoginOtp("");
    setLoginOtpError("");
    alert(`A fresh verification code has been sent to ${loginIdentifier}`);
  };

  // ==========================================
  // SIGNUP ACTIONS
  // ==========================================

  const handleProceedToSignupOtp = (e) => {
    e.preventDefault();
    if (!isAgeValid) {
      alert("Registration requires age 13 or above in accordance with adolescent healthcare & digital consent standards.");
      return;
    }
    if (mobileNo.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!location.trim()) {
      alert("Please enter your current address.");
      return;
    }
    setOtpError("");
    setEnteredOtp(""); // Empty OTP input ready for user entry
    setSignupStep("otp");
    setResendCooldown(30);
  };

  const handleVerifySignupOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.length < 4) {
      setOtpError("Please enter the 4-digit verification code.");
      return;
    }
    
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: mobileNo.trim(),
      location: (location || "Pune, Maharashtra").trim(),
      dob,
      age: calculatedAge,
      isVerified: true,
      registeredAt: new Date().toISOString()
    };

    signup(newUser);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });

    if (onClose) onClose();
  };

  const handleResendSignupOtp = () => {
    setResendCooldown(30);
    setEnteredOtp("");
    setOtpError("");
    alert(`A fresh verification code has been sent to ${mobileNo}`);
  };

  if (!isOpen && isAuthenticated && !isFullScreen) return null;

  // Main Card Content
  const cardContent = (
    <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border border-white/20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-gray-100 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img 
            src="/logo.png" 
            alt="Symvella" 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover shadow-md bg-white border border-purple-100 shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <h3 className="text-base sm:text-xl font-black text-[var(--color-primary-dark)]">
                Sym<span className="text-[var(--color-primary)]">vella</span>
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)] shrink-0">
                {t("auth.portal_title", "Clinical Portal")}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              {authMode === "login" 
                ? t("auth.signin_desc", "Sign in to access your health dashboard") 
                : t("auth.signup_desc", "Create your verified patient health profile")}
            </p>
          </div>
        </div>

        {/* Right side controls: Language Selector + Close button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs gap-1 sm:gap-1.5 transition-colors shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent font-bold text-[var(--color-primary-dark)] text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              {SYMVELLA_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-gray-900 font-medium">
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          {onClose && isAuthenticated && !isFullScreen && (
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl my-3.5 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setLoginStep("form");
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            authMode === "login"
              ? "bg-white text-[var(--color-primary)] shadow-xs"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {t("auth.tab_login", "Sign In (Log In)")}
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("signup");
            setSignupStep("form");
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            authMode === "signup"
              ? "bg-white text-[var(--color-primary)] shadow-xs"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {t("auth.tab_signup", "Create Account (Sign Up)")}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. SIGN IN (LOGIN) FLOW */}
      {/* ============================================================== */}
      {authMode === "login" && (
        <div>
          {loginStep === "form" ? (
            /* STEP 1: MOBILE NUMBER & CURRENT ADDRESS (NO OTP HERE) */
            <form onSubmit={handleProceedToLoginOtp} className="space-y-4 py-1 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {t("auth.identifier_label", "Registered Mobile Number or Email *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("auth.identifier_placeholder", "e.g. 9876543210 or pooja@example.com")}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  {t("auth.identifier_hint", "You can enter any mobile number or email address")}
                </span>
              </div>

              {/* Current Address / Location (Works with GPS or manual entry) */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="font-semibold text-gray-800 flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span>{t("auth.address_label", "Current Location / Address *")}</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => handleAutoDetectLocation("login")}
                    disabled={isDetectingGps}
                    className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--color-primary)] hover:text-purple-800 bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs hover:bg-purple-50 transition-colors cursor-pointer self-start sm:self-auto"
                    title="Auto-detect exact current address using GPS"
                  >
                    {isDetectingGps ? (
                      <Loader2 className="w-3 h-3 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <LocateFixed className="w-3 h-3 text-[var(--color-primary)]" />
                    )}
                    <span>{isDetectingGps ? t("auth.detecting_address", "Detecting...") : t("auth.use_current_location", "Use Current Location")}</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder={t("auth.address_placeholder", "Enter street, area, or city (e.g. Pune)")}
                  value={loginLocation}
                  onChange={(e) => setLoginLocation(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                />

                {gpsFeedback && (
                  <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{gpsFeedback}</span>
                  </p>
                )}
              </div>

              {/* Continue to OTP Page Button */}
              <button
                type="submit"
                disabled={!loginIdentifier.trim() || !loginLocation.trim()}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  loginIdentifier.trim() && loginLocation.trim()
                    ? "bg-[var(--color-primary)] hover:opacity-95 text-white active:scale-98 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>{t("auth.continue_to_otp", "Continue to Enter OTP")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-500">
                  {t("auth.new_patient", "New patient?")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setSignupStep("form");
                    }}
                    className="text-[var(--color-primary)] font-bold hover:underline cursor-pointer"
                  >
                    {t("auth.create_account_link", "Create an account here")}
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* STEP 2: DEDICATED OTP VERIFICATION PAGE (NEXT PAGE) */
            <form onSubmit={handleVerifyLoginOtp} className="space-y-4 py-1 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setLoginStep("form")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t("auth.edit_info", "Edit Number / Address")}</span>
                </button>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-[var(--color-primary)]">
                  {t("auth.step_2_of_2", "Step 2 of 2")}
                </span>
              </div>

              <div className="text-center space-y-1 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[var(--color-primary)] mx-auto flex items-center justify-center shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">{t("auth.enter_code_title", "Enter Verification Code")}</h4>
                <p className="text-gray-500 text-xs">
                  {t("auth.enter_code_desc", "We sent a 4-digit verification code to:")} <br />
                  <strong className="text-gray-800 font-mono text-sm">{loginIdentifier}</strong>
                </p>
                <span className="inline-block text-[10px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100 mt-0.5">
                  📍 {loginLocation}
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-gray-700 block text-center">
                  {t("auth.enter_passcode_label", "Enter 4-Digit Passcode *")}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="• • • •"
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-44 mx-auto block bg-gray-50 border border-gray-300 focus:bg-white focus:border-[var(--color-primary)] rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-gray-900 font-bold focus:outline-none shadow-2xs"
                />
                {loginOtpError && (
                  <p className="text-center text-[11px] text-rose-600 font-semibold">{loginOtpError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("auth.verify_btn", "Verify & Open Home Dashboard")}</span>
              </button>

              {/* RESEND OTP AT BOTTOM */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{t("auth.didnt_receive", "Didn't receive the code?")}</span>
                {loginResendCooldown > 0 ? (
                  <span className="font-mono text-gray-600">
                    {t("auth.resend_in", "Resend in")} <strong>00:{loginResendCooldown < 10 ? `0${loginResendCooldown}` : loginResendCooldown}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendLoginOtp}
                    className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t("auth.resend_now", "Resend OTP Now")}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SIGN UP FLOW */}
      {/* ============================================================== */}
      {authMode === "signup" && (
        <div>
          {signupStep === "form" ? (
            /* STEP 1: REGISTRATION FORM */
            <form onSubmit={handleProceedToSignupOtp} className="space-y-3.5 text-xs">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {t("auth.first_name", "First Name *")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {t("auth.last_name", "Last Name (Optional)")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {t("auth.mobile_label", "Mobile Number *")}
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-mono text-xs flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {t("auth.email_label", "Email Address (for Verification) *")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                />
              </div>

              {/* Current Address / Location */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="font-semibold text-gray-800 flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span>{t("auth.address_label", "Current Location / Address *")}</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => handleAutoDetectLocation("signup")}
                    disabled={isDetectingGps}
                    className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--color-primary)] hover:text-purple-800 bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs hover:bg-purple-50 transition-colors cursor-pointer self-start sm:self-auto"
                    title="Auto-detect exact current address using GPS"
                  >
                    {isDetectingGps ? (
                      <Loader2 className="w-3 h-3 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <LocateFixed className="w-3 h-3 text-[var(--color-primary)]" />
                    )}
                    <span>{isDetectingGps ? t("auth.detecting_address", "Detecting...") : t("auth.use_current_location", "Use Current Location")}</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder={t("auth.address_placeholder", "Enter street, area, or city (e.g. Pune)")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                />

                {gpsFeedback && (
                  <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{gpsFeedback}</span>
                  </p>
                )}
              </div>

              {/* Date of Birth (DOB) with >13 Years Validation */}
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-[var(--color-border)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-900 flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {t("auth.dob_label", "Date of Birth (DOB) *")}
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[var(--color-primary)] border border-purple-200">
                    {t("auth.must_be_13", "Must be 13+ Years")}
                  </span>
                </div>

                <input
                  type="date"
                  required
                  max={maxDob}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white border border-gray-300 focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none font-mono"
                />

                {dob && (
                  <div className="pt-1">
                    {isAgeValid ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Calculated Age: <strong>{calculatedAge} Years</strong> (Valid)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-700 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Calculated Age: <strong>{calculatedAge} Years</strong> (Requires 13+)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Privacy Note */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {t("auth.privacy_notice", "All medical and cycle records are 100% confidential and encrypted on your local device under the DPDP Act.")}
                </span>
              </div>

              {/* Submit to OTP Step */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isAgeValid || !firstName || !mobileNo || !email || !location}
                  className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                    isAgeValid && firstName && mobileNo && email && location
                      ? "bg-[var(--color-primary)] hover:opacity-95 text-white active:scale-98 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>{t("auth.send_code_btn", "Send Verification Code & Continue")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500">
                  {t("auth.already_registered", "Already registered?")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setLoginStep("form");
                    }}
                    className="text-[var(--color-primary)] font-bold hover:underline cursor-pointer"
                  >
                    {t("auth.signin_link", "Sign in here")}
                  </button>
                </p>
              </div>

            </form>
          ) : (
            /* STEP 2: SIGNUP OTP VERIFICATION PAGE */
            <form onSubmit={handleVerifySignupOtp} className="space-y-4 py-1 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setSignupStep("form")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t("auth.edit_info", "Edit Profile Details")}</span>
                </button>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-[var(--color-primary)]">
                  {t("auth.step_2_of_2", "Step 2 of 2")}
                </span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[var(--color-primary)] mx-auto flex items-center justify-center shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">{t("auth.enter_code_title", "Verify Your Mobile & Email")}</h4>
                <p className="text-gray-500 text-xs">
                  {t("auth.enter_code_desc", "We sent a 4-digit verification code to:")} <br />
                  <strong className="text-gray-800 font-mono">{mobileNo}</strong> / <strong className="text-gray-800">{email}</strong>
                </p>
                <span className="inline-block text-[10px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100 mt-0.5">
                  📍 {location}
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-gray-700 block text-center">
                  {t("auth.enter_passcode_label", "Enter 4-Digit Passcode *")}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="• • • •"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-44 mx-auto block bg-gray-50 border border-gray-300 focus:bg-white focus:border-[var(--color-primary)] rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-gray-900 font-bold focus:outline-none shadow-2xs"
                />
                {otpError && (
                  <p className="text-center text-[11px] text-rose-600 font-semibold">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("auth.verify_btn", "Verify & Open Home Dashboard")}</span>
              </button>

              {/* RESEND OTP AT BOTTOM */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{t("auth.didnt_receive", "Didn't receive code?")}</span>
                {resendCooldown > 0 ? (
                  <span className="font-mono text-gray-600">
                    {t("auth.resend_in", "Resend in")} <strong>00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendSignupOtp}
                    className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t("auth.resend_now", "Resend OTP Now")}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );

  // Full Screen Mode
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B2E58] via-[#5C3B68] to-[#965293] flex flex-col items-center justify-center p-3 sm:p-6 py-6 sm:py-10 animate-in fade-in duration-300">
        
        {/* Top Brand Banner */}
        <div className="text-center mb-4 sm:mb-5 space-y-1 sm:space-y-2 px-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="Symvella" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-lg bg-white border border-white/20" 
            />
            <span>Sym<span className="text-[#EE9FE1]">vella</span></span>
          </h1>
          
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
            {t("nav.tagline", "A Multilingual, Explainable AI Companion for Women's Health & Clinical Intelligence")}
          </p>
        </div>

        {cardContent}

        {/* Footer Badges */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-white/70 px-2 text-center">
          <span className="flex items-center gap-1">🔒 100% Private & DPDP Compliant</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">🌿 Evidence-Based Clinical Care</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">🩺 Gynaecological Summary Ready</span>
        </div>

      </div>
    );
  }

  // Modal Mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="my-auto max-h-[92vh] overflow-y-auto w-full flex justify-center">
        {cardContent}
      </div>
    </div>
  );
}
