"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface SystemState {
  distance: number;
  status: string;
  city_response: string;
  speed: number;
  eta: number;
}

interface UseWebSocketReturn {
  state: SystemState;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

const DEFAULT_STATE: SystemState = {
  distance: 10.0,
  status: "SAFE",
  city_response: "TRAFFIC_NORMAL",
  speed: 80,
  eta: 450,
};

export function useWebSocket(url: string = "ws://localhost:8080/ws"): UseWebSocketReturn {
  const [state, setState] = useState<SystemState>(DEFAULT_STATE);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        } catch (e) {
          console.error("[WS] Failed to parse message:", e);
        }
      };

      ws.onclose = () => {
        console.log("[WS] Disconnected from Central Brain");
        setIsConnected(false);
        wsRef.current = null;

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WS] Attempting reconnection...");
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        console.error("[WS] Connection error");
        setError("Connection failed");
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (e) {
      console.error("[WS] Failed to create connection:", e);
      setError("Failed to connect");
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, [url]);

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
