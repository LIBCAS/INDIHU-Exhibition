import { useState, useRef, useCallback, useMemo } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
import { useDispatch } from "react-redux";

// Hooks
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useOnClickOutside } from "hooks/use-on-click-outside";

// Components
import HelpIcon from "components/help-icon";
import { Icon } from "components/icon/icon";

// Types
import { AppDispatch } from "store/store";

// Redux (actions)
import { updateScreenData } from "actions/expoActions/screen-actions";

// Utils
import { palette } from "palette";

// - - - - - -

type ScreenBackgroundColorPickerProps = {
  color: string | null;
  label: string;
  helpText: string;
};

const ScreenBackgroundColorPicker = ({
  color,
  label,
  helpText,
}: ScreenBackgroundColorPickerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { expoDesignData } = useExpoDesignData();

  // - - - Derived variables - - -

  const defaultColorValue = useMemo(
    () => expoDesignData?.backgroundColor ?? palette.background,
    [expoDesignData?.backgroundColor]
  );

  const colorValue = useMemo(
    () => color ?? defaultColorValue,
    [color, defaultColorValue]
  );

  // - - - Refs - - -

  const popoverColorPickerRef = useRef<HTMLDivElement | null>(null);
  const paletteIconContainerRef = useRef<HTMLDivElement | null>(null);

  // - - - States - - -

  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [isColorEditModeOn, setIsColorEditModeOn] = useState<boolean>(false);

  // - - - Callbacks - - -

  const openColorPicker = useCallback(() => setIsColorPickerOpen(true), []);

  const closeColorPicker = useCallback(() => {
    setIsColorPickerOpen(false);
  }, []);

  // - - - Hooks - - -

  useOnClickOutside(
    popoverColorPickerRef,
    closeColorPicker,
    "mousedown",
    paletteIconContainerRef
  );

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <label className="font-['Work_Sans'] text-[12px] text-black/[.54] inline-block mb-3 mt-2">
          {label}
        </label>
        <HelpIcon label={helpText} id="screen-background-color-help" />
      </div>

      <div className="relative">
        {/* 1. Color Input Field */}
        <div className="flex gap-2 justify-between border-[1px] border-solid border-black/[.54] rounded p-2">
          <div
            className="w-1/6 border-[1px] border-solid border-black"
            style={{ backgroundColor: colorValue }}
          />

          <div className="w-4/6 font-['Work_Sans'] text-xl text-center self-center">
            {isColorEditModeOn ? (
              <div>
                <HexColorInput
                  color={colorValue}
                  onChange={(newColor: string) => {
                    dispatch(updateScreenData({ screenBgColor: newColor }));
                  }}
                  //onBlur={() => {}}
                  className="border-[1px] border-solid border-black outline-none text-center"
                />
              </div>
            ) : (
              <div>{colorValue}</div>
            )}
          </div>

          <div className="w-1/6 self-center flex justify-end mr-2 gap-2">
            <Icon
              name={isColorEditModeOn ? "done" : "edit"}
              containerClassName="cursor-pointer"
              useMaterialUiIcon
              iconStyle={{ fontSize: "24px" }}
              onClick={() => setIsColorEditModeOn((prev) => !prev)}
            />
            <div ref={paletteIconContainerRef}>
              <Icon
                name="palette"
                containerClassName="cursor-pointer"
                useMaterialUiIcon
                iconStyle={{ fontSize: "24px" }}
                onClick={() => !isColorEditModeOn && openColorPicker()}
              />
            </div>
            <Icon
              name="restart_alt"
              containerClassName="cursor-pointer"
              useMaterialUiIcon
              iconStyle={{ fontSize: "24px" }}
              onClick={() => {
                dispatch(
                  updateScreenData({ screenBgColor: defaultColorValue })
                );
              }}
            />
          </div>
        </div>

        {/* 2. React Colorful Palette Picker */}
        {isColorPickerOpen && (
          <div
            ref={popoverColorPickerRef}
            className="absolute rounded-lg"
            style={{ bottom: "calc(100% + 2px)", right: "2px" }}
          >
            <HexAlphaColorPicker
              color={colorValue}
              onChange={(newColor: string) => {
                dispatch(updateScreenData({ screenBgColor: newColor }));
              }}
              //onBlur={(_e) => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenBackgroundColorPicker;
