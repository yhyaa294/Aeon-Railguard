'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// --- TYPE DEFINITIONS (Matching Backend Hierarchy) ---

export interface Unit {
  id: string;
  name: string;
  type: string;
  status: string;
  lat: number;
  long: number;
}

export interface Post {
  id: string;
  name: string;
  geo_location: string;
  units: Unit[];
}

export interface Station {
  id: string;
  name: string;
  head_officer: string;
  posts: Post[];
}

export interface Region {
  id: string;
  name: string;
  code: string;
  stations: Station[];
}

export interface CityStatus {
  traffic_light: string;
  ambulance: string;
  police: string;
  evacuation_route: string;
  siren: string;
  rail_crossing: string;
  last_update: string;
}

export type UserRole = 'jpl' | 'station' | 'daop';
export type SelectedNodeType = 'region' | 'station' | 'post' | 'unit';

export interface SelectedNode {
  id: string;
  name: string;
  type: SelectedNodeType;
  data: Region | Station | Post | Unit | null;
}

// --- CONTEXT STATE ---

interface DashboardState {
  currentRole: UserRole;
  selectedNode: SelectedNode | null;
  dataTree: Region | null;
  cityStatus: CityStatus | null;
  isLoading: boolean;
  isEmergency: boolean;
  error: string | null;
}

interface DashboardContextType extends DashboardState {
  setCurrentRole: (role: UserRole) => void;
  selectNode: (id: string, type: SelectedNodeType) => void;
  selectPost: (post: Post) => void;
  selectStation: (station: Station) => void;
  selectUnit: (unit: Unit) => void;
  refreshData: () => Promise<void>;
  triggerEmergency: () => void;
  clearEmergency: () => void;
  getFilteredView: () => { posts: Post[]; units: Unit[] };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// --- API CONFIG ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// --- PROVIDER COMPONENT ---

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('station');
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [dataTree, setDataTree] = useState<Region | null>(null);
  const [cityStatus, setCityStatus] = useState<CityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hierarchy data based on role
  const fetchHierarchy = useCallback(async (role: UserRole) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/hierarchy?role=${role}`);
      if (!response.ok) throw new Error('Failed to fetch hierarchy');

      const data = await response.json();

      // Data structure depends on role
      if (role === 'daop') {
        setDataTree(data as Region);
        // Auto-select first station
        if (data.stations && data.stations.length > 0) {
          const firstStation = data.stations[0];
          setSelectedNode({
            id: firstStation.id,
            name: firstStation.name,
            type: 'station',
            data: firstStation,
          });
        }
      } else if (role === 'station') {
        // Backend returns Station directly for station role
        const stationData = data as Station;
        // Wrap in Region for consistent structure
        const wrappedRegion: Region = {
          id: 'virtual-region',
          name: 'My Region',
          code: 'VR',
          stations: [stationData],
        };
        setDataTree(wrappedRegion);
        setSelectedNode({
          id: stationData.id,
          name: stationData.name,
          type: 'station',
          data: stationData,
        });
      } else if (role === 'jpl') {
        // Backend returns Post directly for jpl role
        const postData = data as Post;
        // Wrap in hierarchy
        const wrappedRegion: Region = {
          id: 'virtual-region',
          name: 'My Region',
          code: 'VR',
          stations: [{
            id: 'virtual-station',
            name: 'My Station',
            head_officer: '',
            posts: [postData],
          }],
        };
        setDataTree(wrappedRegion);
        setSelectedNode({
          id: postData.id,
          name: postData.name,
          type: 'post',
          data: postData,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('[DashboardContext] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch city status
  const fetchCityStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/city-status`);
      if (response.ok) {
        const data = await response.json();
        setCityStatus(data);
        // Auto-detect emergency from city status
        if (data.siren === 'CRITICAL' || data.traffic_light === 'RED_LOCK') {
          setIsEmergency(true);
        }
      }
    } catch (err) {
      console.error('[DashboardContext] City status error:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHierarchy(currentRole);
    fetchCityStatus();

    // Poll city status every 2 seconds
    const interval = setInterval(fetchCityStatus, 2000);
    return () => clearInterval(interval);
  }, [currentRole, fetchHierarchy, fetchCityStatus]);

  // Role change handler
  const handleRoleChange = useCallback((role: UserRole) => {
    setCurrentRole(role);
    fetchHierarchy(role);
  }, [fetchHierarchy]);

  // Node selection helpers
  const selectNode = useCallback((id: string, type: SelectedNodeType) => {
    if (!dataTree) return;

    let foundNode: SelectedNode | null = null;

    // Search through hierarchy
    for (const station of dataTree.stations) {
      if (type === 'station' && station.id === id) {
        foundNode = { id, name: station.name, type: 'station', data: station };
        break;
      }
      for (const post of station.posts) {
        if (type === 'post' && post.id === id) {
          foundNode = { id, name: post.name, type: 'post', data: post };
          break;
        }
        for (const unit of post.units) {
          if (type === 'unit' && unit.id === id) {
            foundNode = { id, name: unit.name, type: 'unit', data: unit };
            break;
          }
        }
        if (foundNode) break;
      }
      if (foundNode) break;
    }

    if (foundNode) {
      setSelectedNode(foundNode);
    }
  }, [dataTree]);

  const selectPost = useCallback((post: Post) => {
    setSelectedNode({
      id: post.id,
      name: post.name,
      type: 'post',
      data: post,
    });
  }, []);

  const selectStation = useCallback((station: Station) => {
    setSelectedNode({
      id: station.id,
      name: station.name,
      type: 'station',
      data: station,
    });
  }, []);

  const selectUnit = useCallback((unit: Unit) => {
    setSelectedNode({
      id: unit.id,
      name: unit.name,
      type: 'unit',
      data: unit,
    });
  }, []);

  // Get filtered view based on current selection
  const getFilteredView = useCallback(() => {
    const result: { posts: Post[]; units: Unit[] } = { posts: [], units: [] };

    if (!dataTree || !selectedNode) return result;

    if (selectedNode.type === 'station') {
      const station = selectedNode.data as Station;
      result.posts = station.posts || [];
    } else if (selectedNode.type === 'post') {
      const post = selectedNode.data as Post;
      result.units = post.units || [];
    } else if (selectedNode.type === 'region') {
      // Flatten all posts from all stations
      for (const station of dataTree.stations) {
        result.posts.push(...station.posts);
      }
    }

    return result;
  }, [dataTree, selectedNode]);

  const refreshData = useCallback(async () => {
    await fetchHierarchy(currentRole);
    await fetchCityStatus();
  }, [currentRole, fetchHierarchy, fetchCityStatus]);

  const triggerEmergency = useCallback(() => {
    setIsEmergency(true);
  }, []);

  const clearEmergency = useCallback(() => {
    setIsEmergency(false);
  }, []);

  const value: DashboardContextType = {
    currentRole,
    selectedNode,
    dataTree,
    cityStatus,
    isLoading,
    isEmergency,
    error,
    setCurrentRole: handleRoleChange,
    selectNode,
    selectPost,
    selectStation,
    selectUnit,
    refreshData,
    triggerEmergency,
    clearEmergency,
    getFilteredView,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// --- HOOK ---

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default DashboardContext;
