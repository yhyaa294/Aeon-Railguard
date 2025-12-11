"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DetectionPayload = {
  type: string;
  object_class: string;
  confidence: number;
  in_roi: boolean;
  object_id: number;
  duration_seconds: number;
  timestamp: string;
  camera_id?: string;
  detail?: string;
  image_url?: string;
};

type DetectionStreamState = {
  latest: DetectionPayload | null;
  history: DetectionPayload[];
  isConnected: boolean;
  error: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

export function useDetectionStream(limit = 50): DetectionStreamState & { reconnect: () => void } {
  const [latest, setLatest] = useState<DetectionPayload | null>(null);
  const [history, setHistory] = useState<DetectionPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  // Seed initial history from REST
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/history?limit=${limit}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.history)) {
          setHistory(data.history);
        }
      } catch (err) {
        console.warn("[Detect] history fetch failed", err);
      }
    };
    fetchHistory();
  }, [limit]);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (!payload || payload.type === "welcome") return;
          setLatest(payload);
          setHistory((prev) => {
            const next = [payload, ...prev];
            return next.slice(0, limit);
          });
        } catch (e) {
          console.warn("[Detect] parse error", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        reconnectTimer.current = setTimeout(connect, 2500);
      };

      ws.onerror = () => {
        setError("WebSocket error");
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (e) {
      setError("Failed to open websocket");
      reconnectTimer.current = setTimeout(connect, 2500);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    connect();
  }, [connect]);

  return useMemo(
    () => ({
      latest,
      history,
      isConnected,
      error,
      reconnect,
    }),
    [latest, history, isConnected, error, reconnect]
  );
}



