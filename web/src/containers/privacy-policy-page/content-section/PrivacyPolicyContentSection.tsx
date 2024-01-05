import "./privacy-policy-content-section.scss";

const PrivacyPolicyContentSection = () => {
  return (
    <section id="pp-content-section" className="pp-content-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col gap-2">
          <p>
            Jsme Knihovna AV ČR, v. v. i., se sídlem Národní 1009/3, Praha 1,
            110 00. Kontakt:{" "}
            <a
              href="mailto:sekretariat@knav.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-link"
            >
              sekretariat@knav.cz
            </a>
            , 221 403 260.
          </p>
          <p>
            Provozujeme webové stránky{" "}
            <a
              href="https://exhibition.indihu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-link"
            >
              https://exhibition.indihu.cz
            </a>
            , na kterých se můžete zaregistrovat do aplikace INDIHU Exhibition,
            která umožňuje vytvořit a zpřístupnit vaše virtuální výstavy
            veřejnosti.
          </p>
          <p>
            Pro poskytnutí naší služby zpracováváme některé vaše osobní údaje.
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>S jakými osobními údaji pracujeme?</h2>
          <p>
            Pokud se chcete zaregistrovat a používat nástroj INDIHU Exhibition,
            budeme zpracovávat vaše registrační údaje. Jsou to jméno, příjmení,
            název instituce, pod kterou vystupujete, a e-mailová adresa.
          </p>
          <p>Proč?</p>
          <p>
            na e-mail vám zašleme potvrzení, že jste poptali náš nástroj,
            ověříme, že splňujete podmínky pro registraci, pokud podmínky
            splňujete, zřídíme vám přes tyto údaje váš přístupový účet, přes
            e-mail s vámi budeme komunikovat.
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>Kdo se k datům dostane?</h2>
          <p>
            Vaše data zůstanou u nás, dostanou se k nim pouze naši zaměstnanci.
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>Jak dlouho s daty pracujeme a na základě čeho?</h2>
          <p>
            Pokud vám zřídíme účet, budeme vaše data zpracovávat po dobu vašeho
            aktivního využívání účtu. Účet můžete zrušit, případně vám účet
            zrušíme, pokud ho nebudete používat déle než 3 roky. Takové
            zpracování je nutné pro poskytnutí služby a umožňuje ho nařízení
            GDPR – protože plníme své závazky a dále povinnosti podle právních
            předpisů.
          </p>
          <p>
            Pokud jste nás kontaktovali, ale služby nakonec nebudete využívat,
            vaše data budeme zpracovávat nejdéle 6 měsíců od naší poslední
            komunikace. Takovou práci s daty nám umožňuje nařízení GDPR –
            protože jednáme o smlouvě.
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>Ještě byste měli vědět:</h2>
          <p>
            Pokud byste potřebovali ohledně osobních údajů cokoliv probrat,
            napište nám na e-mail{" "}
            <a
              href="mailto:info@indihu.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-link"
            >
              info@indihu.cz
            </a>{" "}
            nebo zavolejte na číslo 221 403 260. Rádi vám pomůžeme.
          </p>
          <p>
            Máme pověřence pro oblast zpracování osobních údajů: Mgr. Radek
            Lomnický, tel. č. 221 403 466, 605 416 493,{" "}
            <a
              href="mailto:poverenec@ssc.cascz"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-link"
            >
              poverenec@ssc.cascz
            </a>
            .
          </p>
          <p>
            Nařízení GDPR (nařízení Evropského parlamentu a Rady (EU) č.
            2016/679 o ochraně fyzických osob v souvislosti se zpracováním
            osobních údajů a o volném pohybu těchto údajů a o zrušení směrnice
            95/46/ES), které oblast osobních údajů upravuje, vám dává mimo jiné
            právo obrátit se na nás a chtít informace, jaké vaše osobní údaje
            zpracováváme, vyžádat si u nás přístup k těmto údajům a nechat je
            aktualizovat nebo opravit, popřípadě požadovat omezení zpracování,
            můžete požadovat kopii zpracovávaných osobních údajů, požadovat po
            nás v určitých situacích výmaz osobních údajů a v určitých případech
            máte právo na jejich přenositelnost. Pokud si myslíte, že s daty
            nenakládáme správně, máte právo podat stížnost u Úřadu pro ochranu
            osobních údajů, případně se se svými nároky obrátit na soud.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyContentSection;
