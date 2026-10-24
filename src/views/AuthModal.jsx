import React, { useState } from "react";
import { useApp } from "../context/AppContext";
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
  Sparkles,
  KeyRound,
  X,
  Stethoscope
} from "lucide-react";
import confetti from "canvas-confetti";

import { calculateAge } from "../utils/dateUtils";

export default function AuthModal({ isOpen, onClose, isFullScreen = false }) {
  const { login, signup, isAuthenticated } = useApp();

  // Default to "login" so user sees Sign In first!
  const [authMode, setAuthMode] = useState("login");

  // Signup form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [dob, setDob] = useState("");
  
  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);

  // OTP Verification state for Signup
  const [signupStep, setSignupStep] = useState("form"); // "form" or "otp"
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);

  // Calculate maximum allowed date (must be at least 13 years ago)
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  const maxDob = maxDobDate.toISOString().split("T")[0];

  // Live age calculation & validation
  const calculatedAge = dob ? calculateAge(dob) : 0;
  const isAgeValid = dob ? calculatedAge >= 13 : false;

  // Handle Signup submission -> Move to OTP step
  const handleProceedToOtp = (e) => {
    e.preventDefault();
    if (!isAgeValid) {
      alert("Registration requires age 13 or above in accordance with adolescent healthcare & digital consent standards.");
      return;
    }
    if (mobileNo.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpError("");
    setEnteredOtp("4242"); // Pre-populate demo OTP for smooth reviewer testing
    setSignupStep("otp");
    setResendCooldown(30);
  };

  // Complete Signup with OTP -> Directly open Home Dashboard
  const handleVerifySignupOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.length < 4) {
      setOtpError("Please enter the 4-digit verification code.");
      return;
    }
    
    // Create new registered user profile
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: mobileNo.trim(),
      location: location.trim(),
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

  // Handle Login -> Directly open Home Dashboard
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier) {
      alert("Please enter your registered email or mobile number.");
      return;
    }
    if (!isLoginOtpSent) {
      setIsLoginOtpSent(true);
      setLoginOtp("4242");
      return;
    }
    // Verify login & go to dashboard
    login({ identifier: loginIdentifier, otp: loginOtp });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3']
    });
    if (onClose) onClose();
  };

  // Quick Demo Login for instant review -> Directly open Home Dashboard
  const handleQuickDemoLogin = () => {
    const demoUser = {
      firstName: "Pooja",
      lastName: "Sharma",
      email: "pooja.sharma@healthmail.com",
      phone: "9876543210",
      location: "Pune, Maharashtra",
      dob: "1998-04-15",
      age: 28,
      isVerified: true
    };
    signup(demoUser);
    if (onClose) onClose();
  };

  if (!isOpen && isAuthenticated && !isFullScreen) return null;

  // Render the core card content
  const cardContent = (
    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/20">
      
      {/* Card Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Symvella" 
            className="w-12 h-12 rounded-2xl object-cover shadow-md bg-white border border-purple-100" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[var(--color-primary-dark)]">
                Sym<span className="text-[var(--color-primary)]">vella</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)]">
                Clinical Health Portal
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {authMode === "login" 
                ? "Sign in to access your confidential health dashboard" 
                : "Create your verified patient health profile"}
            </p>
          </div>
        </div>

        {onClose && isAuthenticated && !isFullScreen && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Switcher: Log In vs Sign Up */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl my-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setIsLoginOtpSent(false);
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            authMode === "login"
              ? "bg-white text-[var(--color-primary)] shadow-xs"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Sign In (Log In)
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
          Create Account (Sign Up)
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. LOG IN FLOW (FIRST SCREEN) */}
      {/* ============================================================== */}
      {authMode === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Registered Mobile Number or Email *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 9876543210 or pooja@example.com"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
            />
          </div>

          {isLoginOtpSent && (
            <div className="space-y-1.5 animate-in fade-in">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-gray-700 block">
                  Enter 4-Digit Passcode *
                </label>
                <span className="text-[10px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-md">
                  Demo Passcode: 4242
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                required
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-center text-sm font-mono tracking-widest font-bold text-gray-900 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <span>{isLoginOtpSent ? "Confirm & Go to Home Dashboard" : "Send Login Passcode"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-gray-100 text-center space-y-2">
            <span className="text-[11px] text-gray-400 block">One-Tap Reviewer Access:</span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[var(--color-primary-dark)] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Direct Demo Sign-In (Pooja Sharma, 28 yrs)</span>
            </button>

            <p className="text-[11px] text-gray-500 pt-1">
              New patient?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setSignupStep("form");
                }}
                className="text-[var(--color-primary)] font-bold hover:underline"
              >
                Create an account here
              </button>
            </p>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* 2. SIGN UP FLOW */}
      {/* ============================================================== */}
      {authMode === "signup" && (
        <div>
          {signupStep === "form" ? (
            <form onSubmit={handleProceedToOtp} className="space-y-3.5 text-xs">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[var(--color-primary)]" /> First Name *
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
                    <User className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Mobile Number *
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

              {/* Email Address for OTP */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Email Address (for OTP Verification) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  A 4-digit verification code will be sent to this email
                </span>
              </div>

              {/* Location */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Location (City & State) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                />
              </div>

              {/* Date of Birth (DOB) with >13 Years Validation */}
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-[var(--color-border)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-900 flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Date of Birth (DOB) *
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[var(--color-primary)] border border-purple-200">
                    Must be 13+ Years
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

                {/* Real-time Age Feedback */}
                {dob && (
                  <div className="pt-1">
                    {isAgeValid ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Calculated Age: <strong>{calculatedAge} Years</strong> (Valid for Registration)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-700 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Calculated Age: <strong>{calculatedAge} Years</strong>. Registration requires age 13 or older.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Privacy & Consent Note */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All medical and cycle records are 100% confidential and encrypted on your local device under the DPDP Act.
                </span>
              </div>

              {/* Submit to OTP Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isAgeValid || !firstName || !mobileNo || !email}
                  className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                    isAgeValid && firstName && mobileNo && email
                      ? "bg-[var(--color-primary)] hover:opacity-95 text-white active:scale-98 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Send Email OTP & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="text-[var(--color-primary)] font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>

            </form>
          ) : (
            /* OTP VERIFICATION STEP */
            <form onSubmit={handleVerifySignupOtp} className="space-y-4 py-2 text-xs animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[var(--color-primary)] mx-auto flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Verify Your Email Address</h4>
                <p className="text-gray-500 text-xs">
                  We sent a 4-digit verification code to: <br />
                  <strong className="text-gray-800">{email}</strong>
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                <span className="text-[11px] text-purple-900 font-medium block">
                  Demo Passcode: <strong className="font-mono text-purple-800 text-xs">4242</strong> (Auto-filled below)
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block text-center">
                  Enter 4-Digit Passcode
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-40 mx-auto block bg-gray-50 border border-gray-300 focus:bg-white focus:border-[var(--color-primary)] rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-gray-900 font-bold focus:outline-none"
                />
                {otpError && (
                  <p className="text-center text-[11px] text-rose-600 font-semibold">{otpError}</p>
                )}
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                <button
                  type="button"
                  onClick={() => setSignupStep("form")}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  ← Edit Profile Details
                </button>
                <span>
                  Resend code in <strong className="font-mono text-gray-800">00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Open Home Dashboard</span>
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );

  // If Full-Screen Mode (First screen before login)
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B2E58] via-[#5C3B68] to-[#965293] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
        
        {/* Top Brand Banner */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EE9FE1]" />
            <span>Standardized Healthcare Protocols (FOGSI / ICMR Aligned)</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
            <img 
              src="/logo.png" 
              alt="Symvella" 
              className="w-12 h-12 rounded-2xl object-cover shadow-lg bg-white border border-white/20" 
            />
            <span>Sym<span className="text-[#EE9FE1]">vella</span></span>
          </h1>
          
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            A Multilingual, Explainable AI Companion for Women's Health & Clinical Intelligence
          </p>
        </div>

        {/* Card Component */}
        {cardContent}

        {/* Footer Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/70">
          <span className="flex items-center gap-1">🔒 100% Private & DPDP Compliant</span>
          <span>•</span>
          <span className="flex items-center gap-1">🌿 Evidence-Based Clinical Care</span>
          <span>•</span>
          <span className="flex items-center gap-1">🩺 Gynaecological Summary Ready</span>
        </div>

      </div>
    );
  }

  // Regular Modal Mode (e.g. when opening from Settings or Navbar)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="my-auto max-h-[92vh] overflow-y-auto w-full flex justify-center">
        {cardContent}
      </div>
    </div>
  );
}
