import {
  useState,
  useRef,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useField } from "formik";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

import { useOnClickOutside } from "hooks/use-on-click-outside";
import { Icon } from "components/icon/icon";

/* Designed to use with <Formik> context component, but possible to use also without
if, by using react state from useState which is supplied through the color and setColot props. */

// - - - - - - - -

type ColorPickerProps = {
  name: string;
  label?: string;
  color?: string;
  setColor?: Dispatch<SetStateAction<string>>;
  backupColor?: string;
};

const ColorPicker = ({
  name,
  color,
  setColor,
  label,
  backupColor,
}: ColorPickerProps) => {
  // field contains { name, value, onChange, onBlur, .. }
  // meta contains { value, error, touched, initialValue, initialError, initialTouched }
  // helper contains { setValue, setError, setTouched }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helper] = useField<string | undefined>(name); // string as color here!

  const colorValue = useMemo(
    () => color ?? field.value ?? backupColor,
    [backupColor, color, field.value]
  );

  const colorValueFormik = useMemo(
    () => field.value ?? backupColor,
    [backupColor, field.value]
  );

  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [isColorEditModeOn, setIsColorEditModeOn] = useState<boolean>(false);

  const popoverColorPickerRef = useRef<HTMLDivElement | null>(null);
  const paletteIconContainerRef = useRef<HTMLDivElement | null>(null);

  const openColorPicker = useCallback(() => setIsColorPickerOpen(true), []);

  const closeColorPicker = useCallback(() => {
    setIsColorPickerOpen(false);
  }, []);

  useOnClickOutside(
    popoverColorPickerRef,
    closeColorPicker,
    "mousedown",
    paletteIconContainerRef
  );

  return (
    <div>
      {label && (
        <label className="font-['Work_Sans'] text-[12px] text-black/[.54] inline-block mb-3 mt-2">
          {label}
        </label>
      )}

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
                    helper.setValue(newColor);
                    if (setColor) setColor(newColor);
                  }}
                  onBlur={() => helper.setTouched(true)}
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
                helper.setValue(newColor);
                if (setColor) setColor(newColor);
              }}
              onBlur={(_e) => helper.setTouched(true)}
            />

            {/* When using formik, so not using classic useState, then we need this helper input */}
            {!color && !setColor && (
              <input
                type="color"
                className="hidden"
                // Field handling
                name={colorValueFormik}
                value={colorValueFormik}
                onChange={(e) => {
                  helper.setValue(e.target.value);
                }}
                onBlur={(_e) => {
                  helper.setTouched(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
