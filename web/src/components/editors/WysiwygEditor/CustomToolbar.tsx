import "react-quill/dist/quill.snow.css";

// https://quilljs.com/docs/modules/toolbar/
const CustomToolbar = () => {
  return (
    <div id="custom-toolbar-container">
      <span className="ql-formats">
        <select className="ql-size"></select>
      </span>

      <span className="ql-formats">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
      </span>

      <span className="ql-formats">
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>
      </span>

      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>

      <span className="ql-formats">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
      </span>

      <span className="ql-formats">
        <button className="ql-link"></button>
      </span>

      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
    </div>
  );
};

export default CustomToolbar;
