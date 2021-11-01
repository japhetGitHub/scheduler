import { useState } from "react";

export default function useVisualMode (initialMode) {
  const [mode, setMode] = useState(initialMode);  
  const [history, setHistory] = useState([initialMode]);

  function transition (next) {
    setHistory(prev => prev = [...prev, next]);
    setMode(next);
  }

  function back () {
    if (history.length > 1) {
      setHistory(prev => {
        prev.pop();
        setMode(prev[prev.length - 1]);
        return [...prev];
      })
    }
  }

  return { mode, transition, back };
}
