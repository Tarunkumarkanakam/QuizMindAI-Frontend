import React, { useEffect, useState } from "react";
import { useTimer } from "./TimerContext";

const TimerDisplay = () => {
  const timeRemaining = useTimer();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const timerStyles = {
    color: timeRemaining <= 1800 ? "red" : "inherit", // Turn red when <= 30 minutes remaining
    animation: timeRemaining <= 1800 ? "blinking 1s infinite" : "none", // Blink when <= 30 minutes remaining
  };

  return (
    <div className="timer text-2xl mb-4" style={timerStyles}>
      Time Remaining:{" "}
      <span className="transition" style={{ transitionProperty: "transform" }}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default TimerDisplay;
