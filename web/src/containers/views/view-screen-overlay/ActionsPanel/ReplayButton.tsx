import { useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "hooks/use-query";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { AppDispatch } from "store/store";

import cx from "classnames";
import { setViewProgress } from "actions/expoActions/viewer-actions";

// - -

type ReplayButtonProps = {
  isAnyTutorialOpened: boolean;
  setKey: Dispatch<SetStateAction<number>>;
};

const ReplayButton = ({ isAnyTutorialOpened, setKey }: ReplayButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery();
  const isScreenInPreview = useMemo(() => query.get("preview"), [query]);

  const replay = useCallback(() => {
    dispatch(setViewProgress({ timeElapsed: 0 }));
    setKey((prev) => (prev + 1) % 1000);
  }, [dispatch, setKey]);

  return (
    <>
      {isScreenInPreview && (
        <div
          className={cx(
            "pointer-events-auto",
            isAnyTutorialOpened && "bg-black opacity-40"
          )}
        >
          <Button color="white" onClick={replay}>
            <Icon name="replay" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ReplayButton;
