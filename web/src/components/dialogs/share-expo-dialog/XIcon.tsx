//

export const XIcon = createIcon({
  color: "#000000",
  networkName: "X",
  path: "M 41.116 18.375 h 4.962 l -10.8405 12.39 l 12.753 16.86 H 38.005 l -7.821 -10.2255 L 21.235 47.625 H 16.27 l 11.595 -13.2525 L 15.631 18.375 H 25.87 l 7.0695 9.3465 z m -1.7415 26.28 h 2.7495 L 24.376 21.189 H 21.4255 z",
});

// - - -

type Props = Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> & {
  bgStyle?: React.CSSProperties;
  borderRadius?: number;
  iconFillColor?: string;
  round?: boolean;
  size?: number | string;
};

type IconConfig = {
  color: string;
  networkName: string;
  /** SVG path */
  path: string;
};

export default function createIcon(iconConfig: IconConfig) {
  const Icon: React.FC<Props> = ({
    bgStyle = {},
    borderRadius = 0,
    iconFillColor = "white",
    round = false,
    size = 64,
    ...rest
  }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} {...rest}>
      {round ? (
        <circle
          cx="32"
          cy="32"
          r="32"
          fill={iconConfig.color}
          style={bgStyle}
        />
      ) : (
        <rect
          width="64"
          height="64"
          rx={borderRadius}
          ry={borderRadius}
          fill={iconConfig.color}
          style={bgStyle}
        />
      )}

      <path d={iconConfig.path} fill={iconFillColor} />
    </svg>
  );

  return Icon;
}
