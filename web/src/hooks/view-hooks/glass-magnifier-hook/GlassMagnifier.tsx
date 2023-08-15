import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";
import { useExpoDesignData } from "../expo-design-data-hook";

// React Component inside Image Container, after contained img itself
// Thats why image container should be positioned relatively and this absolutely

type Position = {
  left: number;
  top: number;
};

type GlassMagnifierProps = {
  containedImgSize: { width: number; height: number };
  cursorPosition: Position;
  targetPosition: Position;
  containedImgSrc: string | undefined;
};

const GlassMagnifier = ({
  containedImgSize,
  cursorPosition,
  targetPosition,
  containedImgSrc,
}: GlassMagnifierProps) => {
  const {
    isGlassMagnifierEnabled,
    glassMagnifierPxSize,
    glassMagnifierType,
    scaleZoomSize,
  } = useGlassMagnifierConfig();

  const { expoDesignData } = useExpoDesignData();

  if (!isGlassMagnifierEnabled || !containedImgSrc) {
    return null;
  }

  return (
    <div
      className="bg-background"
      style={{
        position: "absolute",
        left: cursorPosition.left,
        top: cursorPosition.top,
        width: `${glassMagnifierPxSize}px`,
        height: `${glassMagnifierPxSize}px`,
        borderRadius: glassMagnifierType === "CIRCLE" ? "50%" : undefined,
        boxSizing: "content-box",
        border: "5px solid rgba(0, 0, 0, 0.5)",
        transform: "translate(-50%, -50%)", // the cursor should be in the middle
        overflow: "hidden",
        backgroundColor: expoDesignData?.backgroundColor,
        pointerEvents: "none", // to allow mouse interactions to pass through the magnifier
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${containedImgSrc})`,
          backgroundSize: `${containedImgSize.width}px ${containedImgSize.height}px`,
          backgroundPositionX: `${targetPosition.left * -1}px`,
          backgroundPositionY: `${targetPosition.top * -1}px`,
          backgroundRepeat: "no-repeat",
          transform: `scale(${scaleZoomSize})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
};

export default GlassMagnifier;
