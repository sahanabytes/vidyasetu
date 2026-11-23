import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Users,
  Lightbulb,
  Sparkles,
  Languages,
  Eye,
  EyeOff,
  ArrowRight,
  Sigma,
  Star
} from 'lucide-react';
import './WelcomeAuthPage.css';

export default function WelcomeAuthPage({
  lang = 'kn',
  onChangeLang,
  onContinueToProfile
}) {
  const [activeTab, setActiveTab] = useState('login');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotContact, setForgotContact] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [accountRole, setAccountRole] = useState('student');
  const [preferredLang, setPreferredLang] = useState(lang);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleLangToggle = () => {
    const nextLang = lang === 'kn' ? 'en' : 'kn';
    setPreferredLang(nextLang);
    if (onChangeLang) onChangeLang(nextLang);
  };

  const handlePreferredLangChange = (e) => {
    const nextLang = e.target.value;
    setPreferredLang(nextLang);
    if (onChangeLang) onChangeLang(nextLang);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotContact.trim()) {
      setForgotMsg(
        lang === 'kn'
          ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.'
          : 'Please enter your email address or mobile number.'
      );
      return;
    }
    setForgotMsg(
      lang === 'kn'
        ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ವಿನಂತಿ ಸಿದ್ಧವಾಗಿದೆ (ಬ್ಯಾಕೆಂಡ್ ಸೇವೆ ಸಂಪರ್ಕಿಸಿದಾಗ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುತ್ತದೆ).'
        : 'Password reset request noted (delivery requires backend configuration).'
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg(
        lang === 'kn'
          ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್/ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡನ್ನೂ ಭರ್ತಿ ಮಾಡಿ.'
          : 'Please enter both email/mobile number and password.'
      );
      return;
    }

    const derivedName = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0]
      : loginIdentifier.trim();

    setStatusMsg(
      lang === 'kn'
        ? 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಸಾಗಿಸಲಾಗುತ್ತಿದೆ...'
        : 'Proceeding to profile setup...'
    );

    if (onContinueToProfile) {
      onContinueToProfile({
        fullName: derivedName,
        role: accountRole,
        preferredLang: lang,
        rememberMe
      });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    if (!fullName.trim()) {
      setErrorMsg(
        lang === 'kn' ? 'ದಯವಿಟ್ಟು ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your full name.'
      );
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(
        lang === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.' : 'Please enter a valid email address.'
      );
      return;
    }
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setErrorMsg(
        lang === 'kn'
          ? 'ದಯವಿಟ್ಟು 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }
    if (createPassword.length < 6) {
      setErrorMsg(
        lang === 'kn'
          ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }
    if (createPassword !== confirmPassword) {
      setErrorMsg(
        lang === 'kn'
          ? 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಖಚಿತಪಡಿಸಿದ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.'
          : 'Passwords do not match.'
      );
      return;
    }
    if (!agreeTerms) {
      setErrorMsg(
        lang === 'kn'
          ? 'ಮುಂದುವರಿಯಲು ನಿಯಮ ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ಸಮ್ಮತಿಸಿ.'
          : 'Please agree to the terms and conditions to continue.'
      );
      return;
    }

    setStatusMsg(
      lang === 'kn'
        ? 'ವಿವರಗಳು ದಾಖಲಾಗಿವೆ; ಪ್ರೊಫೈಲ್ ಪುಟಕ್ಕೆ ಸಾಗಲಾಗುತ್ತಿದೆ...'
        : 'Details captured; opening profile setup...'
    );

    if (onContinueToProfile) {
      onContinueToProfile({
        fullName: fullName.trim(),
        role: accountRole,
        preferredLang
      });
    }
  };

  const roles = [
    {
      id: 'student',
      icon: GraduationCap,
      title: lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ' : 'Student',
      desc: lang === 'kn' ? 'ಪಾಠ ಮತ್ತು ಅಭ್ಯಾಸ' : 'Lessons & practice'
    },
    {
      id: 'teacher',
      icon: BookOpen,
      title: lang === 'kn' ? 'ಶಿಕ್ಷಕರು' : 'Teacher',
      desc: lang === 'kn' ? 'ತರಗತಿ ಮಾರ್ಗದರ್ಶನ' : 'Class guidance'
    },
    {
      id: 'parent',
      icon: Users,
      title: lang === 'kn' ? 'ಪೋಷಕರು / ಮಾರ್ಗದರ್ಶಕರು' : 'Parent / Mentor',
      desc: lang === 'kn' ? 'ಪ್ರಗತಿ ಗಮನಿಸಿ' : 'Track progress'
    }
  ];

  return (
    <div className="vs-p1-root">
      <div className="vs-p1-glow-orb vs-p1-orb-a" aria-hidden="true" />
      <div className="vs-p1-glow-orb vs-p1-orb-b" aria-hidden="true" />
      <div className="vs-p1-glow-orb vs-p1-orb-c" aria-hidden="true" />

      <div className="vs-p1-container">
        <header className="vs-p1-header">
          <div className="vs-p1-brand-box">
            <div className="vs-p1-logo-badge">
              <Sparkles size={20} />
            </div>
            <span className="vs-p1-brand-name">VIDYASETU (ವಿದ್ಯಾಸೇತು)</span>
          </div>

          <button
            type="button"
            className="vs-p1-lang-switch"
            onClick={handleLangToggle}
          >
            <Languages size={17} />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </header>

        <div className="vs-p1-grid">
          <section className="vs-p1-glass">
            <h1 className="vs-p1-hero-title">
              {lang === 'kn' ? 'ವಿದ್ಯಾಸೇತುಗೆ ಸುಸ್ವಾಗತ!' : 'Welcome to VidyaSetu'}
            </h1>
            <p className="vs-p1-tagline">
              {lang === 'kn'
                ? 'ಉತ್ತಮವಾಗಿ ಕಲಿಯಿರಿ. ಬುದ್ಧಿವಂತರಾಗಿ ಬೆಳೆಯಿರಿ. ಒಟ್ಟಾಗಿ ಸಾಧಿಸಿ.'
                : 'Learn Better. Grow Smarter. Achieve Together.'}
            </p>

            <div className="vs-p1-edu-strip">
              <div className="vs-p1-edu-item">
                <div className="vs-p1-edu-icon-wrap vs-p1-icon-teal">
                  <BookOpen size={20} />
                </div>
                <span className="vs-p1-edu-label">
                  {lang === 'kn' ? 'ಪಠ್ಯಪುಸ್ತಕಗಳು' : 'Books'}
                </span>
              </div>

              <div className="vs-p1-edu-item">
                <div className="vs-p1-edu-icon-wrap vs-p1-icon-coral">
                  <Sigma size={20} />
                </div>
                <span className="vs-p1-edu-label">
                  {lang === 'kn' ? 'ಗಣಿತ ಚಿಹ್ನೆಗಳು' : 'Maths Symbols'}
                </span>
              </div>

              <div className="vs-p1-edu-item">
                <div className="vs-p1-edu-icon-wrap vs-p1-icon-gold">
                  <Lightbulb size={20} />
                </div>
                <span className="vs-p1-edu-label">
                  {lang === 'kn' ? 'ಹೊಸ ಆಲೋಚನೆ' : 'Bright Ideas'}
                </span>
              </div>
            </div>

            <div className="vs-p1-card-deck">
              <div className="vs-p1-learning-card">
                <span className="vs-p1-card-kicker">
                  <Star size={13} style={{ verticalAlign: 'middle' }} />{' '}
                  {lang === 'kn' ? 'ಕಲಿಕಾ ಕಾರ್ಡ್ 01' : 'LEARNING CARD 01'}
                </span>
                <p className="vs-p1-card-text">
                  {lang === 'kn'
                    ? 'ಪ್ರತಿ ಪರಿಕಲ್ಪನೆಯನ್ನೂ ಸರಳ ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.'
                    : 'Build strong fundamentals with clear step-by-step clarity.'}
                </p>
              </div>

              <div className="vs-p1-learning-card">
                <span className="vs-p1-card-kicker">
                  <GraduationCap size={13} style={{ verticalAlign: 'middle' }} />{' '}
                  {lang === 'kn' ? 'ಕಲಿಕಾ ಕಾರ್ಡ್ 02' : 'LEARNING CARD 02'}
                </span>
                <p className="vs-p1-card-text">
                  {lang === 'kn'
                    ? 'ವಿದ್ಯಾರ್ಥಿಗಳು, ಪೋಷಕರು ಮತ್ತು ಶಿಕ್ಷಕರು ಒಟ್ಟಾಗಿ ಪ್ರಗತಿ ಸಾಧಿಸಿ.'
                    : 'Confidence and growth for students, parents, and teachers.'}
                </p>
              </div>
            </div>
          </section>

          <section className="vs-p1-glass">
            <div className="vs-p1-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                className={`vs-p1-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                  setStatusMsg('');
                }}
              >
                {lang === 'kn' ? 'ಲಾಗಿನ್ (LOGIN)' : 'LOGIN'}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                className={`vs-p1-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                  setStatusMsg('');
                }}
              >
                {lang === 'kn' ? 'ನೋಂದಣಿ (REGISTER)' : 'REGISTER'}
              </button>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-login-id">
                    {lang === 'kn'
                      ? 'ಇಮೇಲ್ ವಿಳಾಸ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'
                      : 'Email address or mobile number'}
                  </label>
                  <input
                    id="vs-login-id"
                    type="text"
                    className="vs-p1-input"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      lang === 'kn'
                        ? 'ಉದಾ: kavya@example.com ಅಥವಾ 9876543210'
                        : 'e.g. kavya@example.com or 9876543210'
                    }
                  />
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-login-pass">
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
                  </label>
                  <div className="vs-p1-input-wrap">
                    <input
                      id="vs-login-pass"
                      type={showLoginPass ? 'text' : 'password'}
                      className="vs-p1-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={
                        lang === 'kn' ? 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter your password'
                      }
                    />
                    <button
                      type="button"
                      className="vs-p1-eye-btn"
                      aria-label={
                        showLoginPass
                          ? lang === 'kn'
                            ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ'
                            : 'Hide password'
                          : lang === 'kn'
                          ? 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ'
                          : 'Show password'
                      }
                      onClick={() => setShowLoginPass((s) => !s)}
                    >
                      {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="vs-p1-row-between">
                  <label className="vs-p1-check-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>{lang === 'kn' ? 'ನನ್ನನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ' : 'Remember me'}</span>
                  </label>

                  <button
                    type="button"
                    className="vs-p1-link-btn"
                    onClick={() => {
                      setShowForgot((f) => !f);
                      setForgotMsg('');
                    }}
                  >
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot password?'}
                  </button>
                </div>

                {showForgot && (
                  <div className="vs-p1-forgot-box">
                    <label className="vs-p1-label" htmlFor="vs-forgot-input">
                      {lang === 'kn'
                        ? 'ಮರುಹೊಂದಿಸಲು ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'
                        : 'Email or mobile number to reset'}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        id="vs-forgot-input"
                        type="text"
                        className="vs-p1-input"
                        value={forgotContact}
                        onChange={(e) => setForgotContact(e.target.value)}
                        placeholder={
                          lang === 'kn' ? 'ಇಮೇಲ್ / ಮೊಬೈಲ್' : 'Email / mobile'
                        }
                      />
                      <button
                        type="button"
                        className="vs-p1-lang-switch"
                        onClick={handleForgotSubmit}
                      >
                        {lang === 'kn' ? 'ಕಳುಹಿಸಿ' : 'Send'}
                      </button>
                    </div>
                    {forgotMsg && (
                      <p className="vs-p1-success" style={{ marginTop: 8 }}>
                        {forgotMsg}
                      </p>
                    )}
                  </div>
                )}

                <button type="submit" className="vs-p1-submit-btn">
                  <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Login'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate>
                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-name">
                    {lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full name'}
                  </label>
                  <input
                    id="vs-reg-name"
                    type="text"
                    className="vs-p1-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      lang === 'kn' ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ಬರೆಯಿರಿ' : 'Enter your full name'
                    }
                  />
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-email">
                    {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email address'}
                  </label>
                  <input
                    id="vs-reg-email"
                    type="email"
                    className="vs-p1-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-mobile">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile number'}
                  </label>
                  <input
                    id="vs-reg-mobile"
                    type="tel"
                    className="vs-p1-input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-pass">
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ' : 'Create password'}
                  </label>
                  <div className="vs-p1-input-wrap">
                    <input
                      id="vs-reg-pass"
                      type={showRegPass ? 'text' : 'password'}
                      className="vs-p1-input"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder={
                        lang === 'kn' ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು' : 'At least 6 characters'
                      }
                    />
                    <button
                      type="button"
                      className="vs-p1-eye-btn"
                      aria-label={
                        showRegPass
                          ? lang === 'kn'
                            ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ'
                            : 'Hide password'
                          : lang === 'kn'
                          ? 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ'
                          : 'Show password'
                      }
                      onClick={() => setShowRegPass((s) => !s)}
                    >
                      {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-confirm">
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ' : 'Confirm password'}
                  </label>
                  <input
                    id="vs-reg-confirm"
                    type={showRegPass ? 'text' : 'password'}
                    className="vs-p1-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={
                      lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೆ ನಮೂದಿಸಿ' : 'Re-enter password'
                    }
                  />
                </div>

                <div className="vs-p1-field">
                  <span className="vs-p1-label">
                    {lang === 'kn' ? 'ಖಾತೆಯ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Account type selection'}
                  </span>
                  <div className="vs-p1-role-grid">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = accountRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          className={`vs-p1-role-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setAccountRole(r.id)}
                        >
                          <Icon size={20} style={{ margin: '0 auto' }} />
                          <span className="vs-p1-role-title">{r.title}</span>
                          <span className="vs-p1-role-desc">{r.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="vs-p1-field">
                  <label className="vs-p1-label" htmlFor="vs-reg-lang">
                    {lang === 'kn' ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Preferred language'}
                  </label>
                  <select
                    id="vs-reg-lang"
                    className="vs-p1-select"
                    value={preferredLang}
                    onChange={handlePreferredLangChange}
                  >
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="vs-p1-row-between">
                  <label className="vs-p1-check-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>
                      {lang === 'kn'
                        ? 'ನಿಯಮ ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ'
                        : 'I agree to the terms and conditions'}
                    </span>
                  </label>
                </div>

                <button type="submit" className="vs-p1-submit-btn">
                  <span>{lang === 'kn' ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {errorMsg && <p className="vs-p1-error">{errorMsg}</p>}
            {statusMsg && <p className="vs-p1-success">{statusMsg}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}