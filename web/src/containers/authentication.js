import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import AppHeader from "../components/app-header";
import ComponentLoader from "../components/component-loader";
import Button from "react-md/lib/Buttons/Button";
import Captcha from "../components/form/redux-form/captcha";
import TextField from "../components/form/redux-form/text-field";
import CheckBox from "../components/form/redux-form/check-box";
import * as Validation from "../components/form/redux-form/validation";
import { setDialog, closeDialog } from "../actions/dialog-actions";
import {
  availableRegistration,
  signIn,
  registration,
} from "../actions/user-actions";
import { resetForm } from "../actions/app-actions";
import Footer from "./footer";

const Authentication = ({
  handleSubmit,
  setDialog,
  regAvailable,
  isSignIn,
  change,
  loader,
  captchaKey,
  handleInfo,
  handleGDPR,
}) => (
  <div className="authentication-container">
    <AppHeader
      authStyle
      isSignIn={!!isSignIn}
      handleInfo={handleInfo}
      handleGDPR={handleGDPR}
    />
    <div className="authentication">
      <div className="left">
        <h1>Kreativní nástroj pro tvorbu virtuálních výstav</h1>
        <p>
          Vytvářejte působivé online prezentace na libovolná témata, která budou
          návštěvníkům dostupná na webu. INDIHU Exhibition umožňuje vtáhnout
          návštěvníka do děje a tvořit obsahově bohaté prezentace. Kombinujte
          obrázky, texty, fotogalerie, videa, mapy s dalšími možnostmi. Zařaďte
          do výstavy i drobné interaktivní hry.
        </p>
      </div>
      <div className="right">
        {!loader && (regAvailable || isSignIn) ? (
          <div>
            <h3 style={{ marginTop: "1em" }}>
              <strong>
                {isSignIn ? "Přihlášení" : "Začněte vytvářet výstavy"}
              </strong>
            </h3>
            {!isSignIn && <p>Nástroj je zcela zdarma</p>}
          </div>
        ) : (
          <div />
        )}
        {loader ? (
          <div className="full-width flex-col flex-centered margin-top-small">
            <ComponentLoader />
            <h4 className="margin-top">Načítá se registrační formulář.</h4>
          </div>
        ) : isSignIn ? (
          <form onSubmit={handleSubmit}>
            <Field
              component={TextField}
              componentId="authentification-textfield-name"
              name="name"
              label="Užívatelské jméno/e-mail"
              validate={[Validation.required]}
            />
            <Field
              component={TextField}
              componentId="authentification-textfield-password"
              name="password"
              type="password"
              label="Heslo"
              validate={[Validation.required]}
            />
            <div className="authentication-buttons">
              <Button
                raised
                primary
                label="Přihlásit"
                type="submit"
                className="authentication-button"
              />
              <Button
                flat
                label="Resetovat heslo"
                onClick={() => setDialog("PasswordReset")}
                className="authentication-button margin-left-small"
              />
            </div>
          </form>
        ) : regAvailable ? (
          <form onSubmit={handleSubmit}>
            <Field
              component={TextField}
              componentId="registration-textfield-firstname"
              name="firstName"
              label="Jméno"
              validate={[Validation.required]}
            />
            <Field
              component={TextField}
              componentId="registration-textfield-surname"
              name="surname"
              label="Příjmení"
              validate={[Validation.required]}
            />
            <Field
              component={TextField}
              componentId="registration-textfield-institution"
              name="institution"
              label="Instituce"
              validate={[Validation.required]}
            />
            <Field
              component={TextField}
              componentId="registration-textfield-email"
              name="email"
              label="E-mail"
              validate={[Validation.required, Validation.email]}
            />
            <Field
              component={TextField}
              componentId="registration-textfield-password"
              name="password"
              type="password"
              label="Heslo (min 5 znaků)"
              validate={[Validation.required, Validation.password]}
            />
            <div className="flex-row flex-center">
              <Field
                component={CheckBox}
                componentId="registration-checkbox-accepted"
                name="accepted"
                type="accepted"
                validate={[Validation.required]}
                customLabel={
                  <div>
                    Souhlasím s{" "}
                    <span
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={handleInfo}
                    >
                      podmínkami užití
                    </span>
                  </div>
                }
              />
            </div>
            <div className="flex-row flex-centered margin-top-very-small margin-bottom-small">
              <Field
                key={captchaKey}
                component={Captcha}
                name="captcha"
                changeValue={change}
                validate={[Validation.required]}
              />
            </div>
            <div className="authentication-buttons">
              <Button
                raised
                primary
                label="Registrovat"
                type="submit"
                className="authentication-button"
              />
            </div>
          </form>
        ) : (
          <h4 className="text-center margin-none">
            <strong>Registrace nejsou v současné době povoleny.</strong>
          </h4>
        )}
      </div>
    </div>
    <Footer />
  </div>
);

export default compose(
  withRouter,
  withState("loader", "showLoader", false),
  withState("captchaKey", "setCaptchaKey", false),
  connect(null, {
    setDialog,
    closeDialog,
    availableRegistration,
    signIn,
    registration,
    resetForm,
  }),
  lifecycle({
    async UNSAFE_componentWillMount() {
      const { isSignIn, showLoader } = this.props;

      if (!isSignIn) {
        showLoader(true);
        const regAvailable = await this.props.availableRegistration();
        this.setState({ regAvailable });
        showLoader(false);
      }
    },
  }),
  withHandlers({
    onSubmit:
      ({
        signIn,
        history,
        isSignIn,
        registration,
        resetForm,
        setDialog,
        closeDialog,
        setCaptchaKey,
        captchaKey,
      }) =>
      async (formData) => {
        if (isSignIn) {
          const signSuccess = await signIn(formData.name, formData.password);
          if (signSuccess) history.push("/exhibitions");
          else
            throw new SubmissionError({
              password: "*Chybné přihlašovací údaje",
            });
        } else {
          const ret = await registration(formData);
          if (ret === 201) {
            resetForm("auth");
            setCaptchaKey(!captchaKey);
            await closeDialog();
            setDialog("Info", {
              title: "Potvrzení registrace",
              text: `Potvrďte svou registraci linkem zaslaným na adresu ${formData.email}`,
            });
          } else if (ret === 412) {
            resetForm("auth");
            setCaptchaKey(!captchaKey);
            await closeDialog();
            setDialog("Info", {
              title: "E-mailová adresa nalezena",
              text: "Účet s Vaší e-mailovou adresou byl již nalezen. Zkuste se přihlásit svými korporátními přihlašovacími údaji.",
            });
          } else if (ret === 409) {
            throw new SubmissionError({
              email: "*Účet s danou emailovou adresou již existuje",
            });
          } else {
            throw new SubmissionError({
              captcha: "Registrace neúspěšná",
            });
          }
        }
      },
    handleInfo:
      ({ setDialog }) =>
      () => {
        setDialog("Info", {
          title: "INDIHU Exhibition - Informace a podmínky použití",
          text: (
            <div>
              <p style={{ fontWeight: "bold" }}>Informace:</p>
              <p>
                Aplikace na vytváření virtuálních výstav INDIHU Exhibition je
                provozována Knihovnou AV ČR, v. v. i. Určena je především
                pracovníkům ústavů AV ČR, vysokých škol, studentům a paměťových
                institucí. Využití je bezplatné a je podmíněno registrací, která
                je následně schválena administrátorem.
              </p>
              <p>
                Knihovna Akademie věd ČR se zavazuje tuto aplikaci dlouhodobě
                provozovat na adrese{" "}
                <a
                  href="https://exhibition.indihu.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  https://exhibition.indihu.cz/
                </a>
                . V případě, že by se měnily podmínky provozování, budou
                uživatelé informováni. Technické podrobnosti a popis použití
                jsou uvedeny v uživatelském manuálu{" "}
                <a
                  href="https://nnis.github.io/indihu-manual/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  https://nnis.github.io/indihu-manual/
                </a>
                .
              </p>
              <p>
                Software INDIHU Exhibition byl vyvinut jako open source pod
                licencí GNU GPL v3 v rámci projektu &quot;INDIHU - vývoj
                nástrojů a infrastruktury pro digital humanities&quot;
                podpořeného z programu MK ČR NAKI v letech 2016-2020 pod
                označením DG16P02B039. Více o projektu na{" "}
                <a
                  href="https://indihu.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
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
                  className="link"
                >
                  https://github.com/LIBCAS/INDIHU-Exhibition
                </a>
                .
              </p>
              <p>
                Kontaktní mail:{" "}
                <a href="mailto:info@indihu.cz">info@indihu.cz</a>
              </p>
              <p style={{ fontWeight: "bold", marginTop: "2em" }}>
                Podmínky použití:
              </p>
              <ol>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Aplikace na vytváření virtuálních výstav INDIHU Exhibition
                    je provozována Knihovnou AV ČR, v. v. i., se sídlem Národní
                    1009/3, Praha 1, 110 00. Kontakt:{" "}
                    <a
                      href="mailto:info@indihu.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      info@indihu.cz
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Aplikace je kreativním nástrojem pro tvorbu virtuálních
                    výstav. Umožňuje vám zpřístupnit obsah vašich výstav
                    veřejnosti. Žádný obsah, který do aplikace nahrajete nebo
                    jejím prostřednictvím zpřístupníte, nesmí porušovat práva
                    třetích osob, zejména ochranu osobnosti nebo autorská práva.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Aplikace je určena především ústavům AV ČR, vysokým školám a
                    paměťovým institucím, tedy i jejich zaměstnancům, vědcům a
                    studentům. Využití je bezplatné a je podmíněno registrací,
                    která je následně schválena administrátorem. Registrace je
                    nutná z důvodu ověření totožnosti organizace a zřízení účtu.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Knihovna Akademie věd ČR tuto aplikaci provozuje na adrese{" "}
                    <a
                      href="https://exhibition.indihu.cz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      https://exhibition.indihu.cz/
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    V případě, že by se měnily podmínky provozování, budou
                    uživatelé informováni. Pokud byste s novými podmínkami
                    nesouhlasili, máte možnost se ze služby do 30 dnů odhlásit,
                    v opačném případě máme za to, že se změnou podmínek
                    poskytování služby souhlasíte.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Technické podrobnosti a popis použití jsou uvedeny v
                    uživatelském manuálu{" "}
                    <a
                      href="https://nnis.github.io/indihu-manual/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      https://nnis.github.io/indihu-manual/
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Software INDIHU Exhibition byl vyvinut jako open source pod
                    licencí GNU GPL v3 v rámci projektu &quot;INDIHU - vývoj
                    nástrojů a infrastruktury pro digital humanities&quot;
                    podpořeného z programu MK ČR NAKI v letech 2016-2020 pod
                    označením DG16P02B039. Více o projektu na{" "}
                    <a
                      href="https://indihu.cz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      https://indihu.cz/
                    </a>
                    .
                  </p>

                  <p style={{ marginBottom: "0.5em" }}>
                    Další informace jsou k dispozici ve vývojovém prostředí na
                    <a
                      href="https://github.com/LIBCAS/INDIHU-Exhibition"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      https://github.com/LIBCAS/INDIHU-Exhibition
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Souhlasem s těmito podmínkami se zavazujete využívat
                    platformu INDIHU Exhibition pouze k nekomerčním účelům.
                    Uživatel je povinen vypořádat s vlastníky a správci veškerá
                    práva k materiálům využitým v jím připravených výstavách.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Mějte na paměti, že veškerý autorskoprávní obsah, který v
                    rámci výstavy zpřístupníte, musíte mít ošetřený příslušnými
                    licencemi.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    Provozovatel si vyhrazuje právo bez předchozího upozornění
                    znepřístupnit, případně zcela odstranit, výstavy a
                    materiály, u kterých nejsou uživatelem dostatečně vypořádána
                    autorská a vlastnická práva nebo pokud jinak porušují právní
                    předpisy či nejsou vhodné z etického hlediska.
                  </p>
                </li>
                <li>
                  <p style={{ marginBottom: "0.5em" }}>
                    V případě, že zjistíte porušení práv třetích osob nebo
                    jakékoliv jiné porušení právních předpisů, kontaktujte nás
                    na výše uvedených kontaktních údajích, nahlášením se budeme
                    zabývat. Děkujeme.
                  </p>
                </li>
              </ol>
              <p>
                Registrací do platformy INDIHU Exhibition na adrese{" "}
                <a
                  href="https://exhibition.indihu.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  https://exhibition.indihu.cz/
                </a>{" "}
                uživatel s těmito podmínkami souhlasí a zavazuje se je
                dodržovat.
              </p>
            </div>
          ),
          noDialogMenu: true,
          large: true,
        });
      },
    handleGDPR:
      ({ setDialog }) =>
      () => {
        setDialog("Info", {
          title: "INDIHU Exhibition - Zásady práce s osobními údaji",
          text: (
            <div>
              <p>
                Jsme Knihovna AV ČR, v. v. i., se sídlem Národní 1009/3, Praha
                1, 110 00. Kontakt:{" "}
                <a
                  href="mailto:sekretariat@knav.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
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
                  className="link"
                >
                  https://exhibition.indihu.cz
                </a>
                , na kterých se můžete zaregistrovat do aplikace INDIHU
                Exhibition, která umožňuje vytvořit a zpřístupnit vaše virtuální
                výstavy veřejnosti.
              </p>
              <p>
                Pro poskytnutí naší služby zpracováváme některé vaše osobní
                údaje.
              </p>
              <h3 style={{ marginTop: "1em" }}>
                S jakými osobními údaji pracujeme?
              </h3>
              <p>
                Pokud se chcete zaregistrovat a používat nástroj INDIHU
                Exhibition, budeme zpracovávat vaše registrační údaje. Jsou to
                jméno, příjmení, název instituce, pod kterou vystupujete, a
                e-mailová adresa.
              </p>
              <p>Proč?</p>
              <ul>
                <li>
                  na e-mail vám zašleme potvrzení, že jste poptali náš nástroj,
                </li>
                <li>ověříme, že splňujete podmínky pro registraci,</li>
                <li>
                  pokud podmínky splňujete, zřídíme vám přes tyto údaje váš
                  přístupový účet,
                </li>
                <li>přes e-mail s vámi budeme komunikovat.</li>
              </ul>
              <h3 style={{ marginTop: "1em" }}>Kdo se k datům dostane?</h3>
              <p>
                Vaše data zůstanou u nás, dostanou se k nim pouze naši
                zaměstnanci.
              </p>
              <h3 style={{ marginTop: "1em" }}>
                Jak dlouho s daty pracujeme a na základě čeho?
              </h3>
              <p>
                Pokud vám zřídíme účet, budeme vaše data zpracovávat po dobu
                vašeho aktivního využívání účtu. Účet můžete zrušit, případně
                vám účet zrušíme, pokud ho nebudete používat déle než 3 roky.
                Takové zpracování je nutné pro poskytnutí služby a umožňuje ho
                nařízení GDPR – protože plníme své závazky a dále povinnosti
                podle právních předpisů.
              </p>
              <p>
                Pokud jste nás kontaktovali, ale služby nakonec nebudete
                využívat, vaše data budeme zpracovávat nejdéle 6 měsíců od naší
                poslední komunikace. Takovou práci s daty nám umožňuje nařízení
                GDPR – protože jednáme o smlouvě.
              </p>
              <h3 style={{ marginTop: "1em" }}>Ještě byste měli vědět:</h3>
              <p>
                Pokud byste potřebovali ohledně osobních údajů cokoliv probrat,
                napište nám na e-mail{" "}
                <a
                  href="mailto:info@indihu.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
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
                  className="link"
                >
                  poverenec@ssc.cascz
                </a>
                .
              </p>
              <p>
                Nařízení GDPR (nařízení Evropského parlamentu a Rady (EU) č.
                2016/679 o ochraně fyzických osob v souvislosti se zpracováním
                osobních údajů a o volném pohybu těchto údajů a o zrušení
                směrnice 95/46/ES), které oblast osobních údajů upravuje, vám
                dává mimo jiné právo obrátit se na nás a chtít informace, jaké
                vaše osobní údaje zpracováváme, vyžádat si u nás přístup k těmto
                údajům a nechat je aktualizovat nebo opravit, popřípadě
                požadovat omezení zpracování, můžete požadovat kopii
                zpracovávaných osobních údajů, požadovat po nás v určitých
                situacích výmaz osobních údajů a v určitých případech máte právo
                na jejich přenositelnost. Pokud si myslíte, že s daty
                nenakládáme správně, máte právo podat stížnost u Úřadu pro
                ochranu osobních údajů, případně se se svými nároky obrátit na
                soud.
              </p>
            </div>
          ),
          noDialogMenu: true,
          large: true,
        });
      },
  }),
  reduxForm({
    form: "auth",
  })
)(Authentication);
