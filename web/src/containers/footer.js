const Link = ({ label, url }) => (
  <a
    className="footer-link"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
  </a>
);

const links = [
  { url: "https://ocr.indihu.cz/", label: "INDIHU OCR" },
  { url: "https://mind.indihu.cz/", label: "INDIHU Mind" },
  { url: "https://index.indihu.cz/", label: "INDIHU Index" },
].map((link) => <Link key={link.url} {...{ ...link }} />);

const mail = <a href="mailto: info@indihu.cz">info@indihu.cz</a>;

const text = "Aplikace je optimalizována pro prohlížeč Google Chrome.";

const textShort = "Optimalizováno pro Google Chrome.";

const Footer = () => (
  <div>
    <div className="footer screen-size-desktop-bigger-min">
      <div className="flex-row flex-center flex-space-between full-height">
        <div className="flex flex-center">{links}</div>
        {text}
        {mail}
      </div>
    </div>
    <div className="footer screen-size-desktop-bigger-max screen-size-phablet-min">
      <div className="flex-col flex-centered full-height">
        <div
          className="flex-row flex-center flex-space-between"
          style={{ marginBottom: 4 }}
        >
          <div className="flex flex-center">{links}</div>
          <div className="flex flex-right">{mail}</div>
        </div>
        <div className="flex flex-centered">{text}</div>
      </div>
    </div>
    <div className="footer footer-mobile screen-size-phablet-max">
      <div className="flex-col flex-centered full-height">
        <div className="flex flex-centered">{mail}</div>
        <div className="flex flex-center">{links}</div>
        <div className="flex flex-centered screen-size-mobile-min">{text}</div>
        <div className="flex flex-centered screen-size-mobile-max">
          {textShort}
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
