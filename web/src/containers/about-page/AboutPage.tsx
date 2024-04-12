import "./about-page.scss";

// Components
import Header from "containers/new-landing-page/header/Header";
import AboutSection from "./about-section/AboutSection";
import CreationSection from "./creation-section/CreationSection";
import ProjectsSection from "./projects-section/ProjectsSection";
import HistorySection from "./history-section/HistorySection";
import CreatorsSection from "./creators-section/CreatorsSection";
import Footer from "containers/new-landing-page/footer/Footer";

// Models
import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// - -

type AboutPageProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const AboutPage = ({ oauthConfigs }: AboutPageProps) => {
  return (
    <div className="about-page">
      <Header oauthConfigs={oauthConfigs} />
      <AboutSection />
      <CreationSection />
      <ProjectsSection />
      <HistorySection />
      <CreatorsSection />
      <Footer useWhiteVariant />
    </div>
  );
};

export default AboutPage;
