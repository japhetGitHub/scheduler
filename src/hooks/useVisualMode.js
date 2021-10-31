import { useState } from "react";

export default function useVisualMode (initialMode) {
  const [mode, setMode] = useState(initialMode);  

  function transition (next) {
    setMode(next);
  }

  return { mode, transition };
}
