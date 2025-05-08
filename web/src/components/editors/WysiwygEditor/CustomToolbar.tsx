import "react-quill/dist/quill.snow.css";

// NOTE: For basic tooltips, you can use title prop
// e.g. <button title="Bold">

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
        <CustomQuoteButton />
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
        <button className="ql-clean"></button>
      </span>
    </div>
  );
};

export default CustomToolbar;

// - - -

const CustomQuoteButton = () => {
  return (
    <button id="custom-cz-quote-button" type="button">
      <i className="bi bi-quote" />
    </button>
  );
};
