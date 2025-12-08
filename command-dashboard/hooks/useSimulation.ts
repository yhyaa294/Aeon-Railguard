"use client";

import { useState, useEffect } from "react";

export type EventLog = {
  id: string;
  time: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
};

export const useSimulation = () => {
  const [isDanger, setIsDanger] = useState(false);
  const [trainSpeed, setTrainSpeed] = useState(0);
  const [confidence, setConfidence] = useState(98.5);
  // Use a string literal for the initial ID to avoid hydration mismatch if using random on server
  const [events, setEvents] = useState<EventLog[]>([
    { id: "init-event-001", time: "10:00:00", message: "System Initialized", type: "info" },
  ]);

  useEffect(() => {
    // 1. Telemetry Loop (Fast updates)
    const telemetryInterval = setInterval(() => {
      setTrainSpeed((prev) => {
        const noise = Math.random() * 2 - 1;
        return Math.max(0, Math.min(120, prev + noise)); 
      });
      setConfidence((prev) => Math.max(80, Math.min(99.9, prev + (Math.random() - 0.5))));
    }, 1000);

    // 2. Danger Simulation Loop (Every 10 seconds)
    const simulationInterval = setInterval(() => {
      setIsDanger((prev) => {
        const newState = !prev;
        const time = new Date().toLocaleTimeString("en-US", { hour12: false });
        
        if (newState) {
          // Trigger Danger
          addEvent({ time, message: "OBSTRUCTION DETECTED", type: "danger" });
          setTimeout(() => {
             const time2 = new Date().toLocaleTimeString("en-US", { hour12: false });
             addEvent({ time: time2, message: "STOP SIGNAL SENT TO LOCOMOTIVE", type: "warning" });
          }, 500);
        } else {
          // Reset to Safe
          addEvent({ time, message: "Track Cleared. System Safe.", type: "success" });
        }
        return newState;
      });
    }, 10000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(simulationInterval);
    };
  }, []);

  const addEvent = (event: Omit<EventLog, "id">) => {
    // Use crypto.randomUUID() for unique keys to prevent React key collision errors
    const uniqueId = crypto.randomUUID();
    
    setEvents((prev) => [{ ...event, id: uniqueId }, ...prev].slice(0, 20)); 
  };

  return { isDanger, trainSpeed, confidence, events };
};
