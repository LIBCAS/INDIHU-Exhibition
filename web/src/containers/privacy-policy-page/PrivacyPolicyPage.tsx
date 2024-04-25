import "./privacy-policy-page.scss";

// Components
import Header from "containers/new-landing-page/header/Header";
import PrivacyPolicyIntroSection from "./intro-section/PrivacyPolicyIntroSection";
import PrivacyPolicyContentSection from "./content-section/PrivacyPolicyContentSection";
import Footer from "containers/new-landing-page/footer/Footer";

// Models
import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// - -

type PrivacyPolicyPageProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const PrivacyPolicyPage = ({ oauthConfigs }: PrivacyPolicyPageProps) => {
  return (
    <div className="privacy-policy-page">
      <Header oauthConfigs={oauthConfigs} />
      <PrivacyPolicyIntroSection />
      <PrivacyPolicyContentSection />
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
