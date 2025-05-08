import "react-quill/dist/quill.snow.css";

import { BasicTooltip } from "components/tooltip/BasicTooltip";
import { BasicTooltipProps } from "components/tooltip/tooltip-props";
import { useTranslation } from "react-i18next";

// https://quilljs.com/docs/modules/toolbar/
const CustomToolbar = () => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "wysiwygTooltips" });

  return (
    <div id="custom-toolbar-container">
      {/* 1. Size */}
      <CustomToolbarBox>
        <CustomToolbarSelect className="ql-size" />
      </CustomToolbarBox>

      {/* 2. Bold + Italic + Underline + Strike */}
      <CustomToolbarBox>
        <CustomToolbarButton
          className="ql-bold"
          tooltip={{ id: "ql-bold", content: t("bold"), variant: "dark" }}
        />
        <CustomToolbarButton
          className="ql-italic"
          tooltip={{ id: "ql-italic", content: t("italic"), variant: "dark" }}
        />
        <CustomToolbarButton
          className="ql-underline"
          tooltip={{
            id: "ql-underline",
            content: t("underline"),
            variant: "dark",
          }}
        />
        <CustomToolbarButton
          className="ql-strike"
          tooltip={{ id: "ql-strike", content: t("strike"), variant: "dark" }}
        />
      </CustomToolbarBox>

      {/* 3. Czech Quotation + Sub script + Super script */}
      <CustomToolbarBox>
        <CustomToolbarButton
          className="custom-cz-quote-button" // no effect
          id="custom-cz-quote-button"
          tooltip={{
            id: "custom-cz-quote-button",
            content: t("czechQuotation"),
            variant: "dark",
          }}
        >
          <i className="bi bi-quote" />
        </CustomToolbarButton>
        <CustomToolbarButton
          className="ql-script"
          value="sub"
          tooltip={{
            id: "ql-script-sub",
            content: t("subScript"),
            variant: "dark",
          }}
        />
        <CustomToolbarButton
          className="ql-script"
          value="super"
          tooltip={{
            id: "ql-script-super",
            content: t("superScript"),
            variant: "dark",
          }}
        />
      </CustomToolbarBox>

      {/* 4. Align */}
      <CustomToolbarBox>
        <CustomToolbarSelect
          className="ql-align"
          tooltip={{ id: "ql-align", content: t("align"), variant: "dark" }}
        />
      </CustomToolbarBox>

      {/* 5. List ordered + List bullet */}
      <CustomToolbarBox>
        <CustomToolbarButton
          className="ql-list"
          value="ordered"
          tooltip={{
            id: "ql-list-ordered",
            content: t("listOrdered"),
            variant: "dark",
          }}
        />
        <CustomToolbarButton
          className="ql-list"
          value="bullet"
          tooltip={{
            id: "ql-list-bullet",
            content: t("listBullet"),
            variant: "dark",
          }}
        />
      </CustomToolbarBox>

      {/* 6. Link + Clean */}
      <CustomToolbarBox>
        <CustomToolbarButton
          className="ql-link"
          tooltip={{ id: "ql-link", content: t("link"), variant: "dark" }}
        />
        <CustomToolbarButton
          className="ql-clean"
          tooltip={{ id: "ql-clean", content: t("clean"), variant: "dark" }}
        />
      </CustomToolbarBox>
    </div>
  );
};

export default CustomToolbar;

// - - - - - - - - - - - - - - - - - - - - - - - -

type CustomToolbarBoxProps = {
  children: React.ReactNode;
};

const CustomToolbarBox = ({ children }: CustomToolbarBoxProps) => {
  return <span className="ql-formats">{children}</span>;
};

// - - - - - - - - - - - - - - - - - - - - - - - -

type CustomToolbarButtonProps = {
  className: string;
  value?: string;
  id?: string;
  tooltip?: BasicTooltipProps;
  children?: React.ReactNode;
};

const CustomToolbarButton = ({
  className,
  value,
  id,
  tooltip,
  children,
}: CustomToolbarButtonProps) => {
  return (
    <>
      <button
        className={className}
        value={value}
        id={id}
        data-tooltip-id={tooltip?.id ?? undefined}
      >
        {children}
      </button>

      {tooltip && <BasicTooltip {...tooltip} />}
    </>
  );
};

// - - - - - - - - - - - - - - - - - - - - - - - -

type CustomToolbarSelectProps = {
  className: string;
  tooltip?: BasicTooltipProps;
};

const CustomToolbarSelect = ({
  className,
  tooltip,
}: CustomToolbarSelectProps) => {
  return (
    <>
      <select
        className={className}
        data-tooltip-id={tooltip?.id ?? undefined}
      />

      {tooltip && <BasicTooltip {...tooltip} />}
    </>
  );
};
