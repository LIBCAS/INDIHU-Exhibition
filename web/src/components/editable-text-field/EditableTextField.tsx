import { useState, useRef } from "react";
import { useOnClickOutside } from "hooks/use-on-click-outside";

// Components
import { TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

// - -

type ComponentType = "div" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type EditableTextFieldProps = {
  id: string;
  value: string;
  onCommit: (newValue: string) => void;
  textComponent: ComponentType;
  textComponentClassName?: string;
};

const EditableTextField = ({
  id,
  value,
  onCommit,
  textComponent,
  textComponentClassName,
}: EditableTextFieldProps) => {
  const [text, setText] = useState<string>(value);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTextHovered, setIsTextHovered] = useState<boolean>(false);

  const handleCancel = () => {
    setIsEditing(false);
    setText(value);
  };

  // On click outside of editable text field, cancel changes
  const editableFieldRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(editableFieldRef, handleCancel);

  return isEditing ? (
    <div
      ref={editableFieldRef}
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <TextField
        sx={{
          minWidth: "75px",
          "& .MuiInputBase-root:after": {
            borderBottomColor: "#083d77",
          },
        }}
        id={id}
        size="small"
        variant="standard"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <IconButton
        sx={{ padding: 0 }}
        onClick={() => {
          onCommit(text);
          setIsEditing(false);
        }}
      >
        <DoneIcon sx={{ fontSize: "20px" }} />
      </IconButton>
    </div>
  ) : (
    <div
      className="flex items-center gap-1"
      onMouseEnter={() => setIsTextHovered(true)}
      onMouseLeave={() => setIsTextHovered(false)}
      onDoubleClick={() => setIsEditing(true)}
    >
      {getNonEditableTextComponent(
        textComponent,
        value,
        textComponentClassName
      )}
      <IconButton
        sx={{
          padding: 0,
          alignSelf: "start",
          visibility: isTextHovered ? "visible" : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <EditIcon sx={{ fontSize: "18px" }} />
      </IconButton>
    </div>
  );
};

export default EditableTextField;

// - - -

const getNonEditableTextComponent = (
  textComponent: ComponentType,
  value: string,
  textComponentClassName?: string
) => {
  return textComponent === "div" ? (
    <div className={textComponentClassName}>{value}</div>
  ) : textComponent === "span" ? (
    <span className={textComponentClassName}>{value}</span>
  ) : textComponent === "h1" ? (
    <h1 className={textComponentClassName}>{value}</h1>
  ) : textComponent === "h2" ? (
    <h2 className={textComponentClassName}>{value}</h2>
  ) : textComponent === "h3" ? (
    <h3 className={textComponentClassName}>{value}</h3>
  ) : textComponent === "h4" ? (
    <h4 className={textComponentClassName}>{value}</h4>
  ) : textComponent === "h5" ? (
    <h5 className={textComponentClassName}>{value}</h5>
  ) : (
    <h6 className={textComponentClassName}>{value}</h6>
  );
};
