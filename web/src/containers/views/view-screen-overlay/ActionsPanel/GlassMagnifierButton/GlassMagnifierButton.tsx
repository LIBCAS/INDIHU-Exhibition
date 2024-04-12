import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Tooltip } from "react-tooltip";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import GlassMagnifierSettings from "./GlassMagnifierSettings";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";

type GlassMagnifierButtonProps = {
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const GlassMagnifierButton = ({
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: GlassMagnifierButtonProps) => {
  const { isGlassMagnifierEnabled, setIsGlassMagnifierEnabled } =
    useGlassMagnifierConfig();

  const { isLightMode } = useExpoDesignData();

  return (
    <>
      <div
        {...bind("glass-magnifier")}
        className={cx(
          "pointer-events-auto",
          getTutorialEclipseClassnameByStepkeys([""])
        )}
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
          variant={isLightMode ? "light" : "dark"}
          clickable
          render={() => <GlassMagnifierSettings />}
        />
      </div>
    </>
  );
};

export default GlassMagnifierButton;
