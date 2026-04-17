"use client";

type MascotState = "idle" | "thinking" | "working" | "celebrating";

interface RobotMascotProps {
  state: MascotState;
}

export default function RobotMascot({ state }: RobotMascotProps) {
  const isWorking = state === "working" || state === "thinking";
  const isCelebrating = state === "celebrating";

  return (
    <div
      className={`select-none transition-all duration-300 ${isCelebrating ? "scale-110" : "scale-100"}`}
      aria-hidden="true"
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 16 16"
        className="pixel-art"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Body */}
        <rect x="4" y="7" width="8" height="7" fill="#4A90D9" />
        {/* Head */}
        <rect x="3" y="2" width="10" height="8" fill="#4A90D9" />
        {/* Head highlight */}
        <rect x="3" y="2" width="10" height="1" fill="#6AAEED" />
        {/* Antenna */}
        <rect x="7" y="0" width="2" height="2" fill="#F5A623" />
        {/* Eyes */}
        <rect
          x="5"
          y="4"
          width="2"
          height="2"
          fill={isWorking || isCelebrating ? "#F5A623" : "#F0EDE6"}
        />
        <rect
          x="9"
          y="4"
          width="2"
          height="2"
          fill={isWorking || isCelebrating ? "#F5A623" : "#F0EDE6"}
        />
        {/* Eye glow when working */}
        {(isWorking || isCelebrating) && (
          <>
            <rect x="4" y="3" width="4" height="4" fill="#F5A623" fillOpacity="0.2" />
            <rect x="8" y="3" width="4" height="4" fill="#F5A623" fillOpacity="0.2" />
          </>
        )}
        {/* Mouth */}
        <rect x="6" y="7" width="4" height="1" fill={isCelebrating ? "#F5A623" : "#0D1117"} />
        {/* Arms */}
        <rect x="2" y="8" width="2" height="4" fill="#4A90D9" />
        <rect x="12" y="8" width="2" height="4" fill="#4A90D9" />
        {/* Legs */}
        <rect x="5" y="14" width="2" height="2" fill="#4A90D9" />
        <rect x="9" y="14" width="2" height="2" fill="#4A90D9" />
        {/* Chest panel */}
        <rect x="6" y="9" width="4" height="3" fill="#0D1117" fillOpacity="0.4" />
        <rect
          x="7"
          y="10"
          width="2"
          height="1"
          fill={isWorking ? "#F5A623" : "#4A90D9"}
        />
        {/* Tiny scroll when working */}
        {state === "working" && (
          <>
            <rect x="13" y="7" width="2" height="3" fill="#F0EDE6" />
            <rect x="13" y="7" width="2" height="1" fill="#F5A623" />
          </>
        )}
      </svg>
    </div>
  );
}
