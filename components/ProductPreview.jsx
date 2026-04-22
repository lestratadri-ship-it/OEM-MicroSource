"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { productColors } from "@/lib/categories";

// Konva uses the browser canvas API → skip SSR.
const LogoStage = dynamic(() => import("./LogoStage"), { ssr: false });

/**
 * Stacks the 4 preloaded color variants (HTML <img> for zero-JS speed) and the
 * zone outlines (plain divs). If a logo is uploaded, a transparent Konva Stage
 * is overlaid on top — that Stage handles drag + proportional resize and keeps
 * the logo inside the active branding zone.
 */
export default function ProductPreview({
  category,
  activeColorKey,
  activeZoneId,
  logo,          // data URL or null
  logoBox,       // { x, y, width, height } normalised inside zone, or null
  onLogoBoxChange,
}) {
  const { product } = category;
  const { images, aspectRatio, maxWidth, zones } = product;
  const activeZone =
    zones.find((z) => z.id === activeZoneId) ?? zones[0];

  // Measure the preview box in pixels so Konva can work in absolute coords.
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full"
      style={{ aspectRatio, maxWidth }}
    >
      {/* Preloaded color variants */}
      {productColors.map((c) => {
        const src = images[c.key];
        if (!src) return null;
        const isActive = c.key === activeColorKey;
        return (
          <img
            key={c.key}
            src={src}
            alt=""
            decoding="async"
            loading="eager"
            draggable={false}
            className={`absolute inset-0 h-full w-full object-contain
              transition-opacity duration-300 ease-out
              ${isActive ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}

      {/* Allowed branding zones — subtle dashed outlines, visible on any body. */}
      {zones.map((zone) => {
        const isActive = zone.id === activeZone.id;
        return (
          <div
            key={zone.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-[3px]"
            style={{
              top: zone.outline.top,
              left: zone.outline.left,
              width: zone.outline.width,
              height: zone.outline.height,
              borderStyle: "dashed",
              borderWidth: isActive ? "1.5px" : "1px",
              borderColor: isActive ? "rgb(235,235,235)" : "rgb(135,135,135)",
              mixBlendMode: "difference",
              transition:
                "border-color 180ms ease-out, border-width 180ms ease-out",
            }}
          />
        );
      })}

      {/* Konva Stage — only mounted when there's a logo to edit. */}
      {logo && (
        <div className="absolute inset-0 animate-fade-in">
          <LogoStage
            logoSrc={logo}
            containerWidth={size.width}
            containerHeight={size.height}
            zone={activeZone.outline}
            logoBox={logoBox}
            onChange={onLogoBoxChange}
          />
        </div>
      )}
    </div>
  );
}
