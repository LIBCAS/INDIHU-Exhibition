import { Dispatch, SetStateAction } from "react";
import { Tooltip } from "react-tooltip";
import { renderInfopointBody } from "./renderInfopointBody";
import { InfopointStatusObject } from "./parseScreenMaps";

type TooltipInfoPointProps = {
  id: string;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  isAlwaysVisible: boolean;
  primaryKey: string;
  secondaryKey?: string;
  canBeOpen?: boolean;
};

const TooltipInfoPoint = (props: TooltipInfoPointProps) => {
  const keyMap =
    props.secondaryKey === undefined
      ? `${props.primaryKey}`
      : `${props.primaryKey}-${props.secondaryKey}`;

  if (props.isAlwaysVisible) {
    return <AlwaysVisibleTooltipInfopoint {...props} keyMap={keyMap} />;
  }

  return <BasicTooltipInfopoint {...props} keyMap={keyMap} />;
};

export default TooltipInfoPoint;

// - - - -

interface Props {
  id: string;
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
  keyMap: string;
  canBeOpen?: boolean;
}

const AlwaysVisibleTooltipInfopoint = ({
  id,
  infopointOpenStatusMap,
  keyMap,
  canBeOpen = true,
}: Props) => {
  return (
    <Tooltip
      id={id}
      className="!pointer-events-auto !opacity-100 !rounded-none shadow-md shadow-neutral-600"
      variant="light"
      clickable
      openOnClick
      render={({ content }) =>
        renderInfopointBody({
          text: content ?? "neuvedeno",
          isAlwaysVisible: true,
        })
      }
      isOpen={infopointOpenStatusMap[keyMap].isOpen && canBeOpen}
    />
  );
};

// - - - -

const BasicTooltipInfopoint = ({
  id,
  infopointOpenStatusMap,
  setInfopointOpenStatusMap,
  keyMap,
  canBeOpen = true,
}: Props) => {
  return (
    <Tooltip
      id={id}
      className="!pointer-events-auto !opacity-100 !rounded-none shadow-md shadow-neutral-600"
      variant="light"
      clickable
      openOnClick
      render={({ content }) => {
        const closeThisInfopoint = () => {
          setInfopointOpenStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: false },
          }));
        };

        return renderInfopointBody({
          text: content ?? "neuvedeno",
          isAlwaysVisible: false,
          onClose: closeThisInfopoint,
        });
      }}
      isOpen={infopointOpenStatusMap[keyMap].isOpen && canBeOpen}
      setIsOpen={(isOpen) => {
        if (isOpen) {
          setInfopointOpenStatusMap((prevMap) => ({
            ...prevMap,
            [keyMap]: { ...prevMap[keyMap], isOpen: true },
          }));
        }
      }}
    />
  );
};
