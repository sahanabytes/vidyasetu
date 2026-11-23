import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, Mic, Volume2, Image as ImageIcon, AlertCircle } from "lucide-react";

export default function TextbookAndTutor({
  lang,
  isOnline,
  chapters,
  selectedTopic,
  onSelectTopic,
  lowDataMode,
  onEarnXp,
  onQueueOfflineEvent
}) {
  const isKn = lang === "kn";
  const [confusedMode, setConfusedMode] = useState(false);
  const [doubtInput, setDoubtInput] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    setChatHistory([
      {
        sender: "tutor",
        text: isKn ? selectedTopic.tutorGreetingKn : selectedTopic.tutorGreetingEn
      }
    ]);
  }, [selectedTopic.id, isKn]);

  const speakText = (text) => {
    if (lowDataMode || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isKn ? "kn-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceDoubt = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDoubtInput(
        isKn
          ? "ಈ ಸಮೀಕರಣದಲ್ಲಿ a ಮತ್ತು b ಬೆಲೆ ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?"
          : "How do I find a and b in this equation step by step?"
      );
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isKn ? "kn-IN" : "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDoubtInput(transcript);
    };
    recognition.start();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      setDoubtInput((prev) =>
        prev
          ? prev
          : isKn
          ? `ಫೋಟೋ ಪ್ರಶ್ನೆ (${file.name}): ಇದನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಬಿಡಿಸುವುದು ಹೇಗೆ?`
          : `Photo question (${file.name}): How do I solve this step by step?`
      );
    }
  };

  const handleAskDoubt = (e) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;

    const studentMsg = { sender: "student", text: doubtInput.trim() };
    const hint = isKn ? selectedTopic.tutorReplyHintKn : selectedTopic.tutorReplyHintEn;
    const analogy = isKn ? selectedTopic.analogyKn : selectedTopic.analogyEn;
    const simpleAnalogy = isKn ? selectedTopic.simpleAnalogyKn : selectedTopic.simpleAnalogyEn;

    const replyText = confusedMode
      ? isKn
        ? `ಗಾಬರಿಯಾಗಬೇಡಿ! ಸುಲಭ ಉದಾಹರಣೆ: ${simpleAnalogy} ಈಗ ಮೊದಲ ಹೆಜ್ಜೆ ಹೇಳಿ: ${hint}`
        : `No worries! Let's keep it simple: ${simpleAnalogy} First step: ${hint}`
      : isKn
      ? `${hint} (ಉದಾಹರಣೆ: ${analogy})`
      : `${hint} (Analogy: ${analogy})`;

    setChatHistory((prev) => [
      ...prev,
      studentMsg,
      {
        sender: "tutor",
        text: replyText,
        modeTag: !isOnline || lowDataMode ? (isKn ? "ಆಫ್‌ಲೈನ್ ಸುಳಿವು" : "Offline Hint Bank") : null
      }
    ]);

    if (!isOnline) {
      onQueueOfflineEvent(`Doubt queued for sync: "${doubtInput.trim()}"`);
    }

    setDoubtInput("");
    setUploadedImageName("");
    onEarnXp(15, isKn ? "ಸಂದೇಹ ಸುಳಿವು" : "Socratic Hint");
    speakText(replyText);
  };

  const keyConcept = isKn ? selectedTopic.keyConceptKn : selectedTopic.keyConceptEn;
  const explanation = confusedMode
    ? isKn
      ? selectedTopic.simpleAnalogyKn
      : selectedTopic.simpleAnalogyEn
    : isKn
    ? selectedTopic.explanationKn
    : selectedTopic.explanationEn;
  const analogy = confusedMode
    ? isKn
      ? selectedTopic.simpleAnalogyKn
      : selectedTopic.simpleAnalogyEn
    : isKn
    ? selectedTopic.analogyKn
    : selectedTopic.analogyEn;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Chapter & Topic Tree */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-indigo-900 mb-3">
          <BookOpen className="w-5 h-5" />
          <span>{isKn ? "10ನೇ ತರಗತಿ ಗಣಿತ ಪಠ್ಯಪುಸ್ತಕ" : "Class 10 Maths Textbook"}</span>
        </div>

        <div className="space-y-4">
          {chapters.map((ch) => (
            <div key={ch.id} className="border-t pt-3 first:border-t-0 first:pt-0">
              <div className="text-xs font-medium text-indigo-600">{isKn ? ch.codeKn : ch.codeEn}</div>
              <div className="font-semibold text-sm text-slate-800 mb-2">
                {isKn ? `${ch.titleKn} (${ch.titleEn})` : `${ch.titleEn} (${ch.titleKn})`}
              </div>
              <div className="space-y-1.5">
                {ch.topics.map((topic) => {
                  const active = topic.id === selectedTopic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(topic)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        active
                          ? "bg-indigo-600 text-white font-medium"
                          : "bg-slate-50 hover:bg-indigo-50 text-slate-700"
                      }`}
                    >
                      {isKn ? topic.titleKn : topic.titleEn}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Textbook Concept Card + Socratic Tutor */}
      <div className="lg:col-span-8 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {isKn ? selectedTopic.titleKn : selectedTopic.titleEn}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfusedMode((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  confusedMode
                    ? "bg-amber-100 border-amber-400 text-amber-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {confusedMode
                  ? isKn
                    ? "ಸುಲಭ ಮೋಡ್ ಚಾಲ್ತಿ"
                    : "Simple Mode ON"
                  : isKn
                  ? "ನನಗೆ ಗೊಂದಲವಿದೆ"
                  : "I'm Confused"}
              </button>
              <button
                onClick={() => speakText(explanation)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {isKn ? "ಕೇಳಿ" : "Listen"}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg mb-3">
            <div className="text-xs font-semibold text-amber-800 uppercase">
              {isKn ? "ಮುಖ್ಯ ಪರಿಕಲ್ಪನೆ" : "Key Concept"}
            </div>
            <p className="text-sm font-medium text-slate-900 mt-1">{keyConcept}</p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mb-3">{explanation}</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-950">
            <span className="font-semibold">
              {isKn ? "ಸ್ಥಳೀಯ ಉದಾಹರಣೆ: " : "Real-Life Analogy: "}
            </span>
            {analogy}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>
                {isKn
                  ? "AI ವೈಯಕ್ತಿಕ ಗಣಿತ ಶಿಕ್ಷಕ (Socratic Tutor)"
                  : "AI Personal Maths Tutor (Socratic Mode)"}
              </span>
            </div>
            {(!isOnline || lowDataMode) && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                {isKn ? "ಆಫ್‌ಲೈನ್ ಸುಳಿವು ಮೋಡ್" : "Offline Hint Fallback"}
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-sm max-w-[88%] ${
                  msg.sender === "tutor"
                    ? "bg-white border border-slate-200 text-slate-800"
                    : "bg-indigo-600 text-white ml-auto"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] opacity-75 mb-1 font-semibold">
                  <span>
                    {msg.sender === "tutor"
                      ? isKn
                        ? "ವಿದ್ಯಾಸೇತು ಶಿಕ್ಷಕ"
                        : "VidyaSetu Tutor"
                      : isKn
                      ? "ನೀವು"
                      : "You"}
                  </span>
                  {msg.modeTag && <span>{msg.modeTag}</span>}
                </div>
                {msg.text}
              </div>
            ))}
          </div>

          {uploadedImageName && (
            <div className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded mb-2">
              {isKn ? "ಸೇರಿಸಿದ ಫೋಟೋ: " : "Attached photo: "}
              {uploadedImageName}
            </div>
          )}

          <form onSubmit={handleAskDoubt} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={doubtInput}
              onChange={(e) => setDoubtInput(e.target.value)}
              placeholder={
                isKn
                  ? "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಗಣಿತ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ..."
                  : "Type your Class 10 Maths question in Kannada or English..."
              }
              className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleVoiceDoubt}
              title="Voice Input"
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              <Mic className="w-4 h-4" />
            </button>
            <label
              title="Upload Photo"
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center"
            >
              <ImageIcon className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
            >
              {isKn ? "ಸುಳಿವು ಕೇಳಿ" : "Get Hint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}