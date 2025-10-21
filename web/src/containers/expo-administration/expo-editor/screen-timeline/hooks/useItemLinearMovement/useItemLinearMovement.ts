import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  MutableRefObject,
  CSSProperties,
} from "react";

// Types
import { TimelineType } from "models";
import { Size, Position } from "models";

// Utils
import {
  getDirVector,
  calculateLineSizing,
  calculateLinePosition,
  calculateLineTransformation,
} from "./linear-movement-utils";

// - - - - - -

type UpdateItemPositionFunc = (
  itemIdx: number,
  newLeft: number,
  newTop: number
) => void;

// - - - - - -

type Options = {
  lineThickness: number;
};

type Props = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  containerSize: Size;
  itemSize: Size;
  items: Position[];
  timelineType: TimelineType;
  handleItemUpdateAtPosition: UpdateItemPositionFunc;
  handleItemsReset: () => void;
  options?: Options;
};

/**
 * Custom hook that enables linear dragging of items inside a container
 * along a timeline (horizontal, vertical, diagonal, etc.).
 *
 * ## Parameters
 * - `containerRef`: Ref to the container element. Must be attached to a valid DOM node.
 * - `containerSize`: Size of the container (`{ width, height }`). Returned back in `containerStyle`.
 * - `itemSize`: Common size for all draggable items.
 * - `items`: Initial positions of the draggable items.
 * - `timelineType`: Orientation of the timeline (e.g., horizontal, vertical, diagonal).
 * - `handleItemUpdateAtPosition`: Callback to update the position of an item
 *    after it has been dragged.
 * - `handleItemsReset`: Callback triggered when the timeline type changes,
 *    to reset all item positions.
 * - `options` (optional): Additional configuration, e.g. `{ lineThickness }`.
 *
 * ## Behavior
 * - Calculates and applies `containerStyle`, `lineStyle`, and `itemStyle` for rendering.
 * - Tracks which item (if any) is currently being dragged.
 * - Projects mouse movement onto the timeline direction to determine new item positions.
 * - Ensures items remain clamped within the container boundaries.
 * - Automatically resets items when the `timelineType` changes.
 *
 * ## Returns
 * - `handleMouseDown`: Attach to item’s `onMouseDown` to start dragging.
 * - `handleMouseUp`: Attach to container’s or document’s `onMouseUp` to stop dragging.
 * - `handleMouseMove`: Attach to container’s `onMouseMove` to update item position while dragging.
 * - `containerStyle`: CSS style object for the container.
 * - `lineStyle`: CSS style object for the timeline line.
 * - `itemStyle`: Function returning CSS style for an item by index.
 */
const useItemLinearMovement = ({
  containerRef,
  containerSize,
  itemSize,
  items,
  timelineType,
  handleItemUpdateAtPosition,
  handleItemsReset,
  options,
}: Props) => {
  const { lineThickness = 2 } = options ?? {};

  const isFirstRender = useRef<boolean>(true);

  // - - - States - - -

  // NOTE: State describing which item (by its index) is currently being dragged.
  // If no item is being dragged, the value is set to null.
  const [draggingItemIdx, setDraggingItemIdx] = useState<number | null>(null);

  // - - - Derived variables (styles) - - -

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      position: "relative",
      width: containerSize.width,
      height: containerSize.height,
    }),
    [containerSize]
  );

  const lineStyle = useMemo<CSSProperties>(
    () => ({
      position: "absolute",
      backgroundColor: "black",
      ...calculateLineSizing(timelineType, containerSize, lineThickness),
      ...calculateLinePosition(timelineType),
      ...calculateLineTransformation(timelineType, containerSize),
    }),
    [containerSize, timelineType, lineThickness]
  );

  const itemStyle = useCallback(
    (itemIdx: number): CSSProperties => ({
      position: "absolute",
      cursor: "pointer",
      width: itemSize.width,
      height: itemSize.height,
      left: items?.[itemIdx]?.left ?? 0,
      top: items?.[itemIdx]?.top ?? 0,
      // NOTE: Coordinates are for center of the item, but we need left top corner
      transform: "translate(-50%, -50%)",
    }),
    [itemSize.height, itemSize.width, items]
  );

  // - - - Callbacks (handlers) - - -

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, itemIdx: number) => {
      e.preventDefault();
      setDraggingItemIdx(itemIdx);
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setDraggingItemIdx(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current === null) {
        // The container (as HTML element) has not been initialized yet
        return;
      }

      if (draggingItemIdx === null) {
        // Mouse is moving inside the container, but no item is selected for dragging
        return;
      }

      // NOTE: DOMRect object describes the element's size and position
      // The position is described relatively to the viewport (browser window)
      // { width, height, left (x), top (y), right, bottom }
      const containerEl = containerRef.current;
      const containerRect = containerEl.getBoundingClientRect();

      // E.g. if size of container is 400px x 400px, then this object is { x: 200, y: 200 }
      const containerCenter = {
        x: containerRect.width / 2,
        y: containerRect.height / 2,
      };

      // Get the mouse cursor position relative to the container
      // (i.e., x,y coordinates with respect to the container's top-left corner)
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      // Project onto line
      const dx = mouseX - containerCenter.x;
      const dy = mouseY - containerCenter.y;

      const dir = getDirVector(timelineType, containerRect);

      const scalar = dx * dir.x + dy * dir.y;

      const projX = scalar * dir.x;
      const projY = scalar * dir.y;

      // Compute new position and clamp to container
      const newLeft = Math.min(
        Math.max(containerCenter.x + projX, 0),
        containerRect.width
      );

      const newTop = Math.min(
        Math.max(containerCenter.y + projY, 0),
        containerRect.height
      );

      // Set the new position for given item (side effect)
      handleItemUpdateAtPosition(draggingItemIdx, newLeft, newTop);
    },
    [containerRef, draggingItemIdx, timelineType, handleItemUpdateAtPosition]
  );

  // - - - Effect - - -

  /**
   * Effect responsible mainly for handling the change of timeline type
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handleItemsReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineType]);

  // - - - Return Value - - -

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    containerStyle,
    lineStyle,
    itemStyle,
  };
};

export default useItemLinearMovement;
