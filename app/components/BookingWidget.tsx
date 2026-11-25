"use client";

import { useEffect } from "react";

interface BookingWidgetProps {
  onClose: () => void;
}

export default function BookingWidget({ onClose }: BookingWidgetProps) {
  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-[650px] overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-[28px] font-light text-black/70 transition hover:bg-black/20"
          aria-label="Close"
        >
          ×
        </button>
        <iframe
          src="https://www.opentable.com/restref/client/?restref=1558372&lang=en-US&ot_source=Restaurant%20website&corrid=97905469"
          width="100%"
          height="600px"
          frameBorder="0"
          className="border-0"
          title="OpenTable Booking"
        />
      </div>
    </div>
  );
}
