export const SIDEBAR_ITEMS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "textbooks", label: "Textbook & Chapters", icon: "📖" },
  { id: "ask-ai", label: "Ask Vidya AI", icon: "✨" },
  { id: "adaptive-practice", label: "Adaptive Practice", icon: "🎯" },
  { id: "memory-revision", label: "Memory & Revision", icon: "🧠" },
  { id: "tests", label: "Tests & Assessments", icon: "📝" },
  { id: "progress", label: "My Learning Progress", icon: "📈" },
  { id: "leaderboard", label: "Leaderboard & Achievements", icon: "🏆" },
  { id: "challenges", label: "Daily Challenges", icon: "⚡" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
];

export const TEXTBOOK_CHAPTERS = [
  {
    id: "ch-01",
    number: "Chapter 01",
    title: "Rational Numbers",
    status: "Completed",
    topics: [
      { id: "t-1-1", title: "Properties of Rational Numbers", duration: "18 mins", done: true },
      { id: "t-1-2", title: "Representation on Number Line", duration: "15 mins", done: true },
      { id: "t-1-3", title: "Rational Numbers Between Two Numbers", duration: "20 mins", done: true },
    ],
  },
  {
    id: "ch-02",
    number: "Chapter 02",
    title: "Power Play (Exponents & Powers)",
    status: "In Progress",
    topics: [
      { id: "t-2-1", title: "Exponents & Base Notation", duration: "15 mins", done: true },
      { id: "t-2-2", title: "Laws of Exponents (Product, Quotient, Power)", duration: "25 mins", done: false },
      { id: "t-2-3", title: "Scientific Notation & Standard Form", duration: "20 mins", done: false },
      { id: "t-2-4", title: "Word Problems Involving Powers", duration: "22 mins", done: false },
    ],
  },
  {
    id: "ch-03",
    number: "Chapter 03",
    title: "Linear Equations in One Variable",
    status: "Not Started",
    topics: [
      { id: "t-3-1", title: "Solving Equations with Variable on One Side", duration: "20 mins", done: false },
      { id: "t-3-2", title: "Equations Reducible to Linear Form", duration: "25 mins", done: false },
    ],
  },
  {
    id: "ch-04",
    number: "Chapter 04",
    title: "Understanding Quadrilaterals",
    status: "Focus Area",
    topics: [
      { id: "t-4-1", title: "Polygons & Angle Sum Property", duration: "18 mins", done: false },
      { id: "t-4-2", title: "Parallelograms, Rhombus, Rectangle & Square", duration: "28 mins", done: false },
    ],
  },
];