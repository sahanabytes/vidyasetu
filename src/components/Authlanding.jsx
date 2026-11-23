import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  GraduationCap,
  KeyRound,
  ArrowRight,
  Info
} from 'lucide-react';
import { AUTH_TEXT } from '../data/authTranslations';

// Keep only digits and compare the last 10 (handles "+91 98765 43210", "98765-43210", etc.)
const last10Digits = (value = '') => String(value).replace(/\D/g, '').slice(-10);

export default function AuthLanding({ lang, onChangeLang, users, onRegisterUser, onLoginSuccess, onResetPassword }) {
  const t = AUTH_TEXT[lang] || AUTH_TEXT.kn;
  // Safe lookup for text keys that may not exist yet in authTranslations.js
  const tx = (key, fallback) => (t && t[key]) || fallback;

  // 'login' | 'register' | 'forgot' | 'reset'
  const [authView, setAuthView] = useState('login');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [role, setRole] = useState('student');
  const [prefLang, setPrefLang] = useState(lang);
  const [agreed, setAgreed] = useState(false);

  // Forgot & Reset State
  const [recoveryTarget, setRecoveryTarget] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);

  // Track pending timeouts so they are cleared if the component unmounts
  const timers = useRef([]);
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const clearFeedback = () => setStatusMsg({ type: '', text: '' });

  const switchAuthTab = (tab) => {
    clearFeedback();
    setAuthView(tab);
  };

  const handleQuickDemoFill = () => {
    clearFeedback();
    setIdentifier('kavya@vidyasetu.in');
    setLoginPassword('vidya123');
    setAuthView('login');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    clearFeedback();

    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !loginPassword) {
      setStatusMsg({ type: 'error', text: t.errors.requiredAll });
      return;
    }

    const idDigits = last10Digits(cleanId);
    const looksLikePhone = !cleanId.includes('@') && idDigits.length >= 10;

    const matchedUser = users.find(
      (u) =>
        (u.email || '').toLowerCase() === cleanId ||
        (looksLikePhone && last10Digits(u.mobile) === idDigits)
    );

    if (!matchedUser || matchedUser.password !== loginPassword) {
      setStatusMsg({ type: 'error', text: t.errors.invalidCredentials });
      return;
    }

    setStatusMsg({ type: 'success', text: t.success.loggedIn });
    later(() => {
      onLoginSuccess(matchedUser, rememberMe);
    }, 450);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    clearFeedback();

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanMobile = regMobile.replace(/\D/g, '');

    if (!fullName.trim() || !cleanEmail || !cleanMobile || !regPassword || !confirmPass) {
      setStatusMsg({ type: 'error', text: t.errors.requiredAll });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatusMsg({ type: 'error', text: t.errors.invalidEmail });
      return;
    }

    if (cleanMobile.length < 10) {
      setStatusMsg({ type: 'error', text: t.errors.invalidPhone });
      return;
    }

    if (regPassword.length < 6) {
      setStatusMsg({ type: 'error', text: t.errors.shortPassword });
      return;
    }

    if (regPassword !== confirmPass) {
      setStatusMsg({ type: 'error', text: t.errors.passwordMismatch });
      return;
    }

    if (!agreed) {
      setStatusMsg({ type: 'error', text: t.errors.acceptTerms });
      return;
    }

    const duplicate = users.find(
      (u) =>
        (u.email || '').toLowerCase() === cleanEmail ||
        last10Digits(u.mobile) === last10Digits(cleanMobile)
    );
    if (duplicate) {
      setStatusMsg({ type: 'error', text: t.errors.accountExists });
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: last10Digits(cleanMobile),
      password: regPassword,
      role,
      preferredLang: prefLang
    };

    onRegisterUser(newUser);
    onChangeLang(prefLang);
    setStatusMsg({ type: 'success', text: t.success.registered });
    later(() => {
      onLoginSuccess(newUser, true);
    }, 550);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    clearFeedback();

    const cleanTarget = recoveryTarget.trim().toLowerCase();
    if (!cleanTarget) {
      setStatusMsg({ type: 'error', text: t.errors.requiredAll });
      return;
    }

    const targetDigits = last10Digits(cleanTarget);
    const looksLikePhone = !cleanTarget.includes('@') && targetDigits.length >= 10;

    const exists = users.find(
      (u) =>
        (u.email || '').toLowerCase() === cleanTarget ||
        (looksLikePhone && last10Digits(u.mobile) === targetDigits)
    );

    if (!exists) {
      setStatusMsg({ type: 'error', text: t.errors.accountNotFound });
      return;
    }

    setStatusMsg({ type: 'success', text: t.success.codeSent });
    setAuthView('reset');
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    clearFeedback();

    // Demo-only verification code. Replace with a real OTP check from your backend.
    if (otpInput.trim() !== '123456') {
      setStatusMsg({ type: 'error', text: t.errors.invalidOtp });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: t.errors.shortPassword });
      return;
    }

    onResetPassword(recoveryTarget.trim().toLowerCase(), newPassword);
    setOtpInput('');
    setNewPassword('');
    setRecoveryTarget('');
    setStatusMsg({ type: 'success', text: t.success.passwordUpdated });
    setAuthView('login');
  };

  return (
    <div className="vs-auth-stage">
      {/* Decorative Glowing Orbs & Floating Educational Symbols */}
      <div className="vs-orb vs-orb-purple" />
      <div className="vs-orb vs-orb-turquoise" />
      <div className="vs-orb vs-orb-coral" />
      <div className="vs-orb vs-orb-yellow" />

      <div className="vs-floating-symbols" aria-hidden="true">
        <span className="vs-float-item f1">π</span>
        <span className="vs-float-item f2">∑</span>
        <span className="vs-float-item f3">√x</span>
        <span className="vs-float-item f4">θ</span>
        <span className="vs-float-item f5">📐</span>
        <span className="vs-float-item f6">🎓</span>
        <span className="vs-float-item f7">∞</span>
        <span className="vs-float-item f8">📚</span>
      </div>

      {/* Top Navigation Header with Brand Logo & Language Switcher */}
      <header className="vs-auth-header">
        <div className="vs-logo-lockup">
          {/* Custom VidyaSetu Bridge + Open Book SVG Emblem */}
          <div className="vs-logo-emblem">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vsGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>
              {/* Bridge Arch */}
              <path d="M6 32C12 18 36 18 42 32" stroke="url(#vsGrad)" strokeWidth="4" strokeLinecap="round" />
              {/* Open Book Pages */}
              <path d="M10 34C15 31 20 32 24 35C28 32 33 31 38 34V24C33 21 28 22 24 25C20 22 15 21 10 24V34Z" fill="white" fillOpacity="0.92" />
              {/* Rising Star / Knowledge Spark */}
              <circle cx="24" cy="12" r="3.5" fill="#FDE047" />
            </svg>
          </div>
          <div>
            <div className="vs-logo-primary">{t.brandName}</div>
            <div className="vs-logo-secondary">{t.brandSub}</div>
          </div>
        </div>

        {/* Language Switcher at Top-Right */}
        <div className="vs-lang-pill" role="group" aria-label="Language Switcher">
          <Globe size={16} className="vs-lang-icon" />
          <button
            type="button"
            className={`vs-lang-opt ${lang === 'kn' ? 'active' : ''}`}
            onClick={() => onChangeLang('kn')}
          >
            ಕನ್ನಡ
          </button>
          <button
            type="button"
            className={`vs-lang-opt ${lang === 'en' ? 'active' : ''}`}
            onClick={() => onChangeLang('en')}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Split Showcase + Glassmorphic Auth Card */}
      <main className="vs-auth-grid">
        {/* Left Visual Showcase Column */}
        <section className="vs-showcase-panel">
          <div className="vs-board-chip">
            <Sparkles size={15} />
            <span>{t.boardBadge}</span>
          </div>

          <h1 className="vs-main-heading">{t.mainHeading}</h1>
          <p className="vs-welcome-lead">{tx('welcomeLead', '“ವಿದ್ಯಾಸೇತುಗೆ ಸುಸ್ವಾಗತ”')}</p>
          <p className="vs-tagline">{t.tagline}</p>
          <p className="vs-subwelcome">{t.subWelcome}</p>

          {/* Custom EdTech & AI Learning Companion Illustration Card */}
          <div className="vs-illustration-card">
            <div className="vs-illus-visual">
              <svg width="110" height="96" viewBox="0 0 120 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="haloGrad" x1="16" y1="8" x2="104" y2="96" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#FB7185" />
                  </linearGradient>
                </defs>
                {/* Soft Glow Halo */}
                <circle cx="60" cy="52" r="44" fill="url(#haloGrad)" fillOpacity="0.28" />
                {/* Open Book Base */}
                <path d="M22 76C36 69 48 71 60 78C72 71 84 69 98 76V54C84 47 72 49 60 56C48 49 36 47 22 54V76Z" fill="#FFFFFF" />
                <path d="M60 56V78" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                {/* Graduation Cap */}
                <polygon points="60,18 90,31 60,44 30,31" fill="#FACC15" />
                <path d="M41 36V46C41 51 79 51 79 46V36" fill="#F59E0B" />
                <line x1="88" y1="32" x2="88" y2="48" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />
                {/* Floating AI Sparkles */}
                <circle cx="24" cy="28" r="4" fill="#2DD4BF" />
                <circle cx="98" cy="24" r="3.5" fill="#F472B6" />
              </svg>
            </div>
            <div className="vs-illus-copy">
              <div className="vs-illus-title">
                <GraduationCap size={18} />
                <span>{t.aiBuddyTitle}</span>
              </div>
              <p>{t.aiBuddyDesc}</p>
              <div className="vs-mini-badges">
                <span><BookOpen size={13} /> Class 8 NCERT/DSERT</span>
                <span>ಕನ್ನಡ + English</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Glassmorphic Authentication Column */}
        <section className="vs-glass-card">
          {(authView === 'login' || authView === 'register') && (
            <div className="vs-auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={authView === 'login'}
                className={`vs-auth-tab ${authView === 'login' ? 'active' : ''}`}
                onClick={() => switchAuthTab('login')}
              >
                {t.tabLogin}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authView === 'register'}
                className={`vs-auth-tab ${authView === 'register' ? 'active' : ''}`}
                onClick={() => switchAuthTab('register')}
              >
                {t.tabRegister}
              </button>
            </div>
          )}

          {/* Status Banner (Error or Success) */}
          {statusMsg.text && (
            <div
              className={`vs-alert ${statusMsg.type === 'error' ? 'vs-alert-error' : 'vs-alert-success'}`}
              role={statusMsg.type === 'error' ? 'alert' : 'status'}
            >
              {statusMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authView === 'login' && (
            <form className="vs-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="vs-input-group">
                <label htmlFor="login-id">{t.emailOrPhone}</label>
                <div className="vs-input-wrap">
                  <Mail size={17} className="vs-input-icon" />
                  <input
                    id="login-id"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.emailOrPhonePlaceholder}
                    required
                  />
                </div>
              </div>

              <div className="vs-input-group">
                <label htmlFor="login-pass">{t.password}</label>
                <div className="vs-input-wrap">
                  <Lock size={17} className="vs-input-icon" />
                  <input
                    id="login-pass"
                    type={showLoginPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    className="vs-eye-btn"
                    onClick={() => setShowLoginPass((prev) => !prev)}
                    aria-label={showLoginPass ? t.hidePass : t.showPass}
                  >
                    {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showLoginPass ? t.hidePass : t.showPass}</span>
                  </button>
                </div>
              </div>

              <div className="vs-form-row-between">
                <label className="vs-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>{t.rememberMe}</span>
                </label>

                <button
                  type="button"
                  className="vs-link-btn"
                  onClick={() => switchAuthTab('forgot')}
                >
                  {t.forgotPasswordLink}
                </button>
              </div>

              <button type="submit" className="vs-submit-btn">
                <span>{t.loginBtn}</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="vs-demo-btn"
                onClick={handleQuickDemoFill}
              >
                ✨ {t.demoQuickFill}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authView === 'register' && (
            <form className="vs-form" onSubmit={handleRegisterSubmit} noValidate>
              <div className="vs-input-group">
                <label htmlFor="reg-name">{t.fullName}</label>
                <div className="vs-input-wrap">
                  <User size={17} className="vs-input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    required
                  />
                </div>
              </div>

              <div className="vs-two-col">
                <div className="vs-input-group">
                  <label htmlFor="reg-email">{t.email}</label>
                  <div className="vs-input-wrap">
                    <Mail size={17} className="vs-input-icon" />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="vs-input-group">
                  <label htmlFor="reg-mobile">{t.mobile}</label>
                  <div className="vs-input-wrap">
                    <Phone size={17} className="vs-input-icon" />
                    <input
                      id="reg-mobile"
                      type="tel"
                      autoComplete="tel"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder={t.mobilePlaceholder}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="vs-two-col">
                <div className="vs-input-group">
                  <label htmlFor="reg-pass">{t.createPassword}</label>
                  <div className="vs-input-wrap">
                    <Lock size={17} className="vs-input-icon" />
                    <input
                      id="reg-pass"
                      type={showRegPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t.createPasswordPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="vs-input-group">
                  <label htmlFor="reg-confirm">{t.confirmPassword}</label>
                  <div className="vs-input-wrap">
                    <Lock size={17} className="vs-input-icon" />
                    <input
                      id="reg-confirm"
                      type={showRegPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      required
                    />
                    <button
                      type="button"
                      className="vs-eye-btn"
                      onClick={() => setShowRegPass((prev) => !prev)}
                      aria-label={showRegPass ? t.hidePass : t.showPass}
                    >
                      {showRegPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="vs-two-col">
                <div className="vs-input-group">
                  <label htmlFor="reg-role">{t.selectRole}</label>
                  <select id="reg-role" value={role} onChange={(e) => setRole(e.target.value)} className="vs-select">
                    <option value="student">{t.roleStudent}</option>
                    <option value="parent">{t.roleParent}</option>
                    <option value="teacher">{t.roleTeacher}</option>
                  </select>
                </div>

                <div className="vs-input-group">
                  <label htmlFor="reg-lang">{t.preferredLang}</label>
                  <select id="reg-lang" value={prefLang} onChange={(e) => setPrefLang(e.target.value)} className="vs-select">
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <label className="vs-checkbox-label" style={{ marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>{t.agreeTerms}</span>
              </label>

              <button type="submit" className="vs-submit-btn">
                <span>{t.createAccountBtn}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD SCREEN */}
          {authView === 'forgot' && (
            <form className="vs-form" onSubmit={handleForgotSubmit} noValidate>
              <div className="vs-subscreen-head">
                <KeyRound size={22} />
                <h2>{tx('forgotTitle', 'Forgot your password?')}</h2>
                <p>{tx('forgotDesc', 'Enter your registered email or mobile number and we will send you a verification code.')}</p>
              </div>

              <div className="vs-input-group">
                <label htmlFor="forgot-target">{t.emailOrPhone}</label>
                <div className="vs-input-wrap">
                  <Mail size={17} className="vs-input-icon" />
                  <input
                    id="forgot-target"
                    type="text"
                    autoComplete="username"
                    value={recoveryTarget}
                    onChange={(e) => setRecoveryTarget(e.target.value)}
                    placeholder={t.emailOrPhonePlaceholder}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="vs-submit-btn">
                <span>{tx('sendCodeBtn', 'Send code')}</span>
                <ArrowRight size={18} />
              </button>

              <button type="button" className="vs-link-btn" onClick={() => switchAuthTab('login')}>
                {tx('backToLogin', 'Back to login')}
              </button>
            </form>
          )}

          {/* RESET PASSWORD SCREEN */}
          {authView === 'reset' && (
            <form className="vs-form" onSubmit={handleResetSubmit} noValidate>
              <div className="vs-subscreen-head">
                <KeyRound size={22} />
                <h2>{tx('resetTitle', 'Set a new password')}</h2>
                <p>{tx('resetDesc', 'Enter the verification code we sent you, then choose a new password.')}</p>
              </div>

              {/* Demo hint: remove when a real OTP service is connected */}
              <div className="vs-alert vs-alert-success" role="note">
                <Info size={18} />
                <span>{tx('demoOtpHint', 'Demo mode: use code 123456')}</span>
              </div>

              <div className="vs-input-group">
                <label htmlFor="reset-otp">{tx('otpLabel', 'Verification code')}</label>
                <div className="vs-input-wrap">
                  <KeyRound size={17} className="vs-input-icon" />
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                  />
                </div>
              </div>

              <div className="vs-input-group">
                <label htmlFor="reset-pass">{tx('newPasswordLabel', 'New password')}</label>
                <div className="vs-input-wrap">
                  <Lock size={17} className="vs-input-icon" />
                  <input
                    id="reset-pass"
                    type={showNewPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.createPasswordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    className="vs-eye-btn"
                    onClick={() => setShowNewPass((prev) => !prev)}
                    aria-label={showNewPass ? t.hidePass : t.showPass}
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="vs-submit-btn">
                <span>{tx('updatePasswordBtn', 'Update password')}</span>
                <ArrowRight size={18} />
              </button>

              <button type="button" className="vs-link-btn" onClick={() => switchAuthTab('login')}>
                {tx('backToLogin', 'Back to login')}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
