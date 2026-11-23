import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Sparkles,
  Brain,
  History,
  FileCheck,
  TrendingUp,
  Trophy,
  Flame,
  Bell,
  Accessibility,
  HelpCircle,
  Mic,
  ImagePlus,
  Send,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  Settings,
  LogOut,
  Award,
  Target,
  CheckCircle2,
  Languages,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { vidyaBackend } from '../services/api';
import './VidyaSetuDashboard.css';

function getChapterTopicTree(chapter) {
  if (Array.isArray(chapter?.topics) && chapter.topics.length > 0) {
    return chapter.topics.map((t, tIdx) => ({
      id: t.id || `${chapter.id || 'ch'}-t${tIdx + 1}`,
      titleEn: t.titleEn || t.title || `Topic ${tIdx + 1}`,
      titleKn: t.titleKn || t.title || `ವಿಷಯ ${tIdx + 1}`,
      subtopics: Array.isArray(t.subtopics)
        ? t.subtopics.map((s, sIdx) =>
            typeof s === 'string'
              ? { id: `${tIdx}-${sIdx}`, titleEn: s, titleKn: s }
              : {
                  id: s.id || `${tIdx}-${sIdx}`,
                  titleEn: s.titleEn || s.title || '',
                  titleKn: s.titleKn || s.title || ''
                }
          )
        : []
    }));
  }

  return [
    {
      id: `${chapter.id || 'ch'}-core`,
      titleEn: `Core Concepts — ${chapter.titleEn || 'Chapter'}`,
      titleKn: `ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳು — ${chapter.titleKn || 'ಅಧ್ಯಾಯ'}`,
      subtopics: [
        {
          id: 'sub-1',
          titleEn: chapter.conceptEn || 'Key definitions and rules',
          titleKn: chapter.conceptKn || 'ಮುಖ್ಯ ವ್ಯಾಖ್ಯಾನಗಳು ಮತ್ತು ನಿಯಮಗಳು'
        },
        {
          id: 'sub-2',
          titleEn: chapter.hintEn || 'Step-by-step solving method',
          titleKn: chapter.hintKn || 'ಹಂತ-ಹಂತದ ಪರಿಹಾರ ವಿಧಾನ'
        }
      ]
    },
    {
      id: `${chapter.id || 'ch'}-practice`,
      titleEn: 'Worked Examples & Practice',
      titleKn: 'ಉದಾಹರಣೆಗಳು ಮತ್ತು ಅಭ್ಯಾಸ',
      subtopics: [
        {
          id: 'sub-3',
          titleEn: chapter.quizQ || 'Check your understanding',
          titleKn: chapter.quizQ || 'ನಿಮ್ಮ ತಿಳುವಳಿಕೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ'
        },
        {
          id: 'sub-4',
          titleEn: `Solution guide: ${chapter.explanationEn || chapter.correctOpt || ''}`,
          titleKn: `ಪರಿಹಾರ ಮಾರ್ಗದರ್ಶಿ: ${chapter.explanationKn || chapter.correctOpt || ''}`
        }
      ]
    }
  ];
}

export default function VidyaSetuDashboard({
  lang = 'en',
  onChangeLang,
  userName = 'Student',
  role = 'student',
  schoolName = '',
  chapters = [],
  chapterIdx = 0,
  onSelectChapter,
  onMarkChapterDone,
  completedChapters = [],
  xp = 320,
  mistakes = [],
  weakTopics = [],
  masteredTopics = [],
  chatMessages = [],
  chatInput = '',
  onChatInputChange,
  onSendChat,
  onVoiceInput,
  onPhotoUpload,
  uploadedPhotoName = '',
  voiceStatus = '',
  onQuizChoice,
  quizMsg = '',
  onGoToProfile,
  onGoToWelcome
}) {
  const [navSection, setNavSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedChapterId, setExpandedChapterId] = useState(
    chapters[chapterIdx]?.id || chapters[0]?.id || 'ch1'
  );
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  // Interactive states for sidebar sections
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScoreMsg, setTestScoreMsg] = useState('');
  const [dailyChallengeDone, setDailyChallengeDone] = useState(false);
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [dailyFeedback, setDailyFeedback] = useState('');
  const [screenReaderTips, setScreenReaderTips] = useState(true);
  const [supportTicketSent, setSupportTicketSent] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  // Parent & Teacher role access states (Page 3)
  const [parentSelectedChildId, setParentSelectedChildId] = useState('stu-1');
  const [emulatedStudentId, setEmulatedStudentId] = useState('stu-1');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [uploadedAssignments, setUploadedAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Quadrilaterals — Angle Sum Practice Sheet',
      studentName: 'Kavya R',
      dueDate: '2026-11-28',
      notes: 'Solve Q1 to Q8 with step-by-step reasoning.'
    }
  ]);
  const [assignmentStatusMsg, setAssignmentStatusMsg] = useState('');
  const [studentsList, setStudentsList] = useState([]);

  // Profile & Settings states (scoped to Page 3 controls)
  const [editableName, setEditableName] = useState(userName);
  const [editableSchool, setEditableSchool] = useState(
    schoolName || 'Karnataka State Board'
  );
  const [profileSavedNotice, setProfileSavedNotice] = useState('');

  const [fontSizeMode, setFontSizeMode] = useState('md');
  const [appearanceMode, setAppearanceMode] = useState('glass');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyShareProgress, setPrivacyShareProgress] = useState(true);

  const activeChapter = chapters[chapterIdx] ||
    chapters[0] || {
      id: 'ch1',
      titleEn: 'Chapter 01: A Square and A Cube',
      titleKn: 'ಅಧ್ಯಾಯ 01: ವರ್ಗ ಮತ್ತು ಘನ',
      conceptEn: 'Square and cube number patterns and prime factorisation.',
      conceptKn: 'ವರ್ಗ ಮತ್ತು ಘನ ಸಂಖ್ಯೆಗಳ ಪರಿಕಲ್ಪನೆ.',
      hintEn: 'Group in pairs for square roots and triplets for cube roots.',
      hintKn: 'ವರ್ಗಮೂಲಕ್ಕೆ 2ರ ಗುಂಪು ಮತ್ತು ಘನಮೂಲಕ್ಕೆ 3ರ ಗುಂಪು ಮಾಡಿ.',
      quizQ: 'What is the cube of 4?',
      wrongOpt: '12',
      correctOpt: '64',
      explanationEn: '4 × 4 × 4 = 64.'
    };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'textbook', label: 'Textbook & Chapters', icon: BookOpen },
    { id: 'ai', label: 'Ask Vidya AI', icon: Sparkles },
    { id: 'practice', label: 'Adaptive Practice', icon: Brain },
    { id: 'memory', label: 'Memory & Revision', icon: History },
    { id: 'tests', label: 'Tests & Assessments', icon: FileCheck },
    { id: 'progress', label: 'My Learning Progress', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard & Achievements', icon: Trophy },
    { id: 'challenges', label: 'Daily Challenges', icon: Flame },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const completionRate =
    chapters.length > 0
      ? Math.round((completedChapters.length / chapters.length) * 100)
      : 0;
  const overallPerformance = Math.min(
    98,
    Math.max(62, 68 + completedChapters.length * 4)
  );
  const examReadiness = Math.min(
    96,
    Math.max(55, 60 + Math.round(completionRate * 0.35))
  );

  const emulatedStudents = [
    {
      id: 'stu-1',
      name: editableName || userName || 'Kavya R',
      grade: 'Class 8 • Karnataka State Board',
      marksSummary: `${overallPerformance}% (${xp} XP)`,
      completedCount: completedChapters.length,
      totalCount: chapters.length || 14,
      weakArea: weakTopics[0] || activeChapter.titleEn
    },
    {
      id: 'stu-2',
      name: 'Ananya S',
      grade: 'Class 8 • Karnataka State Board',
      marksSummary: '86% (290 XP)',
      completedCount: 5,
      totalCount: chapters.length || 14,
      weakArea: 'Chapter 02: Power Play'
    },
    {
      id: 'stu-3',
      name: 'Rohan K',
      grade: 'Class 8 • Karnataka State Board',
      marksSummary: '79% (260 XP)',
      completedCount: 4,
      totalCount: chapters.length || 14,
      weakArea: 'Chapter 09: The Baudhayana-Pythagoras Theorem'
    }
  ];

  const rosterSource = studentsList.length > 0 ? studentsList : emulatedStudents;

  const activeParentChild =
    rosterSource.find((s) => s.id === parentSelectedChildId) ||
    rosterSource[0];

  const activeEmulatedStudent =
    rosterSource.find((s) => s.id === emulatedStudentId) ||
    rosterSource[0];

  useEffect(() => {
    let active = true;
    Promise.all([
      vidyaBackend.getStudents().catch(() => null),
      vidyaBackend.getAssignments().catch(() => null)
    ]).then(([studentsData, assignmentsData]) => {
      if (!active) return;
      if (Array.isArray(studentsData) && studentsData.length > 0) {
        setStudentsList(studentsData);
      }
      if (Array.isArray(assignmentsData) && assignmentsData.length > 0) {
        setUploadedAssignments(assignmentsData);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentTitle.trim()) return;

    const payload = {
      title: assignmentTitle.trim(),
      studentId: activeEmulatedStudent.id,
      studentName: activeEmulatedStudent.name,
      dueDate: assignmentDueDate || 'Upcoming',
      notes: assignmentNotes.trim() || 'Complete and submit in class.'
    };

    try {
      const saved = await vidyaBackend.createAssignment(payload);
      const itemToAdd = saved?.id ? saved : { ...payload, id: `asg-${Date.now()}` };
      setUploadedAssignments((prev) => [itemToAdd, ...prev]);
      setAssignmentTitle('');
      setAssignmentDueDate('');
      setAssignmentNotes('');
      setAssignmentStatusMsg(
        `Assignment uploaded to ${activeEmulatedStudent.name}'s emulated student account.`
      );
    } catch {
      setAssignmentStatusMsg('Could not reach backend—check server and try again.');
    }
  };

  const handleNavClick = (id) => {
    setNavSection(id);
    setMobileDrawerOpen(false);
    if (id === 'textbook') {
      setExpandedChapterId(activeChapter.id);
    }
  };

  const handleSaveProfileDetails = (e) => {
    e.preventDefault();
    setProfileSavedNotice(
      lang === 'kn' ? 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Profile details updated.'
    );
  };

  const handleCheckDailyChallenge = (e) => {
    e.preventDefault();
    if (dailyAnswer.trim() === '25') {
      setDailyChallengeDone(true);
      setDailyFeedback('Correct! 5² = 25. Daily challenge completed!');
    } else {
      setDailyFeedback('Hint: 5 squared means 5 × 5.');
    }
  };

  const handleSubmitSupport = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportTicketSent(true);
    setSupportMessage('');
  };

  const rootClass = [
    'vs-p3-root',
    `vs-p3-font-${fontSizeMode}`,
    appearanceMode === 'light'
      ? 'vs-p3-theme-light'
      : appearanceMode === 'contrast'
      ? 'vs-p3-theme-contrast'
      : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <div className="vs-p3-orb vs-p3-orb-teal" aria-hidden="true" />
      <div className="vs-p3-orb vs-p3-orb-coral" aria-hidden="true" />

      <aside
        className={`vs-p3-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
          mobileDrawerOpen ? 'mobile-open' : ''
        }`}
      >
        <div>
          <div className="vs-p3-sidebar-top">
            <div className="vs-p3-brand">
              <div className="vs-p3-logo">
                <Sparkles size={20} />
              </div>
              {!sidebarCollapsed && (
                <span className="vs-p3-brand-title">VIDYASETU (ವಿದ್ಯಾಸೇತು)</span>
              )}
            </div>

            <button
              type="button"
              className="vs-p3-collapse-btn"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarCollapsed((c) => !c)}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={17} />
              ) : (
                <PanelLeftClose size={17} />
              )}
            </button>
          </div>

          <nav className="vs-p3-nav-list" aria-label="Dashboard sections">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = navSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`vs-p3-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="vs-p3-sidebar-footer">
          <div className="vs-p3-profile-card">
            <div className="vs-p3-avatar-circle">
              {(editableName || 'S').charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                  {editableName}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {role.toUpperCase()} • {editableSchool}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`vs-p3-nav-btn ${
              navSection === 'profile-panel' ? 'active' : ''
            }`}
            onClick={() => handleNavClick('profile-panel')}
          >
            <UserCheck size={17} />
            {!sidebarCollapsed && <span>My Profile</span>}
          </button>

          <button
            type="button"
            className={`vs-p3-nav-btn ${
              navSection === 'settings-panel' ? 'active' : ''
            }`}
            onClick={() => handleNavClick('settings-panel')}
          >
            <Settings size={17} />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>

      <main className="vs-p3-main">
        <div className="vs-p3-mobile-bar">
          <button
            type="button"
            className="vs-p3-icon-btn"
            onClick={() => setMobileDrawerOpen((o) => !o)}
          >
            <PanelLeftOpen size={18} />
            <span>Menu</span>
          </button>

          <button
            type="button"
            className="vs-p3-icon-btn"
            onClick={() =>
              onChangeLang && onChangeLang(lang === 'kn' ? 'en' : 'kn')
            }
          >
            <Languages size={17} />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Central Greeting Header */}
        <section className="vs-p3-glass vs-p3-greeting-banner">
          <div>
            <h1 className="vs-p3-greeting-title">Hi, {editableName}! 👋</h1>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1.05rem' }}>
              Welcome back to VidyaSetu!
            </p>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Ready to learn something amazing today?
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="vs-p3-icon-btn"
              onClick={() =>
                onChangeLang && onChangeLang(lang === 'kn' ? 'en' : 'kn')
              }
            >
              <Languages size={16} />
              <span>
                {lang === 'kn' ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ'}
              </span>
            </button>
            <div className="vs-p3-hero-badge" aria-hidden="true">
              <Award size={36} />
            </div>
          </div>
        </section>

        {/* 6 Overview Cards */}
        <section className="vs-p3-stats-grid" aria-label="Dashboard overview">
          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Total XP Points
              </span>
              <Award size={19} color="#fde047" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 6 }}>
              {xp} XP
            </div>
          </div>

          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Current Learning Streak
              </span>
              <Flame size={19} color="#fb7185" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 6 }}>
              5 Days
            </div>
          </div>

          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Chapters Completed
              </span>
              <CheckCircle2 size={19} color="#5eead4" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 6 }}>
              {completedChapters.length} / {chapters.length || 14}
            </div>
          </div>

          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Learning Progress
              </span>
              <TrendingUp size={19} color="#93c5fd" />
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 6 }}>
              {completionRate}%
            </div>
            <div className="vs-p3-progress-track">
              <div
                className="vs-p3-progress-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Overall Performance
              </span>
              <Target size={19} color="#f9a8d4" />
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 6 }}>
              {overallPerformance}%
            </div>
            <div className="vs-p3-progress-track">
              <div
                className="vs-p3-progress-fill"
                style={{ width: `${overallPerformance}%` }}
              />
            </div>
          </div>

          <div className="vs-p3-stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, opacity: 0.88 }}>
                Exam Readiness
              </span>
              <Sparkles size={19} color="#fde047" />
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 6 }}>
              {examReadiness}%
            </div>
            <div className="vs-p3-progress-track">
              <div
                className="vs-p3-progress-fill"
                style={{ width: `${examReadiness}%` }}
              />
            </div>
          </div>
        </section>

        {/* Dedicated Sidebar Section Views when non-home tab is chosen */}
        {navSection === 'textbook' && (
          <section className="vs-p3-glass" aria-label="Textbook and Chapters">
            <h2 style={{ marginTop: 0 }}>Textbook & Chapters</h2>
            <p style={{ opacity: 0.9 }}>
              Select a chapter to open its topics and subtopics under each topic.
            </p>
            <div className="vs-p3-chapter-list">
              {chapters.map((ch, idx) => {
                const isOpen = expandedChapterId === ch.id;
                const isDone = completedChapters.includes(ch.id);
                return (
                  <div key={ch.id} className="vs-p3-chapter-row">
                    <button
                      type="button"
                      className="vs-p3-chapter-header"
                      onClick={() => {
                        setExpandedChapterId(isOpen ? null : ch.id);
                        onSelectChapter && onSelectChapter(idx);
                      }}
                    >
                      <span>
                        <strong>
                          {lang === 'kn' ? ch.titleKn : ch.titleEn}
                        </strong>{' '}
                        {isDone ? '• Completed ✓' : ''}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="vs-p3-chapter-body">
                        <p style={{ margin: '0 0 10px' }}>
                          <strong>Overview:</strong>{' '}
                          {lang === 'kn' ? ch.conceptKn : ch.conceptEn}
                        </p>

                        <div className="vs-p3-topic-list">
                          {getChapterTopicTree(ch).map((topic) => {
                            const isTopicOpen = expandedTopicId === topic.id;
                            return (
                              <div key={topic.id} className="vs-p3-topic-card">
                                <button
                                  type="button"
                                  className="vs-p3-topic-header"
                                  onClick={() =>
                                    setExpandedTopicId(
                                      isTopicOpen ? null : topic.id
                                    )
                                  }
                                >
                                  <span>
                                    <strong>
                                      {lang === 'kn'
                                        ? topic.titleKn
                                        : topic.titleEn}
                                    </strong>
                                  </span>
                                  {isTopicOpen ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>

                                {isTopicOpen && topic.subtopics.length > 0 && (
                                  <ul className="vs-p3-subtopic-list">
                                    {topic.subtopics.map((sub) => (
                                      <li
                                        key={sub.id}
                                        className="vs-p3-subtopic-item"
                                      >
                                        {lang === 'kn'
                                          ? sub.titleKn
                                          : sub.titleEn}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            marginTop: 12
                          }}
                        >
                          <button
                            type="button"
                            className="vs-p3-send-btn"
                            onClick={() => {
                              onSelectChapter && onSelectChapter(idx);
                              setNavSection('ai');
                            }}
                          >
                            Ask Vidya AI on this Chapter
                          </button>
                          <button
                            type="button"
                            className="vs-p3-icon-btn"
                            onClick={onMarkChapterDone}
                          >
                            Mark Completed (+40 XP)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {navSection === 'practice' && (
          <section className="vs-p3-glass" aria-label="Adaptive Practice">
            <h2 style={{ marginTop: 0 }}>Adaptive Practice</h2>
            <p style={{ fontWeight: 700 }}>
              Chapter:{' '}
              {lang === 'kn' ? activeChapter.titleKn : activeChapter.titleEn}
            </p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              {activeChapter.quizQ}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={() =>
                  onQuizChoice && onQuizChoice(activeChapter.wrongOpt)
                }
              >
                {activeChapter.wrongOpt}
              </button>
              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={() =>
                  onQuizChoice && onQuizChoice(activeChapter.correctOpt)
                }
              >
                {activeChapter.correctOpt}
              </button>
            </div>
            {quizMsg && (
              <p style={{ marginTop: 12, fontWeight: 700, color: '#fde047' }}>
                {quizMsg}
              </p>
            )}
          </section>
        )}

        {navSection === 'memory' && (
          <section className="vs-p3-glass" aria-label="Memory and Revision">
            <h2 style={{ marginTop: 0 }}>Memory & Revision</h2>
            {mistakes.length === 0 ? (
              <p>No saved mistakes yet. Great job!</p>
            ) : (
              mistakes.map((m) => (
                <div key={m.id} className="vs-p3-subcard">
                  <strong>{m.topic}</strong>
                  <p style={{ margin: '6px 0' }}>Q: {m.question}</p>
                  <p style={{ margin: '4px 0' }}>
                    Your answer: <strong>{m.wrongAnswer}</strong> • Correct:{' '}
                    <strong>{m.correctAnswer}</strong>
                  </p>
                  <p style={{ margin: '4px 0', opacity: 0.9 }}>
                    {lang === 'kn' ? m.hintKn : m.hintEn}
                  </p>
                </div>
              ))
            )}
          </section>
        )}

        {navSection === 'tests' && (
          <section className="vs-p3-glass" aria-label="Tests and Assessments">
            <h2 style={{ marginTop: 0 }}>Tests & Assessments</h2>
            <p>Quick Chapter Assessment — {activeChapter.quizQ}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={() => {
                  setTestSubmitted(true);
                  setTestScoreMsg('Submitted: 0/1 — Review hint and try again.');
                }}
              >
                Answer: {activeChapter.wrongOpt}
              </button>
              <button
                type="button"
                className="vs-p3-send-btn"
                onClick={() => {
                  setTestSubmitted(true);
                  setTestScoreMsg('Submitted: 1/1 (100%) — Great work!');
                }}
              >
                Answer: {activeChapter.correctOpt}
              </button>
            </div>
            {testSubmitted && (
              <p style={{ marginTop: 12, fontWeight: 700, color: '#5eead4' }}>
                {testScoreMsg}
              </p>
            )}
          </section>
        )}

        {navSection === 'progress' && (
          <section className="vs-p3-glass" aria-label="My Learning Progress">
            <h2 style={{ marginTop: 0 }}>My Learning Progress</h2>
            <p>
              <strong>Completed Chapters:</strong> {completedChapters.length} /{' '}
              {chapters.length} ({completionRate}%)
            </p>
            <p>
              <strong>Mastered Topics:</strong>{' '}
              {masteredTopics.length > 0 ? masteredTopics.join(', ') : '—'}
            </p>
            <p>
              <strong>Focus / Weak Topics:</strong>{' '}
              {weakTopics.length > 0 ? weakTopics.join(', ') : 'None right now'}
            </p>
          </section>
        )}

        {navSection === 'parent-portal' && (
          <section className="vs-p3-glass" aria-label="Parent Progress and Marks">
            <h2 style={{ marginTop: 0 }}>Parent Portal — Marks & Progress</h2>
            <p style={{ opacity: 0.9 }}>
              Monitor your child’s marks, completed chapters, and focus areas.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {rosterSource.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={
                    parentSelectedChildId === child.id
                      ? 'vs-p3-send-btn'
                      : 'vs-p3-icon-btn'
                  }
                  onClick={() => setParentSelectedChildId(child.id)}
                >
                  {child.name}
                </button>
              ))}
            </div>

            <div className="vs-p3-subcard">
              <strong>Child:</strong> {activeParentChild.name} ({activeParentChild.grade})
              <p style={{ margin: '6px 0' }}>
                <strong>Marks & XP:</strong> {activeParentChild.marksSummary}
              </p>
              <p style={{ margin: '6px 0' }}>
                <strong>Chapters Completed:</strong> {activeParentChild.completedCount} /{' '}
                {activeParentChild.totalCount}
              </p>
              <p style={{ margin: '6px 0' }}>
                <strong>Needs Attention:</strong> {activeParentChild.weakArea}
              </p>
            </div>
          </section>
        )}

        {navSection === 'teacher-portal' && (
          <section
            className="vs-p3-glass"
            aria-label="Teacher Emulated Student Account and Assignments"
          >
            <h2 style={{ marginTop: 0 }}>
              Teacher Access — Emulated Student & Assignments
            </h2>
            <p style={{ opacity: 0.9 }}>
              Switch into a student’s emulated account view and upload assignments
              directly.
            </p>

            <div style={{ marginBottom: 14 }}>
              <span style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                Emulate Student Account:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {rosterSource.map((stu) => (
                  <button
                    key={stu.id}
                    type="button"
                    className={
                      emulatedStudentId === stu.id
                        ? 'vs-p3-send-btn'
                        : 'vs-p3-icon-btn'
                    }
                    onClick={() => {
                      setEmulatedStudentId(stu.id);
                      setAssignmentStatusMsg('');
                    }}
                  >
                    {stu.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="vs-p3-subcard" style={{ marginBottom: 16 }}>
              <strong>Emulated Student View: {activeEmulatedStudent.name}</strong>
              <p style={{ margin: '6px 0' }}>
                {activeEmulatedStudent.grade} • Marks/Score:{' '}
                <strong>{activeEmulatedStudent.marksSummary}</strong>
              </p>
              <p style={{ margin: '6px 0' }}>
                Progress: {activeEmulatedStudent.completedCount} /{' '}
                {activeEmulatedStudent.totalCount} chapters • Focus Topic:{' '}
                {activeEmulatedStudent.weakArea}
              </p>
            </div>

            <form
              onSubmit={handleUploadAssignment}
              style={{ display: 'grid', gap: 10, maxWidth: 520 }}
            >
              <input
                type="text"
                className="vs-p3-input"
                placeholder="Assignment title (e.g., Chapter 06 Identities Worksheet)"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
              <input
                type="date"
                className="vs-p3-input"
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
              />
              <input
                type="text"
                className="vs-p3-input"
                placeholder="Instructions or questions for the student..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              />
              <div>
                <button type="submit" className="vs-p3-send-btn">
                  Upload Assignment to {activeEmulatedStudent.name}
                </button>
              </div>
            </form>

            {assignmentStatusMsg && (
              <p style={{ marginTop: 10, fontWeight: 700, color: '#5eead4' }}>
                {assignmentStatusMsg}
              </p>
            )}

            <div style={{ marginTop: 18 }}>
              <h3 style={{ margin: '0 0 8px' }}>Uploaded Assignments</h3>
              {uploadedAssignments.map((item) => (
                <div key={item.id} className="vs-p3-subcard">
                  <strong>{item.title}</strong> — <span>For: {item.studentName}</span>
                  <p style={{ margin: '4px 0', fontSize: '0.88rem' }}>
                    Due: {item.dueDate} • {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {navSection === 'leaderboard' && (
          <section className="vs-p3-glass" aria-label="Leaderboard and Achievements">
            <h2 style={{ marginTop: 0 }}>Leaderboard & Achievements</h2>
            <div className="vs-p3-subcard">
              <strong>#1 {editableName} (You)</strong> — {xp} XP • 5-Day Streak
            </div>
            <div className="vs-p3-subcard">
              <strong>#2 Ananya S</strong> — 290 XP • 4-Day Streak
            </div>
            <div className="vs-p3-subcard">
              <strong>#3 Rohan K</strong> — 260 XP • 3-Day Streak
            </div>
          </section>
        )}

        {navSection === 'challenges' && (
          <section className="vs-p3-glass" aria-label="Daily Challenges">
            <h2 style={{ marginTop: 0 }}>Daily Challenges</h2>
            <p style={{ fontWeight: 700 }}>Today’s Challenge: What is 5²?</p>
            <form
              onSubmit={handleCheckDailyChallenge}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
            >
              <input
                type="text"
                className="vs-p3-input"
                placeholder="Type your answer..."
                value={dailyAnswer}
                onChange={(e) => setDailyAnswer(e.target.value)}
              />
              <button type="submit" className="vs-p3-send-btn">
                Check Answer
              </button>
            </form>
            {dailyFeedback && (
              <p
                style={{
                  marginTop: 10,
                  fontWeight: 700,
                  color: dailyChallengeDone ? '#5eead4' : '#fde047'
                }}
              >
                {dailyFeedback}
              </p>
            )}
          </section>
        )}

        {navSection === 'notifications' && (
          <section className="vs-p3-glass" aria-label="Notifications">
            <h2 style={{ marginTop: 0 }}>Notifications</h2>
            <div className="vs-p3-subcard">
              <strong>5-Day Streak Active:</strong> Keep going to unlock your next
              milestone badge.
            </div>
            <div className="vs-p3-subcard">
              <strong>Revision Reminder:</strong> Practice{' '}
              {weakTopics[0] || activeChapter.titleEn} for 10 minutes today.
            </div>
          </section>
        )}

        {navSection === 'accessibility' && (
          <section className="vs-p3-glass" aria-label="Accessibility">
            <h2 style={{ marginTop: 0 }}>Accessibility</h2>
            <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
              <div>
                <span style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  Text Size
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    ['sm', 'Small'],
                    ['md', 'Medium'],
                    ['lg', 'Large']
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      className="vs-p3-icon-btn"
                      onClick={() => setFontSizeMode(val)}
                    >
                      {lbl} {fontSizeMode === val ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={screenReaderTips}
                  onChange={(e) => setScreenReaderTips(e.target.checked)}
                />
                <span>Clear labels & keyboard-friendly controls enabled</span>
              </label>
            </div>
          </section>
        )}

        {navSection === 'help' && (
          <section className="vs-p3-glass" aria-label="Help and Support">
            <h2 style={{ marginTop: 0 }}>Help & Support</h2>
            <p>
              Need help with chapters, voice questions, or photo uploads? Send a
              note below.
            </p>
            <form
              onSubmit={handleSubmitSupport}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
            >
              <input
                type="text"
                className="vs-p3-input"
                style={{ flex: 1, minWidth: 220 }}
                placeholder="Describe your question or issue..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
              <button type="submit" className="vs-p3-send-btn">
                Send Help Request
              </button>
            </form>
            {supportTicketSent && (
              <p style={{ marginTop: 10, fontWeight: 700, color: '#5eead4' }}>
                Help request received.
              </p>
            )}
          </section>
        )}

        {navSection === 'profile-panel' && (
          <section className="vs-p3-glass">
            <h2 style={{ marginTop: 0 }}>My Profile</h2>
            <form onSubmit={handleSaveProfileDetails}>
              <div style={{ display: 'grid', gap: 12, maxWidth: 460 }}>
                <label>
                  Student Name
                  <input
                    type="text"
                    className="vs-p3-input"
                    style={{ width: '100%', marginTop: 6 }}
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                  />
                </label>
                <label>
                  School / Board
                  <input
                    type="text"
                    className="vs-p3-input"
                    style={{ width: '100%', marginTop: 6 }}
                    value={editableSchool}
                    onChange={(e) => setEditableSchool(e.target.value)}
                  />
                </label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="submit" className="vs-p3-send-btn">
                    Save Changes
                  </button>
                  {onGoToProfile && (
                    <button
                      type="button"
                      className="vs-p3-icon-btn"
                      onClick={onGoToProfile}
                    >
                      Full Profile Setup
                    </button>
                  )}
                </div>
              </div>
              {profileSavedNotice && (
                <p style={{ marginTop: 10, color: '#5eead4', fontWeight: 700 }}>
                  {profileSavedNotice}
                </p>
              )}
            </form>
          </section>
        )}

        {navSection === 'settings-panel' && (
          <section className="vs-p3-glass">
            <h2 style={{ marginTop: 0 }}>Settings</h2>
            <div style={{ display: 'grid', gap: 14, maxWidth: 520 }}>
              <div>
                <span style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  Language: Kannada / English
                </span>
                <button
                  type="button"
                  className="vs-p3-icon-btn"
                  onClick={() =>
                    onChangeLang && onChangeLang(lang === 'kn' ? 'en' : 'kn')
                  }
                >
                  Current: {lang === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'} —
                  Switch
                </button>
              </div>

              <div>
                <span style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  Font Size: Small / Medium / Large
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    ['sm', 'Small'],
                    ['md', 'Medium'],
                    ['lg', 'Large']
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      className="vs-p3-icon-btn"
                      onClick={() => setFontSizeMode(val)}
                    >
                      {lbl} {fontSizeMode === val ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  Appearance: Light Mode / Dark Mode / High Contrast
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    ['light', 'Light Mode'],
                    ['glass', 'Dark Mode'],
                    ['contrast', 'High Contrast']
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      className="vs-p3-icon-btn"
                      onClick={() => setAppearanceMode(val)}
                    >
                      {lbl} {appearanceMode === val ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span>Sound preferences</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                <span>Notification preferences</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={privacyShareProgress}
                  onChange={(e) => setPrivacyShareProgress(e.target.checked)}
                />
                <span>
                  Privacy settings (share learning summary with mentor/parent)
                </span>
              </label>

              {onGoToWelcome && (
                <div>
                  <button
                    type="button"
                    className="vs-p3-icon-btn"
                    onClick={onGoToWelcome}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Central Ask Vidya AI Workspace (shown on Home and Ask Vidya AI) */}
        {(navSection === 'home' || navSection === 'ai') && (
          <section className="vs-p3-ai-workspace" aria-label="Ask Vidya AI">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800 }}>
                  Ask Vidya AI
                </h2>
                <p style={{ margin: 0, opacity: 0.88 }}>
                  Your personal learning companion.
                </p>
              </div>
              <span className="vs-p3-pill-tag">
                {lang === 'kn' ? activeChapter.titleKn : activeChapter.titleEn}
              </span>
            </div>

            <div className="vs-p3-chat-box">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`vs-p3-bubble ${
                    msg.sender === 'ai' ? 'vs-p3-bubble-ai' : 'vs-p3-bubble-user'
                  }`}
                >
                  <strong>{msg.sender === 'ai' ? 'Vidya AI: ' : 'You: '}</strong>
                  <span>{lang === 'kn' ? msg.textKn : msg.textEn}</span>
                </div>
              ))}
            </div>

            <form className="vs-p3-input-bar" onSubmit={onSendChat}>
              <input
                type="text"
                className="vs-p3-input"
                style={{ flex: 1, minWidth: 220 }}
                value={chatInput}
                onChange={(e) =>
                  onChatInputChange && onChatInputChange(e.target.value)
                }
                placeholder={
                  lang === 'kn'
                    ? 'ನಿಮ್ಮ ಗಣಿತದ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ...'
                    : 'Type your Mathematics question...'
                }
              />

              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={onVoiceInput}
                title="Ask using voice"
              >
                <Mic size={17} />
                <span>Voice</span>
              </button>

              <label
                className="vs-p3-icon-btn"
                title="Upload a photo of a Mathematics question"
              >
                <ImagePlus size={17} />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={onPhotoUpload}
                />
              </label>

              <button type="submit" className="vs-p3-send-btn">
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>

            {uploadedPhotoName && (
              <p style={{ margin: '8px 0 0', fontSize: '0.84rem' }}>
                Attached image: <strong>{uploadedPhotoName}</strong>
              </p>
            )}
            {voiceStatus && (
              <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: '#fde047' }}>
                {voiceStatus}
              </p>
            )}
          </section>
        )}

        {/* Learning Content Cards on Home ("My Mathematics Chapters" removed) */}
        {navSection === 'home' && (
          <section className="vs-p3-learning-grid" aria-label="Learning modules">
            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Continue Learning</span>
              <h3 style={{ margin: '0 0 8px' }}>
                {lang === 'kn' ? activeChapter.titleKn : activeChapter.titleEn}
              </h3>
              <p style={{ margin: '0 0 12px', opacity: 0.9 }}>
                {lang === 'kn'
                  ? activeChapter.conceptKn
                  : activeChapter.conceptEn}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vs-p3-icon-btn"
                  onClick={onMarkChapterDone}
                >
                  Mark Complete (+40 XP)
                </button>
              </div>
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Adaptive Practice</span>
              <h3 style={{ margin: '0 0 8px' }}>{activeChapter.quizQ}</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vs-p3-icon-btn"
                  onClick={() =>
                    onQuizChoice && onQuizChoice(activeChapter.wrongOpt)
                  }
                >
                  {activeChapter.wrongOpt}
                </button>
                <button
                  type="button"
                  className="vs-p3-icon-btn"
                  onClick={() =>
                    onQuizChoice && onQuizChoice(activeChapter.correctOpt)
                  }
                >
                  {activeChapter.correctOpt}
                </button>
              </div>
              {quizMsg && (
                <p style={{ margin: '10px 0 0', fontWeight: 700, color: '#fde047' }}>
                  {quizMsg}
                </p>
              )}
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Recently Asked Questions</span>
              <h3 style={{ margin: '0 0 8px' }}>Latest Activity</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                {chatMessages.length > 1
                  ? lang === 'kn'
                    ? chatMessages[chatMessages.length - 1].textKn
                    : chatMessages[chatMessages.length - 1].textEn
                  : 'Ask a question above to see your latest learning thread here.'}
              </p>
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Weak Topics</span>
              <h3 style={{ margin: '0 0 8px' }}>Focus Areas</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                {weakTopics.length > 0
                  ? weakTopics.join(', ')
                  : 'No weak topics flagged yet — keep practising!'}
              </p>
              {mistakes.length > 0 && (
                <p style={{ margin: '8px 0 0', fontSize: '0.84rem', opacity: 0.85 }}>
                  Logged mistakes: {mistakes.length} • Mastered:{' '}
                  {masteredTopics.length}
                </p>
              )}
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Recommended Revision</span>
              <h3 style={{ margin: '0 0 8px' }}>Next Smart Step</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                {lang === 'kn' ? activeChapter.hintKn : activeChapter.hintEn}
              </p>
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Parent Access</span>
              <h3 style={{ margin: '0 0 8px' }}>Child Marks & Progress</h3>
              <p style={{ margin: '0 0 10px', opacity: 0.9 }}>
                Current score & XP: {activeParentChild.marksSummary} •{' '}
                {activeParentChild.completedCount}/{activeParentChild.totalCount}{' '}
                chapters done.
              </p>
              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={() => setNavSection('parent-portal')}
              >
                Open Parent View
              </button>
            </div>

            <div className="vs-p3-glass">
              <span className="vs-p3-pill-tag">Teacher Access</span>
              <h3 style={{ margin: '0 0 8px' }}>
                Emulated Student & Assignments
              </h3>
              <p style={{ margin: '0 0 10px', opacity: 0.9 }}>
                Active emulated student: {activeEmulatedStudent.name} (
                {uploadedAssignments.length} assignments).
              </p>
              <button
                type="button"
                className="vs-p3-icon-btn"
                onClick={() => setNavSection('teacher-portal')}
              >
                Open Teacher View
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}