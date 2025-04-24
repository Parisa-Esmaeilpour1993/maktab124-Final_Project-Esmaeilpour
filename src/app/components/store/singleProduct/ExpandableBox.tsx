"use client";
import { useState } from "react";

export default function ExpandableBox({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "max-h-full" : "max-h-32 overflow-hidden"
        } relative`}
      >
        <div className="p-4">{children}</div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-primary text-sm font-semibold py-2"
      >
        {isExpanded ? "بستن" : "نمایش بیشتر"}
      </button>
    </div>
  );
}
