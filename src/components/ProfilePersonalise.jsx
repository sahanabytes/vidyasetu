import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  School,
  BookOpen,
  Bell,
  Award,
  Globe,
  Info
} from 'lucide-react';

const COPY = {
  kn: {
    heading: 'ವಿದ್ಯಾಸೇತುಗೆ ಸುಸ್ವಾಗತ!',
    subtitle: 'Let’s get to know you better and personalise your learning experience.',
    knSub: 'ನಿಮ್ಮನ್ನು ಇನ್ನಷ್ಟು ಚೆನ್ನಾಗಿ ತಿಳಿದುಕೊಂಡು ಕಲಿಕೆಯ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸೋಣ.',
    greetingPrefix: 'ನಮಸ್ಕಾರ',
    roleBadge: {
      student: 'Student Account • ವಿದ್ಯಾರ್ಥಿ ಖಾತೆ',
      parent: 'Parent Account • ಪೋಷಕರ ಖಾತೆ',
      teacher: 'Teacher Account • ಶಿಕ್ಷಕರ ಖಾತೆ'
    },
    progressLabel: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣತೆ (Profile Completion)',
    secPersonal: 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು (Personal Details)',
    secAcademic: 'ಶೈಕ್ಷಣಿಕ & ಕಲಿಕಾ ಮಾಹಿತಿ (Academic & Learning)',
    secExtra: 'ಹೆಚ್ಚುವರಿ ಆದ್ಯತೆಗಳು (Preferences & Contact)',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು (Full Name) *',
    classGrade: 'ತರಗತಿ / ಹಂತ (Class / Grade) *',
    schoolName: 'ಶಾಲೆಯ ಹೆಸರು (School Name) *',
    parentName: 'ಪೋಷಕರು / ಪಾಲಕರ ಹೆಸರು (Optional)',
    parentContact: 'ಪೋಷಕರ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ (Optional)',
    prefLang: 'ಕಲಿಕೆಯ ಆದ್ಯತೆಯ ಭಾಷೆ *',
    childName: 'ಮಗುವಿನ ಹೆಸರು (Child’s Name) *',
    childClass: 'ಮಗುವಿನ ತರಗತಿ (Child’s Class) *',
    childSchool: 'ಮಗುವಿನ ಶಾಲೆ (Child’s School — Optional)',
    notifPref: 'ಸೂಚನೆ ಆದ್ಯತೆ (Notification Preference — Optional)',
    institution: 'ಶಾಲೆ / ಸಂಸ್ಥೆ (School / Institution) *',
    subjectTaught: 'ಬೋಧಿಸುವ ವಿಷಯ (Subject Taught) *',
    classesTaught: 'ಬೋಧಿಸುವ ತರಗತಿಗಳು (Classes Taught) *',
    experience: 'ಬೋಧನಾ ಅನುಭವ (Teaching Experience — Optional)',
    backBtn: 'ಹಿಂದೆ (Back)',
    completeBtn: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ (Complete Profile)',
    errRequired: 'ದಯವಿಟ್ಟು ಕಡ್ಡಾಯ (*) ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
    storageNote:
      'ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಸಂಗ್ರಹದಲ್ಲಿ (localStorage) ಉಳಿಸಲಾಗುತ್ತದೆ; ಸರ್ವರ್ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕಿಸಿಲ್ಲ.'
  },
  en: {
    heading: 'ವಿದ್ಯಾಸೇತುಗೆ ಸುಸ್ವಾಗತ!',
    subtitle: 'Let’s get to know you better and personalise your learning experience.',
    knSub: 'ನಿಮ್ಮನ್ನು ಇನ್ನಷ್ಟು ಚೆನ್ನಾಗಿ ತಿಳಿದುಕೊಂಡು ಕಲಿಕೆಯ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸೋಣ.',
    greetingPrefix: 'Welcome',
    roleBadge: {
      student: 'Student Account',
      parent: 'Parent Account',
      teacher: 'Teacher Account'
    },
    progressLabel: 'Profile Completion',
    secPersonal: 'Personal Information',
    secAcademic: 'Academic & Learning Details',
    secExtra: 'Optional Preferences & Links',
    fullName: 'Full name *',
    classGrade: 'Class / Grade *',
    schoolName: 'School name *',
    parentName: 'Parent / Guardian name (optional)',
    parentContact: 'Parent / Guardian contact (optional)',
    prefLang: 'Preferred learning language *',
    childName: "Child's name *",
    childClass: "Child's class *",
    childSchool: "Child's school (optional)",
    notifPref: 'Notification preference (optional)',
    institution: 'School / Institution *',
    subjectTaught: 'Subject taught *',
    classesTaught: 'Classes taught *',
    experience: 'Teaching experience (optional)',
    backBtn: 'Back',
    completeBtn: 'Complete Profile',
    errRequired: 'Please complete all required (*) fields before continuing.',
    storageNote:
      'Profile details are saved locally in browser localStorage only; no backend server database is connected.'
  }
};

export default function ProfilePersonalise({
  lang,
  onChangeLang,
  user,
  existingProfile,
  onBack,
  onCompleteProfile
}) {
  const t = COPY[lang] || COPY.kn;
  const activeRole = ['student', 'parent', 'teacher'].includes(user?.role) ? user.role : 'student';

  const [formData, setFormData] = useState({
    fullName: existingProfile?.fullName || user?.fullName || '',
    classGrade: existingProfile?.classGrade || 'Class 8 (Karnataka State Board)',
    schoolName: existingProfile?.schoolName || '',
    parentName: existingProfile?.parentName || '',
    parentContact: existingProfile?.parentContact || '',
    learningLang: existingProfile?.learningLang || user?.preferredLang || lang,
    childName: existingProfile?.childName || '',
    childClass: existingProfile?.childClass || 'Class 8',
    childSchool: existingProfile?.childSchool || '',
    notificationPref: existingProfile?.notificationPref || 'Kannada + English Progress Summary',
    institution: existingProfile?.institution || '',
    subjectTaught: existingProfile?.subjectTaught || 'Mathematics',
    classesTaught: existingProfile?.classesTaught || 'Class 8',
    experience: existingProfile?.experience || ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const updateField = (key, value) => {
    if (errorMsg) setErrorMsg('');
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const progressPercent = useMemo(() => {
    if (activeRole === 'student') {
      const checks = [
        Boolean(formData.fullName.trim()),
        Boolean(formData.classGrade.trim()),
        Boolean(formData.schoolName.trim()),
        Boolean(formData.learningLang),
        Boolean(formData.parentName.trim() || formData.parentContact.trim())
      ];
      return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }
    if (activeRole === 'parent') {
      const checks = [
        Boolean(formData.fullName.trim()),
        Boolean(formData.childName.trim()),
        Boolean(formData.childClass.trim()),
        Boolean(formData.childSchool.trim() || formData.notificationPref.trim())
      ];
      return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }
    const checks = [
      Boolean(formData.fullName.trim()),
      Boolean(formData.institution.trim()),
      Boolean(formData.subjectTaught.trim()),
      Boolean(formData.classesTaught.trim()),
      Boolean(formData.experience.trim())
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [activeRole, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMsg(t.errRequired);
      return;
    }

    if (activeRole === 'student' && (!formData.classGrade.trim() || !formData.schoolName.trim())) {
      setErrorMsg(t.errRequired);
      return;
    }

    if (activeRole === 'parent' && (!formData.childName.trim() || !formData.childClass.trim())) {
      setErrorMsg(t.errRequired);
      return;
    }

    if (
      activeRole === 'teacher' &&
      (!formData.institution.trim() || !formData.subjectTaught.trim() || !formData.classesTaught.trim())
    ) {
      setErrorMsg(t.errRequired);
      return;
    }

    if (activeRole === 'student' && formData.learningLang) {
      onChangeLang(formData.learningLang);
    }

    onCompleteProfile({
      ...formData,
      fullName: formData.fullName.trim(),
      role: activeRole,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="vs-p2-stage">
      <div className="vs-p2-glow vs-p2-glow-purple" />
      <div className="vs-p2-glow vs-p2-glow-turquoise" />
      <div className="vs-p2-glow vs-p2-glow-blue" />

      <div className="vs-p2-container">
        <div className="vs-p2-topbar">
          <button type="button" className="vs-p2-back-btn" onClick={onBack}>
            <ArrowLeft size={17} />
            <span>{t.backBtn}</span>
          </button>

          <div className={`vs-p2-role-badge role-${activeRole}`}>
            <Sparkles size={15} />
            <span>{t.roleBadge[activeRole]}</span>
          </div>

          <div className="vs-p2-lang-switch">
            <Globe size={15} className="vs-p2-lang-icon" />
            <button
              type="button"
              className={lang === 'kn' ? 'active' : ''}
              onClick={() => onChangeLang('kn')}
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => onChangeLang('en')}
            >
              English
            </button>
          </div>
        </div>

        <div className="vs-p2-card">
          <div className="vs-p2-hero">
            <div className="vs-p2-avatar-box" aria-hidden="true">
              <svg width="74" height="74" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="p2AvatarGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="55%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#2DD4BF" />
                  </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="37" fill="url(#p2AvatarGrad)" fillOpacity="0.28" stroke="url(#p2AvatarGrad)" strokeWidth="2.5" />
                <circle cx="40" cy="31" r="11" fill="#F8FAFC" />
                <path d="M21 63C23 51 31 46 40 46C49 46 57 51 59 63" fill="#E0E7FF" />
                <circle cx="62" cy="20" r="6" fill="#2DD4BF" />
              </svg>
            </div>

            <div className="vs-p2-hero-text">
              <div className="vs-p2-greet">
                {t.greetingPrefix}, <span>{formData.fullName || user?.fullName || 'Friend'}</span>
              </div>
              <h1 className="vs-p2-heading">{t.heading}</h1>
              <p className="vs-p2-subtitle">{t.subtitle}</p>
              <p className="vs-p2-kn-sub">{t.knSub}</p>
            </div>
          </div>

          <div className="vs-p2-progress-wrap">
            <div className="vs-p2-progress-meta">
              <span>{t.progressLabel}</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="vs-p2-progress-track">
              <div className="vs-p2-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {errorMsg && (
            <div className="vs-p2-error">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="vs-p2-form" noValidate>
            <div className="vs-p2-section">
              <div className="vs-p2-sec-title">
                <User size={17} />
                <span>{t.secPersonal}</span>
              </div>

              <div className="vs-p2-grid-2">
                <div className="vs-p2-field">
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    required
                  />
                </div>

                {activeRole === 'student' && (
                  <div className="vs-p2-field">
                    <label>{t.prefLang}</label>
                    <select
                      value={formData.learningLang}
                      onChange={(e) => updateField('learningLang', e.target.value)}
                    >
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                )}

                {activeRole === 'teacher' && (
                  <div className="vs-p2-field">
                    <label>{t.institution}</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => updateField('institution', e.target.value)}
                      placeholder="e.g. Govt High School, Mysuru"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="vs-p2-section">
              <div className="vs-p2-sec-title">
                <BookOpen size={17} />
                <span>{t.secAcademic}</span>
              </div>

              {activeRole === 'student' && (
                <div className="vs-p2-grid-2">
                  <div className="vs-p2-field">
                    <label>{t.classGrade}</label>
                    <input
                      type="text"
                      value={formData.classGrade}
                      onChange={(e) => updateField('classGrade', e.target.value)}
                      placeholder="Class 8"
                      required
                    />
                  </div>
                  <div className="vs-p2-field">
                    <label>{t.schoolName}</label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField('schoolName', e.target.value)}
                      placeholder="Enter school name"
                      required
                    />
                  </div>
                </div>
              )}

              {activeRole === 'parent' && (
                <div className="vs-p2-grid-2">
                  <div className="vs-p2-field">
                    <label>{t.childName}</label>
                    <input
                      type="text"
                      value={formData.childName}
                      onChange={(e) => updateField('childName', e.target.value)}
                      placeholder="Enter child's full name"
                      required
                    />
                  </div>
                  <div className="vs-p2-field">
                    <label>{t.childClass}</label>
                    <input
                      type="text"
                      value={formData.childClass}
                      onChange={(e) => updateField('childClass', e.target.value)}
                      placeholder="Class 8"
                      required
                    />
                  </div>
                </div>
              )}

              {activeRole === 'teacher' && (
                <div className="vs-p2-grid-2">
                  <div className="vs-p2-field">
                    <label>{t.subjectTaught}</label>
                    <input
                      type="text"
                      value={formData.subjectTaught}
                      onChange={(e) => updateField('subjectTaught', e.target.value)}
                      placeholder="Mathematics"
                      required
                    />
                  </div>
                  <div className="vs-p2-field">
                    <label>{t.classesTaught}</label>
                    <input
                      type="text"
                      value={formData.classesTaught}
                      onChange={(e) => updateField('classesTaught', e.target.value)}
                      placeholder="e.g. Class 8A, Class 8B"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="vs-p2-section">
              <div className="vs-p2-sec-title">
                {activeRole === 'parent' ? <Bell size={17} /> : activeRole === 'teacher' ? <Award size={17} /> : <School size={17} />}
                <span>{t.secExtra}</span>
              </div>

              {activeRole === 'student' && (
                <div className="vs-p2-grid-2">
                  <div className="vs-p2-field">
                    <label>{t.parentName}</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => updateField('parentName', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="vs-p2-field">
                    <label>{t.parentContact}</label>
                    <input
                      type="tel"
                      value={formData.parentContact}
                      onChange={(e) => updateField('parentContact', e.target.value)}
                      placeholder="Optional (10-digit number)"
                    />
                  </div>
                </div>
              )}

              {activeRole === 'parent' && (
                <div className="vs-p2-grid-2">
                  <div className="vs-p2-field">
                    <label>{t.childSchool}</label>
                    <input
                      type="text"
                      value={formData.childSchool}
                      onChange={(e) => updateField('childSchool', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="vs-p2-field">
                    <label>{t.notifPref}</label>
                    <select
                      value={formData.notificationPref}
                      onChange={(e) => updateField('notificationPref', e.target.value)}
                    >
                      <option value="Kannada + English Progress Summary">Kannada + English Progress Summary</option>
                      <option value="Weekly Practice & Mistake Alerts">Weekly Practice & Mistake Alerts</option>
                      <option value="Minimal / Quiet Mode">Minimal / Quiet Mode</option>
                    </select>
                  </div>
                </div>
              )}

              {activeRole === 'teacher' && (
                <div className="vs-p2-grid-1">
                  <div className="vs-p2-field">
                    <label>{t.experience}</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => updateField('experience', e.target.value)}
                      placeholder="e.g. 6 years teaching Class 8 Maths (optional)"
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="vs-p2-submit">
              <CheckCircle2 size={19} />
              <span>{t.completeBtn}</span>
            </button>
          </form>

          <div className="vs-p2-note">
            <Info size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{t.storageNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}