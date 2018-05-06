import "./about-temporary-page.scss";

// Components
import Header from "containers/new-landing-page/header/Header";
import TemporaryIntroSection from "./TemporaryIntroSection";
import TemporaryTextSection from "./TemporaryTextSection";
import Footer from "containers/new-landing-page/footer/Footer";

// Models
import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// - -

type TemporaryPageProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const AboutTemporaryPage = ({ oauthConfigs }: TemporaryPageProps) => {
  return (
    <div className="about-temporary-page">
      <Header oauthConfigs={oauthConfigs} />
      <TemporaryIntroSection />
      <TemporaryTextSection />
      <Footer />
    </div>
  );
};

export default AboutTemporaryPage;
