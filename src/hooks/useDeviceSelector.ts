"use client";

import { useState, useCallback } from "react";
import { TOP_20_DEVICES, DEFAULT_DEVICE_SELECTION } from "@/constants/devices";

export function useDeviceSelector(maxSelection = 20) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    DEFAULT_DEVICE_SELECTION.slice(0, Math.min(5, maxSelection)),
  );

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
    [maxSelection],
  );

  const setAllDevices = useCallback(() => {
    setSelectedDevices(
      TOP_20_DEVICES.slice(0, maxSelection).map((device) => device.id),
    );
  }, [maxSelection]);

  const clearDevices = useCallback(() => {
    setSelectedDevices([]);
  }, []);

  return {
    devices: TOP_20_DEVICES.map((device) => device.id),
    selectedDevices,
    toggleDevice,
    setSelectedDevices,
    setAllDevices,
    clearDevices,
  };
}
