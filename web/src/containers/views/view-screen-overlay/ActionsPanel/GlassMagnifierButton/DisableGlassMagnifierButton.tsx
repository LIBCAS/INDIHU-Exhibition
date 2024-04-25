import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// - -

const DisableGlassMagnifierButton = () => {
  const { setIsGlassMagnifierEnabled } = useGlassMagnifierConfig();

  return (
    <div className="pointer-events-auto">
      <Button
        color="expoTheme"
        onClick={() => setIsGlassMagnifierEnabled(false)}
      >
        <Icon name="zoom_out" />
      </Button>
    </div>
  );
};

export default DisableGlassMagnifierButton;
