"use client"

import { useState, useCallback } from "react";
import { DEVICES } from "@/lib/constants";

export function useDeviceSelector(maxSelection = 20) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const toggleDevice = useCallback(
    (device: string) => {
      setSelectedDevices((prev) => {
        const isSelected = prev.includes(device);
        if (isSelected) {
          return prev.filter((d) => d !== device);
        }
        if (prev.length < maxSelection) {
          return [...prev, device];
        }
        return prev;
      });
    },
    [maxSelection]
  );

  const setAllDevices = useCallback(() => {
    setSelectedDevices(DEVICES.slice(0, maxSelection));
  }, [maxSelection]);

  const clearDevices = useCallback(() => {
    setSelectedDevices([]);
  }, []);

  return {
    devices: DEVICES,
    selectedDevices,
    toggleDevice,
    setSelectedDevices,
    setAllDevices,
    clearDevices,
  };
}
