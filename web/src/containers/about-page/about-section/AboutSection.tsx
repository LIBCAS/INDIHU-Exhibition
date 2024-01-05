import "./about-section.scss";

const AboutSection = () => {
  return (
    <section id="about-section" className="about-section">
      <div className="image-background-overlay" />

      {/*  */}
      <div className="description px-[30px] md:pl-[54px] flex flex-col justify-center items-start gap-8 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col justify-center items-start gap-8">
          <h1>O aplikaci</h1>
          <p>
            Aplikace na vytváření virtuálních výstav INDIHU Exhibition je
            provozována Knihovnou Akademie věd České republiky. Určena je
            především pracovníkům ústavů AV ČR, vysokých škol a paměťových
            institucí. Využití je bezplatné a je podmíněno registrací, která je
            následně schválena administrátorem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
