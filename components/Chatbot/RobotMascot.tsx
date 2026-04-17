"use client";

type MascotState = "idle" | "thinking" | "working" | "celebrating";

export default function RobotMascot({ state }: { state: MascotState }) {
  const bodyClass =
    state === "thinking" ? "robot-thinking" :
    state === "working"  ? "robot-working" :
    state === "celebrating" ? "robot-celebrating" :
    "robot-idle";

  const eyeClass =
    state === "thinking" ? "eye-thinking" :
    state === "working" || state === "celebrating" ? "eye-working" :
    "eye-idle";

  const antennaClass =
    state === "thinking" ? "antenna-thinking" :
    state === "working"  ? "antenna-working" :
    "antenna-idle";

  const eyeFill = (state === "working" || state === "celebrating") ? "#F5A623" : "#F0EDE6";
  const panelLight = state === "working" ? "panel-light" : "";

  return (
    <div className={`select-none shrink-0 ${bodyClass}`} aria-hidden="true">
      <svg
        width="160"
        height="180"
        viewBox="0 0 40 45"
        className="pixel-art"
        style={{ imageRendering: "pixelated" }}
      >
        {/* ── Antenna ── */}
        <rect x="18" y="0" width="4" height="1" fill="#4A90D9" />
        <rect x="19" y="1" width="2" height="3" fill="#4A90D9" />
        {/* Antenna tip (pulsing) */}
        <rect x="18" y="0" width="4" height="1" fill="#4A90D9" />
        <rect className={antennaClass} x="17" y="0" width="6" height="2" rx="0" fill="#F5A623" style={{ transformOrigin: "20px 1px" }} />

        {/* ── Head shell ── */}
        {/* Main head block */}
        <rect x="8" y="4" width="24" height="18" fill="#3A7BC8" />
        {/* Head top rounded */}
        <rect x="9" y="3" width="22" height="2" fill="#3A7BC8" />
        {/* Head highlight top */}
        <rect x="10" y="4" width="20" height="2" fill="#5B9EE0" />
        {/* Head highlight left edge */}
        <rect x="8"  y="4" width="2"  height="16" fill="#4A90D9" />
        {/* Head shadow right */}
        <rect x="30" y="4" width="2"  height="18" fill="#2A5FA0" />
        {/* Head shadow bottom */}
        <rect x="8"  y="20" width="24" height="2" fill="#2A5FA0" />

        {/* ── Visor / face plate ── */}
        <rect x="10" y="7" width="20" height="12" fill="#0D1117" />
        {/* Visor inset glow */}
        <rect x="11" y="8" width="18" height="10" fill="#0a0f15" />
        {/* Visor scanline effect */}
        <rect x="11" y="9"  width="18" height="1" fill="#0D1117" fillOpacity="0.6" />
        <rect x="11" y="11" width="18" height="1" fill="#0D1117" fillOpacity="0.6" />
        <rect x="11" y="13" width="18" height="1" fill="#0D1117" fillOpacity="0.6" />
        <rect x="11" y="15" width="18" height="1" fill="#0D1117" fillOpacity="0.6" />

        {/* ── Eyes ── */}
        {/* Left eye socket */}
        <rect x="12" y="9" width="6" height="5" fill="#0D1117" />
        {/* Right eye socket */}
        <rect x="22" y="9" width="6" height="5" fill="#0D1117" />

        {/* Left eye inner */}
        <rect className={eyeClass} x="13" y="10" width="4" height="3" fill={eyeFill} style={{ transformOrigin: "15px 11.5px" }} />
        {/* Right eye inner */}
        <rect className={eyeClass} x="23" y="10" width="4" height="3" fill={eyeFill} style={{ transformOrigin: "25px 11.5px" }} />

        {/* Eye pupils */}
        <rect x="14" y="11" width="2" height="1" fill="#0D1117" />
        <rect x="24" y="11" width="2" height="1" fill="#0D1117" />

        {/* Eye corner highlights */}
        <rect x="13" y="10" width="1" height="1" fill="#ffffff" fillOpacity="0.6" />
        <rect x="23" y="10" width="1" height="1" fill="#ffffff" fillOpacity="0.6" />

        {/* ── Mouth / grille ── */}
        <rect x="13" y="16" width="14" height="3" fill="#0a0f15" />
        <rect x="14" y="17" width="2"  height="1" fill="#3A7BC8" />
        <rect x="17" y="17" width="2"  height="1" fill="#3A7BC8" />
        <rect x="20" y="17" width="2"  height="1" fill="#3A7BC8" />
        <rect x="23" y="17" width="2"  height="1" fill="#3A7BC8" />

        {/* ── Neck ── */}
        <rect x="16" y="22" width="8" height="3" fill="#2A5FA0" />
        <rect x="17" y="22" width="6" height="3" fill="#3A7BC8" />

        {/* ── Body ── */}
        <rect x="7"  y="25" width="26" height="16" fill="#3A7BC8" />
        {/* Body top edge */}
        <rect x="7"  y="25" width="26" height="2" fill="#5B9EE0" />
        {/* Body left highlight */}
        <rect x="7"  y="25" width="2"  height="16" fill="#4A90D9" />
        {/* Body right shadow */}
        <rect x="31" y="25" width="2"  height="16" fill="#2A5FA0" />
        {/* Body bottom shadow */}
        <rect x="7"  y="39" width="26" height="2" fill="#2A5FA0" />

        {/* ── Chest panel ── */}
        <rect x="13" y="27" width="14" height="10" fill="#0a0f15" />
        <rect x="14" y="28" width="12" height="8"  fill="#0D1117" />

        {/* Panel lights */}
        <rect className={panelLight} x="15" y="29" width="2" height="2" fill="#F5A623" style={{ transformOrigin: "16px 30px" }} />
        <rect x="18" y="29" width="2" height="2" fill="#4A90D9" />
        <rect x="21" y="29" width="2" height="2" fill="#4A90D9" />
        <rect x="24" y="29" width="2" height="2" fill={state === "working" || state === "celebrating" ? "#F5A623" : "#2A5FA0"} />

        {/* Panel progress bar */}
        <rect x="15" y="33" width="10" height="1" fill="#1a2030" />
        <rect x="15" y="33" width={state === "working" ? "10" : state === "thinking" ? "6" : "3"} height="1" fill="#F5A623" />

        {/* ── Shoulders ── */}
        <rect x="3"  y="25" width="5"  height="4" fill="#4A90D9" />
        <rect x="32" y="25" width="5"  height="4" fill="#4A90D9" />
        <rect x="3"  y="25" width="5"  height="1" fill="#5B9EE0" />
        <rect x="32" y="25" width="5"  height="1" fill="#5B9EE0" />

        {/* ── Arms ── */}
        <rect x="2" y="29" width="5" height="9" fill="#3A7BC8" />
        <rect x="2" y="29" width="2" height="9" fill="#4A90D9" />
        <rect x="33" y="29" width="5" height="9" fill="#3A7BC8" />
        <rect x="36" y="29" width="2" height="9" fill="#2A5FA0" />

        {/* ── Hands ── */}
        <rect x="1"  y="38" width="7" height="4" fill="#2A5FA0" />
        <rect x="32" y="38" width="7" height="4" fill="#2A5FA0" />
        {/* Finger lines */}
        <rect x="3"  y="38" width="1" height="4" fill="#1a3a6a" />
        <rect x="5"  y="38" width="1" height="4" fill="#1a3a6a" />
        <rect x="34" y="38" width="1" height="4" fill="#1a3a6a" />
        <rect x="36" y="38" width="1" height="4" fill="#1a3a6a" />

        {/* ── Legs ── */}
        <rect x="11" y="41" width="7" height="4" fill="#2A5FA0" />
        <rect x="22" y="41" width="7" height="4" fill="#2A5FA0" />

        {/* ── Feet ── */}
        <rect x="10" y="43" width="9" height="2" fill="#1a3a6a" />
        <rect x="21" y="43" width="9" height="2" fill="#1a3a6a" />

        {/* ── Working: tiny tool in right hand ── */}
        {state === "working" && (
          <>
            <rect x="38" y="34" width="2" height="6" fill="#F0EDE6" />
            <rect x="38" y="34" width="2" height="1" fill="#F5A623" />
            <rect x="37" y="38" width="4" height="1" fill="#F5A623" />
          </>
        )}

        {/* ── Thinking: question bubble ── */}
        {state === "thinking" && (
          <>
            <rect x="31" y="2"  width="8" height="6" fill="#F0EDE6" fillOpacity="0.9" />
            <rect x="32" y="3"  width="6" height="4" fill="#F0EDE6" />
            <rect x="33" y="8"  width="2" height="1" fill="#F0EDE6" fillOpacity="0.9" />
            <rect x="34" y="9"  width="1" height="1" fill="#F0EDE6" fillOpacity="0.7" />
            {/* ? mark */}
            <rect x="33" y="4"  width="2" height="1" fill="#F5A623" />
            <rect x="34" y="5"  width="1" height="1" fill="#F5A623" />
            <rect x="33" y="6"  width="1" height="1" fill="#F5A623" />
            <rect x="33" y="7"  width="1" height="1" fill="#F5A623" />
          </>
        )}
      </svg>
    </div>
  );
}
