import React, { useState } from "react";
import { CheckCircle2, XCircle, Brain, RotateCcw } from "lucide-react";

export default function AdaptivePractice({
  lang,
  selectedTopic,
  mistakeLogs,
  onRecordMistake,
  onRecordSuccess
}) {
  const isKn = lang === "kn";
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState("Standard");

  const questions = selectedTopic.quiz || [];
  const currentQ = questions[qIndex] || questions[0];

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    const remedialTip = isKn ? currentQ.remedialTipKn : currentQ.remedialTipEn;

    if (isCorrect) {
      setFeedback({
        ok: true,
        message: isKn ? "ಸರಿಯಾದ ಉತ್ತರ! ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗೋಣ." : "Correct! Moving to stronger practice."
      });
      setDifficultyLevel("Challenge+");
      onRecordSuccess(selectedTopic.id, 25);
    } else {
      setFeedback({
        ok: false,
        message: isKn
          ? `ತಪ್ಪಾಗಿದೆ. ಮೂಲ ಕಾರಣ: ${currentQ.rootCauseTag}`
          : `Incorrect. Root Cause: ${currentQ.rootCauseTag}`,
        remedial: remedialTip
      });
      setDifficultyLevel("Remedial / Foundation");
      onRecordMistake({
        id: Date.now(),
        topicId: selectedTopic.id,
        topicTitle: isKn ? selectedTopic.titleKn : selectedTopic.titleEn,
        rootCauseTag: currentQ.rootCauseTag,
        remedialTip
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    if (questions.length > 0) {
      setQIndex((prev) => (prev + 1) % questions.length);
    }
  };

  const questionText = currentQ ? (isKn ? currentQ.questionKn : currentQ.questionEn) : "";
  const options = currentQ ? (isKn ? currentQ.optionsKn : currentQ.optionsEn) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase text-indigo-600">
              {isKn ? "ಹೊಂದಾಣಿಕೆ ಅಭ್ಯಾಸ" : "Adaptive Practice"}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {isKn ? selectedTopic.titleKn : selectedTopic.titleEn}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {difficultyLevel}
          </span>
        </div>

        {currentQ ? (
          <>
            <p className="font-medium text-slate-800 mb-4">{questionText}</p>
            <div className="space-y-2.5 mb-4">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${
                    selectedOption === idx
                      ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-950"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-slate-300 text-white text-sm font-medium"
              >
                {isKn ? "ಉತ್ತರ ಪರಿಶೀಲಿಸಿ" : "Check Answer"}
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                {isKn ? "ಮುಂದಿನ ಪ್ರಶ್ನೆ" : "Next Question"}
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-4 rounded-lg border text-sm ${
                  feedback.ok
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {feedback.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{feedback.message}</span>
                </div>
                {feedback.remedial && (
                  <p className="mt-2 text-xs leading-relaxed">
                    <strong>{isKn ? "ಪರಿಹಾರ ಪಾಠ: " : "Remedial Tip: "}</strong>
                    {feedback.remedial}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500">No questions available.</p>
        )}
      </div>

      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
          <Brain className="w-5 h-5 text-rose-600" />
          <span>{isKn ? "ಕಲಿಕಾ ನೆನಪು & ತಪ್ಪುಗಳ ಪಟ್ಟಿ" : "Learning Memory & Mistake Log"}</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {isKn
            ? "ಪುನರಾವರ್ತಿತ ತಪ್ಪುಗಳನ್ನು ಗುರುತಿಸಿ ಪರೀಕ್ಷೆಗೆ ಮೊದಲು ಪರಿಷ್ಕರಣೆಗೆ ಇಡಲಾಗುತ್ತದೆ."
            : "Tracks recurring errors and root causes so weak concepts get revisited before exams."}
        </p>

        {mistakeLogs.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
            {isKn
              ? "ಇನ್ನೂ ತಪ್ಪು ದಾಖಲಾಗಿಲ್ಲ. ಒಂದು ಪ್ರಶ್ನೆಗೆ ತಪ್ಪು ಉತ್ತರ ನೀಡಿ Gap Detection ನೋಡಿ."
              : "No mistakes logged yet. Try an incorrect answer to see root-cause gap detection."}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {mistakeLogs.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                <div className="font-semibold text-rose-900">{item.rootCauseTag}</div>
                <div className="text-slate-700 mt-0.5">{item.topicTitle}</div>
                <div className="text-slate-600 mt-1">{item.remedialTip}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}