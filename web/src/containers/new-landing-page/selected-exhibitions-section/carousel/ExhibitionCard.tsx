import { useTranslation } from "react-i18next";
import "./exhibition-card.scss";

import { BsBoxArrowUpRight } from "react-icons/bs";

// - -

type ExhibitionCardProps = {
  backgroundImgSrc: any;
  title: string;
  description: string;
  url: string;
};

const ExhibitionCard = ({
  backgroundImgSrc,
  title,
  description,
  url,
}: ExhibitionCardProps) => {
  const { t } = useTranslation("new-landing-screen", {
    keyPrefix: "selectedExhibitionsSection",
  });

  return (
    <div className="exhibition-card">
      <div
        className="exhibition-card__bg"
        style={{ backgroundImage: `url(${backgroundImgSrc})` }}
      >
        <div className="exhibition-card__content flex flex-col">
          <h3 className="content__title">{title}</h3>
          <p className="content__description">{description}</p>
          <div className="flex gap-[8px]">
            <a
              className="content__url"
              href={`${window.origin}${url}`}
              target="_blank"
              rel="noreferrer"
              title={t("openOnlineExhibition")}
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                textDecoration: "underline",
              }}
            >
              {t("openOnlineExhibition")}
            </a>
            <BsBoxArrowUpRight size={16} className="self-center" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionCard;
