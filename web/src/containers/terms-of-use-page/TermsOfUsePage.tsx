import "./terms-of-use-page.scss";

// Components
import Header from "containers/new-landing-page/header/Header";
import TouIntroSection from "./intro-section/TouIntroSection";
import TouContentSection from "./content-section/TouContentSection";
import Footer from "containers/new-landing-page/footer/Footer";

// Models
import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// - -

type TermsOfUsePageProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const TermsOfUsePage = ({ oauthConfigs }: TermsOfUsePageProps) => {
  return (
    <div className="terms-of-use-page">
      <Header oauthConfigs={oauthConfigs} />
      <TouIntroSection />
      <TouContentSection />
      <Footer />
    </div>
  );
};

export default TermsOfUsePage;
