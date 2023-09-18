import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

type InfoButtonProps = {
  openDrawer: () => void;
};

const InfoButton = ({ openDrawer }: InfoButtonProps) => {
  return (
    <div className="pointer-events-auto">
      <Button color="expoTheme" onClick={openDrawer}>
        <Icon name="info" />
      </Button>
    </div>
  );
};

export default InfoButton;
