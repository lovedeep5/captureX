import { useState, useRef, useEffect, useCallback } from "react";

const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    pauseTimer();
    setTimer(0);
  }, [pauseTimer]);

  useEffect(() => {
    return () => pauseTimer();
  }, [pauseTimer]);

  return { timer, startTimer, pauseTimer, stopTimer };
};

export default useTimer;
