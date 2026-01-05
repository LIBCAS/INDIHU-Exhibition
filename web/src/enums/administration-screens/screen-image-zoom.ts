export enum ZoomInTooltipPositionEnum {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
}

export enum ZoomTypeEnum {
  RESET_AFTER_ZOOM = "RESET_AFTER_ZOOM", // NOTE: After one zoom, reset back to the center, then another zoom
  CONTINUOUS_ZOOM = "CONTINUOUS_ZOOM", // NOTE: From one zoom, do not go back to center, continue to another zoom
}
