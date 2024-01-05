import "./tou-content-section.scss";

const TouContentSection = () => {
  return (
    <section id="tou-content-section" className="tou-content-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col gap-2">
          <h2 className="title">Informace:</h2>
          <p>
            Aplikace na vytváření virtuálních výstav INDIHU Exhibition je
            provozována Knihovnou AV ČR, v. v. i. Určena je především
            pracovníkům ústavů AV ČR, vysokých škol, studentům a paměťových
            institucí. Využití je bezplatné a je podmíněno registrací, která je
            následně schválena administrátorem.
          </p>
          <p>
            Knihovna Akademie věd ČR se zavazuje tuto aplikaci dlouhodobě
            provozovat na adrese{" "}
            <a
              href="https://exhibition.indihu.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://exhibition.indihu.cz/
            </a>
            . V případě, že by se měnily podmínky provozování, budou uživatelé
            informováni. Technické podrobnosti a popis použití jsou uvedeny v
            uživatelském manuálu{" "}
            <a
              href="https://libcas.github.io/indihu-manual/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://libcas.github.io/indihu-manual/
            </a>
            .
          </p>
          <p>
            Software INDIHU Exhibition byl vyvinut jako open source pod licencí
            GNU GPL v3 v rámci projektu &quot;INDIHU - vývoj nástrojů a
            infrastruktury pro digital humanities&quot; podpořeného z programu
            MK ČR NAKI v letech 2016-2020 pod označením DG16P02B039. Více o
            projektu na{" "}
            <a
              href="https://indihu.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://indihu.cz/
            </a>{" "}
            .
          </p>
          <p>
            Další informace jsou k dispozici ve vývojovém prostředí na{" "}
            <a
              href="https://github.com/LIBCAS/INDIHU-Exhibition"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://github.com/LIBCAS/INDIHU-Exhibition
            </a>
            .
          </p>
          <p>
            Kontaktní mail:{" "}
            <a
              href="mailto:info@indihu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              info@indihu.cz
            </a>
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>Podmínky použití:</h2>
          <p>
            Aplikace na vytváření virtuálních výstav INDIHU Exhibition je
            provozována Knihovnou AV ČR, v. v. i., se sídlem Národní 1009/3,
            Praha 1, 110 00. Kontakt:{" "}
            <a
              href="mailto:info@indihu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              info@indihu.cz
            </a>
            .
          </p>
          <p>
            Aplikace je kreativním nástrojem pro tvorbu virtuálních výstav.
            Umožňuje vám zpřístupnit obsah vašich výstav veřejnosti. Žádný
            obsah, který do aplikace nahrajete nebo jejím prostřednictvím
            zpřístupníte, nesmí porušovat práva třetích osob, zejména ochranu
            osobnosti nebo autorská práva.
          </p>
          <p>
            Aplikace je určena především ústavům AV ČR, vysokým školám a
            paměťovým institucím, tedy i jejich zaměstnancům, vědcům a
            studentům. Využití je bezplatné a je podmíněno registrací, která je
            následně schválena administrátorem. Registrace je nutná z důvodu
            ověření totožnosti organizace a zřízení účtu.
          </p>
          <p>
            Knihovna Akademie věd ČR tuto aplikaci provozuje na adrese{" "}
            <a
              href="https://exhibition.indihu.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://exhibition.indihu.cz/
            </a>
            .
          </p>
          <p>
            V případě, že by se měnily podmínky provozování, budou uživatelé
            informováni. Pokud byste s novými podmínkami nesouhlasili, máte
            možnost se ze služby do 30 dnů odhlásit, v opačném případě máme za
            to, že se změnou podmínek poskytování služby souhlasíte.
          </p>
          <p>
            Technické podrobnosti a popis použití jsou uvedeny v uživatelském
            manuálu{" "}
            <a
              href="https://libcas.github.io/indihu-manual/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://libcas.github.io/indihu-manual/
            </a>
            .
          </p>
          <p>
            Software INDIHU Exhibition byl vyvinut jako open source pod licencí
            GNU GPL v3 v rámci projektu &quot;INDIHU - vývoj nástrojů a
            infrastruktury pro digital humanities&quot; podpořeného z programu
            MK ČR NAKI v letech 2016-2020 pod označením DG16P02B039. Více o
            projektu na{" "}
            <a
              href="https://indihu.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://indihu.cz/
            </a>
            .
          </p>
          <p>
            Další informace jsou k dispozici ve vývojovém prostředí na{" "}
            <a
              href="https://github.com/LIBCAS/INDIHU-Exhibition"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://github.com/LIBCAS/INDIHU-Exhibition
            </a>
            .
          </p>
          <p>
            Souhlasem s těmito podmínkami se zavazujete využívat platformu
            INDIHU Exhibition pouze k nekomerčním účelům. Uživatel je povinen
            vypořádat s vlastníky a správci veškerá práva k materiálům využitým
            v jím připravených výstavách.
          </p>
          <p>
            Mějte na paměti, že veškerý autorskoprávní obsah, který v rámci
            výstavy zpřístupníte, musíte mít ošetřený příslušnými licencemi.
          </p>
          <p>
            Provozovatel si vyhrazuje právo bez předchozího upozornění
            znepřístupnit, případně zcela odstranit, výstavy a materiály, u
            kterých nejsou uživatelem dostatečně vypořádána autorská a
            vlastnická práva nebo pokud jinak porušují právní předpisy či nejsou
            vhodné z etického hlediska.
          </p>
          <p>
            V případě, že zjistíte porušení práv třetích osob nebo jakékoliv
            jiné porušení právních předpisů, kontaktujte nás na výše uvedených
            kontaktních údajích, nahlášením se budeme zabývat. Děkujeme.
          </p>
          <p>
            Registrací do platformy INDIHU Exhibition na adrese{" "}
            <a
              href="https://exhibition.indihu.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tou-link"
            >
              https://exhibition.indihu.cz/
            </a>{" "}
            uživatel s těmito podmínkami souhlasí a zavazuje se je dodržovat.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TouContentSection;
