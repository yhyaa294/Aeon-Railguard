"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface SystemState {
  train_id: string;
  speed: number;
  distance: number;
  status: string;
  city_action: string;
  timestamp: string;
}

interface UseWebSocketReturn {
  state: SystemState;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

const DEFAULT_STATE: SystemState = {
  train_id: "KA-2045",
  speed: 120,
  distance: 10.0,
  status: "SAFE",
  city_action: "MONITORING",
  timestamp: "00:00:00",
};

export function useWebSocket(url: string = "ws://localhost:8080/ws"): UseWebSocketReturn {
  const [state, setState] = useState<SystemState>(DEFAULT_STATE);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("[WS] Connected to Central Brain");
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: SystemState = JSON.parse(event.data);
          setState(data);
        } catch {
          console.error("[WS] Parse error");
        }
      };

      ws.onclose = () => {
        console.log("[WS] Disconnected");
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect after 3 seconds using ref to avoid circular dependency
        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current();
        }, 3000);
      };

      ws.onerror = () => {
        setError("Connection failed");
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch {
      setError("Failed to connect");
      reconnectTimeoutRef.current = setTimeout(() => connectRef.current(), 3000);
    }
  }, [url]);

  // Keep ref in sync with latest connect function
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    state,
    isConnected,
    error,
    reconnect,
  };
}
