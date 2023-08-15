import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

import { Tooltip } from "react-tooltip";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import GlassMagnifierSettingsTooltip from "./GlassMagnifierSettingsTooltip";

import { AppState } from "store/store";

import cx from "classnames";
import {
  glassMagnifierEnabled,
  mapScreenTypeValuesToKeys,
} from "enums/screen-type";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

const GlassMagnifierButton = () => {
  const { viewScreen } = useSelector(stateSelector);
  const { isGlassMagnifierEnabled, setIsGlassMagnifierEnabled } =
    useGlassMagnifierConfig();

  const hasGlassMagnifier =
    !!viewScreen &&
    glassMagnifierEnabled[mapScreenTypeValuesToKeys[viewScreen.type]];

  return (
    <>
      {hasGlassMagnifier && (
        <div
          className={cx("pointer-events-auto")}
          data-tooltip-id="glass-magnifier-button-tooltip"
        >
          <div>
            <Button
              color="expoTheme"
              onClick={() => {
                setIsGlassMagnifierEnabled((prev) => !prev);
              }}
            >
              <Icon name={isGlassMagnifierEnabled ? "zoom_out" : "zoom_in"} />
            </Button>
          </div>

          <Tooltip
            id="glass-magnifier-button-tooltip"
            className="p-0"
            variant="light"
            clickable
            render={() => <GlassMagnifierSettingsTooltip />}
          />
        </div>
      )}
    </>
  );
};

export default GlassMagnifierButton;
