import { Dispatch, SetStateAction } from "react";
import { Tooltip } from "react-tooltip";
import { renderInfopointBody } from "./renderInfopointBody";
import { InfopointStatusObject } from "./parseScreenMaps";
import { Infopoint } from "models";

type TooltipInfoPointProps = {
  id: string;
  infopoint: Infopoint;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  primaryKey: string;
  secondaryKey?: string;
  canBeOpen?: boolean;
};

const TooltipInfoPoint = (props: TooltipInfoPointProps) => {
  const keyMap =
    props.secondaryKey === undefined
      ? `${props.primaryKey}`
      : `${props.primaryKey}-${props.secondaryKey}`;

  return <BasicTooltipInfopoint {...props} keyMap={keyMap} />;
};

export default TooltipInfoPoint;

// - - - -

interface Props {
  id: string;
  infopoint: Infopoint;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  keyMap: string;
  canBeOpen?: boolean;
}

const BasicTooltipInfopoint = ({
  id,
  infopoint,
  infopointOpenStatusMap,
  setInfopointOpenStatusMap,
  keyMap,
  canBeOpen = true,
}: Props) => {
  return (
    <Tooltip
      id={id}
      className="!pointer-events-auto !opacity-100 !rounded-none shadow-md shadow-neutral-600 border-solid border-[1px] border-black"
      classNameArrow="border-b-[1px] border-b-solid border-b-black border-r-[1px] border-r-solid border-r-black"
      variant="light"
      clickable
      openOnClick
      render={() => {
        const closeThisInfopoint = () => {
          setInfopointOpenStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: false },
          }));
        };

        return renderInfopointBody({
          infopoint: infopoint,
          onClose: closeThisInfopoint,
        });
      }}
      isOpen={infopointOpenStatusMap[keyMap].isOpen && canBeOpen}
      setIsOpen={(isOpen) => {
        if (isOpen) {
          setInfopointOpenStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: !prevMap[keyMap].isOpen },
          }));
        }
      }}
    />
  );
};
