"use client";

import { useEffect } from "react";

interface CardDisplayProps {
  readonly src?: string;
  readonly alt?: string;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
}

export function CardDisplay({
  src = "/images/PNCdebitcard.jpg",
  alt = "Card",
}: CardDisplayProps) {
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => console.log(`✅ Card image loaded: ${src}`);
    img.onerror = () => console.error(`❌ Card image 404: ${src}`);
  }, [src]);

  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        console.error("PNC IMAGE LOAD FAILED. src:", e.currentTarget.src);
        e.currentTarget.style.border = "3px solid red";
        e.currentTarget.src = "/images/PNCdebitcard.jpg";
      }}
      style={{
        width: 200,
        height: "auto",
        objectFit: "contain",
        filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.5))",
        borderRadius: 12,
        display: "block",
        minWidth: 200,
        minHeight: 100,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    />
  );
}
