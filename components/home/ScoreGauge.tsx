"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ScoreGaugeProps {
  score: number;
  label?: string;
}

export default function ScoreGauge({
  score,
  label = "Analytics Health Score",
}: ScoreGaugeProps) {
  const grade =
    score >= 95
      ? "A+"
      : score >= 90
      ? "A"
      : score >= 80
      ? "B"
      : score >= 70
      ? "C"
      : "D";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="size-40">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            pathColor: "#0ea5e9",
            trailColor: "#e2e8f0",
            textColor: "#0f172a",
            textSize: "20px",
            strokeLinecap: "round",
          })}
        />
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-sky-600">
          {grade}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}