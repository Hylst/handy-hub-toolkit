
import { useState, useEffect, useCallback } from "react";

export interface PomodoroSession {
  id: string;
  type: "work" | "break" | "longBreak";
  duration: number;
  completedAt: Date;
  taskId?: string;
}

export const usePomodoroTimer = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<"work" | "break" | "longBreak">("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: currentSession === "work" ? pomodoroTime : 
                currentSession === "break" ? breakTime : longBreakTime,
      completedAt: new Date()
    };
    
    setSessions(prev => [...prev, session]);
    
    if (currentSession === "work") {
      setCompletedPomodoros(prev => prev + 1);
      if ((completedPomodoros + 1) % 4 === 0) {
        setCurrentSession("longBreak");
        setCurrentTime(longBreakTime);
      } else {
        setCurrentSession("break");
        setCurrentTime(breakTime);
      }
    } else {
      setCurrentSession("work");
      setCurrentTime(pomodoroTime);
    }
  }, [currentSession, pomodoroTime, breakTime, longBreakTime, completedPomodoros]);

  const startPauseTimer = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentSession("work");
    setCurrentTime(pomodoroTime);
  }, [pomodoroTime]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTodaysStats = useCallback(() => {
    const today = new Date();
    const todaysSessions = sessions.filter(s => 
      s.completedAt.toDateString() === today.toDateString()
    );
    
    const workSessions = todaysSessions.filter(s => s.type === "work").length;
    const focusTime = workSessions * 25; // minutes
    
    return {
      sessionsToday: todaysSessions.length,
      workSessions,
      focusTime,
      totalSessions: sessions.length
    };
  }, [sessions]);

  return {
    currentTime,
    isRunning,
    currentSession,
    completedPomodoros,
    sessions,
    startPauseTimer,
    resetTimer,
    formatTime,
    getTodaysStats,
    pomodoroTime,
    breakTime,
    longBreakTime,
    setPomodoroTime,
    setBreakTime,
    setLongBreakTime
  };
};
