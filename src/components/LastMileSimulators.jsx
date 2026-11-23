import React, { useState } from "react";
import { PhoneCall, MessageSquare, QrCode } from "lucide-react";

export default function LastMileSimulators({ lang, selectedTopic, onEarnXp }) {
  const isKn = lang === "kn";

  const [ivrStatus, setIvrStatus] = useState(
    isKn
      ? "ಟೋಲ್-ಫ್ರೀ 1800-XXX-VIDYA ಸಂಪರ್ಕವಾಗಿದೆ. ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು 1 ಅಥವಾ ಸುಳಿವುಗಾಗಿ 2 ಒತ್ತಿ."
      : "Toll-free 1800-XXX-VIDYA connected. Press 1 to answer or 2 for a hint."
  );

  const [smsReply, setSmsReply] = useState("");
  const [smsLog, setSmsLog] = useState([
    {
      from: "VidyaSetu SMS",
      text: isKn
        ? "10ನೇ ಗಣಿತ ಪ್ರಶ್ನೆ: 2x² - 7x + 3 = 0 ನಲ್ಲಿ b ಬೆಲೆ ಎಷ್ಟು? -7 ಎಂದು ಕಳುಹಿಸಿ."
        : "Class 10 Maths SMS: In 2x² - 7x + 3 = 0, what is b? Reply with your answer."
    }
  ]);

  const [qrScanned, setQrScanned] = useState(false);

  const pressKey = (key) => {
    if (key === "1") {
      setIvrStatus(
        isKn
          ? "1 ಒತ್ತಿದ್ದೀರಿ: ಉತ್ತರ ದಾಖಲಾಗಿದೆ! ಮುಂದಿನ ಪ್ರಶ್ನೆಗಾಗಿ 3 ಒತ್ತಿ."
          : "Key 1 pressed: Answer recorded! Press 3 for next question."
      );
      onEarnXp(10, "IVR Keypad");
    } else if (key === "2") {
      setIvrStatus(isKn ? selectedTopic.tutorReplyHintKn : selectedTopic.tutorReplyHintEn);
    } else {
      setIvrStatus(
        isKn ? `ಕೀ '${key}' ಒತ್ತಲಾಗಿದೆ — ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯವಾಗಿದೆ.` : `Key '${key}' pressed — audio guide active.`
      );
    }
  };

  const sendSms = (e) => {
    e.preventDefault();
    if (!smsReply.trim()) return;
    const userText = smsReply.trim();
    const botReply =
      userText.includes("-7") || userText.toLowerCase().includes("a")
        ? isKn
          ? "ಸರಿ ಉತ್ತರ! b = -7. ನಾಳೆಯ ಪ್ರಶ್ನೆಗೆ ಸಿದ್ಧರಾಗಿ."
          : "Correct! b = -7. Ready for tomorrow's practice SMS."
        : isKn
        ? "ಪ್ರಯತ್ನಿಸಿ! 2x² - 7x + 3 = 0 ಸಮೀಕರಣದಲ್ಲಿ x ನ ಜೊತೆ -7 ಇದೆ."
        : "Try again! In 2x² - 7x + 3 = 0, the coefficient with x is -7.";

    setSmsLog((prev) => [
      ...prev,
      { from: isKn ? "ವಿದ್ಯಾರ್ಥಿ" : "Student", text: userText },
      { from: "VidyaSetu SMS", text: botReply }
    ]);
    setSmsReply("");
    onEarnXp(10, "SMS Practice");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
          <PhoneCall className="w-4 h-4 text-indigo-600" />
          <span>{isKn ? "Toll-Free IVR (ಫೀಚರ್ ಫೋನ್)" : "Toll-Free IVR (Feature Phone)"}</span>
        </div>
        <p className="text-xs bg-slate-100 p-3 rounded-lg text-slate-800 mb-3">{ivrStatus}</p>
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
            <button
              key={k}
              onClick={() => pressKey(k)}
              className="py-2 rounded-lg border border-slate-300 hover:bg-indigo-50 font-semibold text-sm"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isKn ? "SMS & WhatsApp ಬಾಟ್" : "SMS & WhatsApp Bot"}</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 p-2.5 rounded-lg mb-3 text-xs">
            {smsLog.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.from.startsWith("VidyaSetu") ? "bg-white border" : "bg-emerald-600 text-white ml-4"
                }`}
              >
                <div className="font-semibold opacity-75">{m.from}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={sendSms} className="flex gap-1.5">
          <input
            type="text"
            value={smsReply}
            onChange={(e) => setSmsReply(e.target.value)}
            placeholder={isKn ? "-7 ಎಂದು ಬರೆಯಿರಿ..." : "Type -7..."}
            className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
          />
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium">
            {isKn ? "ಕಳುಹಿಸಿ" : "Send"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
          <QrCode className="w-4 h-4 text-amber-600" />
          <span>{isKn ? "Workbook + QR ಕಲಿಕೆ" : "Workbook + QR Learning"}</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {isKn
            ? "ಮುದ್ರಿತ ವರ್ಕ್‌ಬುಕ್ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದಾಗ ನೇರ ವಿವರಣೆ ತೆರೆಯುತ್ತದೆ:"
            : "Scan the printed workbook QR code to open instant topic explanation & analogy:"}
        </p>
        <div className="border border-dashed border-slate-400 rounded-lg p-3 text-center bg-slate-50">
          <div className="text-xs font-mono font-bold text-slate-800 mb-2">
            [{selectedTopic.qrCodeLabel}]
          </div>
          <button
            onClick={() => {
              setQrScanned(true);
              onEarnXp(10, "QR Scan");
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
          >
            {isKn ? "QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Simulate QR Scan"}
          </button>
        </div>
        {qrScanned && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <strong>{isKn ? selectedTopic.titleKn : selectedTopic.titleEn}: </strong>
            {isKn ? selectedTopic.analogyKn : selectedTopic.analogyEn}
          </div>
        )}
      </div>
    </div>
  );
}