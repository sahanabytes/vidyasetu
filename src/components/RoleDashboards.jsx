import React from "react";
import { Users, HeartHandshake, Building2, Volume2 } from "lucide-react";

export function TeacherDashboard({ lang, student, mistakeLogs }) {
  const isKn = lang === "kn";
  const studentName = isKn ? student.nameKn : student.nameEn;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
        <Users className="w-5 h-5 text-indigo-600" />
        <span>{isKn ? "ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (10ನೇ ಗಣಿತ)" : "Teacher Dashboard (Class 10 Maths)"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-50 border">
          <div className="text-xs text-slate-500">{isKn ? "ಸಕ್ರಿಯ ವಿದ್ಯಾರ್ಥಿಗಳು" : "Active Students"}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">42 / 45</div>
        </div>
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
          <div className="text-xs text-amber-800">{isKn ? "ಗಮನಹರಿಸಬೇಕಾದ ವಿದ್ಯಾರ್ಥಿ" : "At-Risk Student"}</div>
          <div className="text-lg font-bold text-amber-950 mt-1">
            {studentName} ({student.examReadiness}%)
          </div>
        </div>
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
          <div className="text-xs text-rose-800">{isKn ? "ದಾಖಲಾದ ತಪ್ಪುಗಳು" : "Logged Mistake Gaps"}</div>
          <div className="text-2xl font-bold text-rose-950 mt-1">{mistakeLogs.length}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-slate-800 mb-2">
          {isKn ? "ಸಾಮಾನ್ಯ ತರಗತಿ ತಪ್ಪುಗಳು" : "Common Class Mistakes"}
        </h3>
        {mistakeLogs.length === 0 ? (
          <p className="text-sm text-slate-500">
            {isKn ? "ಇದುವರೆಗೆ ಯಾವುದೇ ತಪ್ಪು ದಾಖಲಾಗಿಲ್ಲ." : "No mistakes recorded yet."}
          </p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            {mistakeLogs.map((m) => (
              <li key={m.id}>
                <strong>{m.rootCauseTag}</strong> — {m.topicTitle}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ParentDashboard({ lang, student, mistakeLogs }) {
  const isKn = lang === "kn";
  const studentName = isKn ? student.nameKn : student.nameEn;

  const playAudioSummary = () => {
    const summary = isKn
      ? `${studentName} ಅವರ ಗಣಿತ ಕಲಿಕೆ ${student.xp} XP ಮತ್ತು ${student.streakDays} ದಿನಗಳ ಸ್ಟ್ರೀಕ್ ಹೊಂದಿದೆ. ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ ${student.examReadiness}% ಇದೆ.`
      : `${studentName} has earned ${student.xp} XP with a ${student.streakDays}-day streak and ${student.examReadiness}% exam readiness in Class 10 Maths.`;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(summary);
      u.lang = isKn ? "kn-IN" : "en-IN";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <span>{isKn ? "ಪೋಷಕರ ವರದಿ" : "Parent Dashboard"}</span>
        </div>
        <button
          onClick={playAudioSummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
        >
          <Volume2 className="w-4 h-4" />
          {isKn ? "ಆಡಿಯೋ ವರದಿ ಕೇಳಿ" : "Play Audio Summary"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="p-3 rounded-lg bg-slate-50 border">
          <div className="text-xs text-slate-500">{isKn ? "ವಿದ್ಯಾರ್ಥಿ" : "Student"}</div>
          <div className="font-bold mt-1">{studentName}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border">
          <div className="text-xs text-slate-500">{isKn ? "ಒಟ್ಟು XP" : "Total XP"}</div>
          <div className="font-bold mt-1">{student.xp} XP</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border">
          <div className="text-xs text-slate-500">{isKn ? "ಸ್ಟ್ರೀಕ್" : "Streak"}</div>
          <div className="font-bold mt-1">
            {student.streakDays} {isKn ? "ದಿನ" : "days"}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border">
          <div className="text-xs text-slate-500">{isKn ? "ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ" : "Readiness"}</div>
          <div className="font-bold mt-1">{student.examReadiness}%</div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-950">
        <strong>{isKn ? "ಗಮನಿಸಬೇಕಾದ ಅಂಶ: " : "Focus Alert: "}</strong>
        {mistakeLogs.length > 0
          ? isKn
            ? `${mistakeLogs[0].rootCauseTag} ವಿಷಯದಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಭ್ಯಾಸ ಅಗತ್ಯವಿದೆ.`
            : `Needs extra practice on ${mistakeLogs[0].rootCauseTag}.`
          : isKn
          ? "ಈ ವಾರದ ಅಭ್ಯಾಸ ಉತ್ತಮವಾಗಿದೆ."
          : "Steady progress this week."}
      </div>
    </div>
  );
}

export function NgoDashboard({ lang }) {
  const isKn = lang === "kn";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
        <Building2 className="w-5 h-5 text-purple-600" />
        <span>{isKn ? "NGO / CSR / ಸರ್ಕಾರಿ ಪ್ರಭಾವ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" : "NGO / CSR / Govt Impact Dashboard"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-xs text-purple-800">{isKn ? "ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳು" : "Partner Schools"}</div>
          <div className="text-2xl font-bold text-purple-950 mt-1">
            28 {isKn ? "ಶಾಲೆಗಳು" : "Schools"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
          <div className="text-xs text-indigo-800">{isKn ? "IVR + SMS + QR ಬಳಕೆದಾರರು" : "Last-Mile Learners"}</div>
          <div className="text-2xl font-bold text-indigo-950 mt-1">1,420</div>
        </div>
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-800">{isKn ? "ಗಣಿತ ಅಂಕ ಏರಿಕೆ" : "Avg Maths Score Lift"}</div>
          <div className="text-2xl font-bold text-emerald-950 mt-1">+19.4%</div>
        </div>
      </div>
    </div>
  );
}