"use client";

import { create } from "zustand";
import {
  TOWER_MAP,
  type TowerId,
  getTravelPath,
} from "@/lib/city/towers";

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.6;

type CityMapState = {
  currentTowerId: TowerId;
  selectedTowerId: TowerId | null;
  zoom: number;
  /** Camera offset in px relative to viewport center */
  panX: number;
  panY: number;
  isTraveling: boolean;
  travelPath: TowerId[];
  unlockedTowerIds: TowerId[];
  /** Increments whenever the camera should recenter on selectedTowerId */
  focusNonce: number;
  focusTargetId: TowerId | null;

  selectTower: (id: TowerId | null) => void;
  travelTo: (id: TowerId) => boolean;
  finishTravelStep: () => void;
  setZoom: (zoom: number) => void;
  zoomBy: (delta: number, origin?: { x: number; y: number }) => void;
  setPan: (x: number, y: number) => void;
  panBy: (dx: number, dy: number) => void;
  focusTower: (id: TowerId) => void;
  resetCamera: () => void;
};

export const useCityMapStore = create<CityMapState>((set, get) => ({
  currentTowerId: "dawn_hall",
  selectedTowerId: "dawn_hall",
  zoom: 1.35,
  panX: 0,
  panY: 0,
  isTraveling: false,
  travelPath: [],
  unlockedTowerIds: ["dawn_hall", "river_bridge"],
  focusNonce: 0,
  focusTargetId: "dawn_hall",

  selectTower: (id) => set({ selectedTowerId: id }),

  travelTo: (id) => {
    const { currentTowerId, isTraveling, unlockedTowerIds } = get();
    if (isTraveling || id === currentTowerId) return false;
    if (!unlockedTowerIds.includes(id)) return false;
    if (TOWER_MAP[id].status === "locked") return false;

    const path = getTravelPath(currentTowerId, id);
    if (!path || path.length < 2) return false;

    set({
      isTraveling: true,
      travelPath: path.slice(1),
      selectedTowerId: id,
    });
    return true;
  },

  finishTravelStep: () => {
    const { travelPath } = get();
    if (!travelPath.length) {
      set({ isTraveling: false });
      return;
    }

    const [next, ...rest] = travelPath;
    const unlocked = new Set(get().unlockedTowerIds);
    unlocked.add(next);
    for (const link of TOWER_MAP[next].connections) {
      unlocked.add(link);
    }
    set({
      currentTowerId: next,
      travelPath: rest,
      isTraveling: rest.length > 0,
      selectedTowerId: rest.length ? get().selectedTowerId : next,
      unlockedTowerIds: [...unlocked],
    });
  },

  setZoom: (zoom) =>
    set({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) }),

  zoomBy: (delta) => {
    const { zoom } = get();
    set({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta)) });
  },

  setPan: (x, y) => set({ panX: x, panY: y }),

  panBy: (dx, dy) => {
    const { panX, panY } = get();
    set({ panX: panX + dx, panY: panY + dy });
  },

  focusTower: (id) => {
    set({
      selectedTowerId: id,
      focusTargetId: id,
      focusNonce: get().focusNonce + 1,
      zoom: Math.max(get().zoom, 1.35),
    });
  },

  resetCamera: () =>
    set({
      zoom: 1.15,
      panX: 0,
      panY: 0,
      selectedTowerId: get().currentTowerId,
      focusTargetId: get().currentTowerId,
      focusNonce: get().focusNonce + 1,
    }),
}));

export const CITY_ZOOM = { min: MIN_ZOOM, max: MAX_ZOOM };
