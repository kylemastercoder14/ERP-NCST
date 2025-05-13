"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({
  initialTime,
}: {
  initialTime: number;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert milliseconds to hours, minutes, seconds
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Format with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className="flex justify-center gap-2 text-xl font-mono">
      <span className="bg-gray-100 px-3 py-1 rounded">{formatTime(hours)}</span>
      <span>:</span>
      <span className="bg-gray-100 px-3 py-1 rounded">
        {formatTime(minutes)}
      </span>
      <span>:</span>
      <span className="bg-gray-100 px-3 py-1 rounded">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
