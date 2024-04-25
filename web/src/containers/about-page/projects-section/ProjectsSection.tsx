import "./projects-section.scss";

import mainSymbolWhite from "../../../assets/img/landing-page/main-symbol-white.png";

const ProjectsSection = () => {
  return (
    <section id="projects-section" className="projects-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h2>Projekty</h2>
        <p>
          Veřejnosti z řad věd vědců, pracovníků paměťových institucí či
          studentů jsou k dispozici čtyři nástroje - Index, Exhibition, Mind a
          OCR. Produkty INDIHU řeší aktuální problémy v oblasti digitalizace
          vědecké práce a společně vytváří komplexní sadu nástrojů, které dosud
          na trhu k dispozici nebyly.
        </p>
      </div>

      {/* Logos */}
      <div className="mt-[64px] px-[16px] md:px-[32px] lg:px-[64px] flex flex-wrap justify-center items-center gap-[64px]">
        <a
          href="https://index.indihu.cz/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-start items-center gap-[32px]"
        >
          <img
            width={280}
            height={280}
            src={mainSymbolWhite}
            alt="INDIHU Index"
            title="INDIHU Index"
          />
          <p className="!font-medium !text-[28px]">INDIHU Index</p>
        </a>

        <a
          href="/"
          className="flex flex-col justify-start items-center gap-[32px]"
        >
          <img
            width={280}
            height={280}
            src={mainSymbolWhite}
            alt="INDIHU Exhibition"
            title="INDIHU Exhibition"
          />
          <p className="!font-medium !text-[28px]">INDIHU Exhibition</p>
        </a>

        <a
          href="https://mind.indihu.cz/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-start items-center gap-[32px]"
        >
          <img
            width={280}
            height={280}
            src={mainSymbolWhite}
            alt="INDIHU Mind"
            title="INDIHU Mind"
          />
          <p className="!font-medium !text-[28px]">INDIHU Mind</p>
        </a>

        <a
          href="https://ocr.indihu.cz/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-start items-center gap-[32px]"
        >
          <img
            width={280}
            height={280}
            src={mainSymbolWhite}
            alt="INDIHU OCR"
            title="INDIHU OCR"
          />
          <p className="!font-medium !text-[28px]">INDIHU OCR</p>
        </a>
      </div>
    </section>
  );
};

export default ProjectsSection;
