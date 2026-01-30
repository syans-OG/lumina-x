"use client";

import { useMemo } from "react";

export interface DeviceCapability {
  isMobile: boolean;
  isLowEnd: boolean;
  particleCount: number;
  enablePostProcessing: boolean;
  dpr: [number, number];
  enableBloom: boolean;
  bloomLevels: number;
  enableChromaticAberration: boolean;
  enableMipmapBlur: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isLowEnd: false,
        particleCount: 1000,
        enablePostProcessing: true,
        dpr: [1, 1.25] as [number, number],
        enableBloom: true,
        bloomLevels: 4,
        enableChromaticAberration: true,
        enableMipmapBlur: true,
      };
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    const screenWidth = window.innerWidth;

    let particleCount = 1000;
    if (isMobile && !isTablet) {
      particleCount = 200;
    } else if (isTablet || isLowEnd) {
      particleCount = 500;
    }

    const enablePostProcessing = !isMobile || isTablet;
    const dpr: [number, number] = isMobile && !isTablet ? [0.75, 1] : [1, 1.25];
    const bloomLevels = isMobile && !isTablet ? 2 : 4;
    const enableChromaticAberration = !isMobile || isTablet;
    const enableMipmapBlur = !isMobile;

    return {
      isMobile,
      isLowEnd,
      particleCount,
      enablePostProcessing,
      dpr,
      enableBloom: true,
      bloomLevels,
      enableChromaticAberration,
      enableMipmapBlur,
    };
  }, []);
}
