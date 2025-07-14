import React from "react";

export default function Loader({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-4 border-t-[#04b7cf] border-b-[#04cf84] border-l-gray-200 border-r-gray-200"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
