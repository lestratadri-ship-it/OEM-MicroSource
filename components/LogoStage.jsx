"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";

/**
 * Transparent Konva Stage that hosts the draggable / resizable logo.
 *
 * Coordinates are stored in the parent as a normalised box inside the active
 * zone ({ x, y, width, height } all 0–1). That means window resizes reposition
 * the logo correctly without any re-measurement on our part.
 *
 * Movement rules (enforced inside Konva, not by CSS):
 *   • dragBoundFunc clamps every drag position to the zone rectangle.
 *   • Transformer.boundBoxFunc rejects any resize that would spill outside
 *     the zone, or that would shrink below the minimum size.
 *   • keepRatio + 4-corner anchors → proportional resize only.
 *
 * Props:
 *   - logoSrc: data URL of the uploaded logo.
 *   - containerWidth / containerHeight: preview box size in px.
 *   - zone: active zone's outline in percentages (e.g. { top: "45%", ... }).
 *   - logoBox: null | { x, y, width, height } normalised within the zone.
 *   - onChange(newBox): commit after drag/resize ends.
 */
export default function LogoStage({
  logoSrc,
  containerWidth,
  containerHeight,
  zone,
  logoBox,
  onChange,
}) {
  const [img, setImg] = useState(null);
  const imageRef = useRef(null);
  const trRef = useRef(null);

  // Load the uploaded logo into an HTMLImageElement — Konva needs a real Image.
  useEffect(() => {
    if (!logoSrc) {
      setImg(null);
      return;
    }
    const el = new window.Image();
    el.onload = () => setImg(el);
    el.src = logoSrc;
  }, [logoSrc]);

  // Re-attach Transformer whenever the image node (or zone geometry) changes.
  useEffect(() => {
    if (img && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [img, zone, containerWidth, containerHeight]);

  if (!img || !containerWidth || !containerHeight) return null;

  // Convert the active zone % → px inside the current preview box.
  const zonePx = {
    x: (parseFloat(zone.left) / 100) * containerWidth,
    y: (parseFloat(zone.top) / 100) * containerHeight,
    width: (parseFloat(zone.width) / 100) * containerWidth,
    height: (parseFloat(zone.height) / 100) * containerHeight,
  };

  // Default fit: contain the logo inside the zone, centred, aspect preserved.
  const fit = (() => {
    const logoRatio = img.naturalWidth / img.naturalHeight;
    const zoneRatio = zonePx.width / zonePx.height;
    let w, h;
    if (logoRatio > zoneRatio) {
      w = 1;
      h = zoneRatio / logoRatio;
    } else {
      h = 1;
      w = logoRatio / zoneRatio;
    }
    return { x: (1 - w) / 2, y: (1 - h) / 2, width: w, height: h };
  })();

  const current = logoBox ?? fit;

  const imgPx = {
    x: zonePx.x + current.x * zonePx.width,
    y: zonePx.y + current.y * zonePx.height,
    width: current.width * zonePx.width,
    height: current.height * zonePx.height,
  };

  const boxToNormalised = (node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Bake scale into width/height so React state stays in a consistent shape.
    node.scaleX(1);
    node.scaleY(1);
    const w = node.width() * scaleX;
    const h = node.height() * scaleY;
    return {
      x: (node.x() - zonePx.x) / zonePx.width,
      y: (node.y() - zonePx.y) / zonePx.height,
      width: w / zonePx.width,
      height: h / zonePx.height,
    };
  };

  return (
    <Stage
      width={containerWidth}
      height={containerHeight}
      // Stage sits on top of the HTML preview; it's transparent elsewhere,
      // but captures pointer events (desired — Konva drives the logo).
      style={{ position: "absolute", inset: 0 }}
    >
      <Layer>
        <KonvaImage
          ref={imageRef}
          image={img}
          x={imgPx.x}
          y={imgPx.y}
          width={imgPx.width}
          height={imgPx.height}
          draggable
          dragBoundFunc={(pos) => {
            const node = imageRef.current;
            if (!node) return pos;
            const w = node.width() * node.scaleX();
            const h = node.height() * node.scaleY();
            const minX = zonePx.x;
            const minY = zonePx.y;
            const maxX = zonePx.x + zonePx.width - w;
            const maxY = zonePx.y + zonePx.height - h;
            return {
              x: Math.max(minX, Math.min(maxX, pos.x)),
              y: Math.max(minY, Math.min(maxY, pos.y)),
            };
          }}
          onDragEnd={(e) => onChange(boxToNormalised(e.target))}
          onTransformEnd={(e) => onChange(boxToNormalised(e.target))}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = "grab";
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = "default";
          }}
        />

        <Transformer
          ref={trRef}
          keepRatio
          rotateEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          anchorSize={8}
          anchorCornerRadius={1}
          anchorStroke="#0B0B0C"
          anchorStrokeWidth={1}
          anchorFill="#FFFFFF"
          borderStroke="#0B0B0C"
          borderStrokeWidth={1}
          borderDash={[3, 3]}
          padding={2}
          boundBoxFunc={(oldBox, newBox) => {
            // Reject resize if it would leave the zone rectangle…
            if (
              newBox.x < zonePx.x ||
              newBox.y < zonePx.y ||
              newBox.x + newBox.width > zonePx.x + zonePx.width ||
              newBox.y + newBox.height > zonePx.y + zonePx.height
            ) {
              return oldBox;
            }
            // …or shrink below a usable minimum.
            if (newBox.width < 16 || newBox.height < 16) return oldBox;
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
}
