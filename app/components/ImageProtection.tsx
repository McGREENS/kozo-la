"use client";

import { useEffect } from "react";

/**
 * ImageProtection
 *
 * Blocks right-click context menus and keyboard shortcuts that could be
 * used to save or copy images. Identical to the kozo-next implementation.
 */
export default function ImageProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // Block common save/copy shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (ctrl && ["s", "S", "u", "U", "p", "P"].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
