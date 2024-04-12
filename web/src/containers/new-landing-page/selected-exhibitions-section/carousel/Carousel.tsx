import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// React slick carousel
import Slider from "react-slick";

// Components
import ExhibitionCard from "./ExhibitionCard";

// Mock assets
import exhibition1Bg from "../mock-assets/exhibitions-bg-1.jpg";
import exhibition2Bg from "../mock-assets/exhibitions-bg-2.jpg";
import exhibition3Bg from "../mock-assets/exhibitions-bg-3.jpg";
import exhibition4Bg from "../mock-assets/exhibitions-bg-4.jpg";
import exhibition5Bg from "../mock-assets/exhibitions-bg-5.jpg";

import "./carousel.scss";

// - -

const carouselSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  touchThreshold: 10,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

// - -

const Carousel = () => {
  return (
    <Slider {...carouselSettings} className="exhibition-carousel">
      <ExhibitionCard
        backgroundImgSrc={exhibition1Bg}
        title="Na Sibiř z domova"
        description="Výstava Doma na Sibiři představuje Sibiř jako životní prostředí mnoha národů, které se dokázaly přizpůsobit náročným přírodním podmínkám – extrémním teplotám, omezeným zdrojům potravy i nepříznivým dějinným okolnostem. Sibiř je domovem mnoha desítek původních etnik, nicméně výstava se zaměřuje hlavně na dvě vybraná. Těmi jsou Čukčové obývající chladný severovýchodní cíp Sibiře a Tuvinci, kteří žijí na rozlehlých jihosibiřských stepích."
        url="/view/NaSibizdomova2020-03-20T110705950Z"
      />
      <ExhibitionCard
        backgroundImgSrc={exhibition2Bg}
        title="Stránská skála"
        description="Stránská skála je národní přírodní památkou a jde o jeden z nejkrásnějších skalních útvarů ve městě. Archeologické průzkumy prokázaly první osídlení už v paleolitu, lokalita se také řadí k nejstarším doloženým sídlištím člověka typu Homo erectus v Evropě. Několik jeskyní, které se zde nacházejí, jsou i významnými paleontologickými nalezišti. Např. v Absolonově jeskyni bylo nalezeno 645 zkamenělých kostí pleistocénních ptáků, ve Woldřichově jeskyni zase zub nového druhu šavlozubé kočky. Výzkumy i návštěvy běžných výletníků vedly k nalezení mnoha dalších zkamenělin, především mořských bezobratlých živočichů, vzácně i žraločích a rybích zubů."
        url="/view/Strnskskla2021-01-20T110239841Z"
      />
      <ExhibitionCard
        backgroundImgSrc={exhibition3Bg}
        title="Akce K"
        description="Knihy byly po dlouhá staletí nejdůležitějším zdrojem informací, a proto jsou jedním z nejzásadnějších dokladů o minulosti. Po roce 1948 komunisté potřebovali v Československu zlomit vliv církve a získat její majetek. Vyvrcholením byly v roce 1950 brutální a devastující zásahy Akce K (kláštery) a Ř (řeholnice)."
        url="/view/AkceK2020-01-14T094930967Z"
      />
      <ExhibitionCard
        backgroundImgSrc={exhibition4Bg}
        title="Parlament!"
        description="Parlament představuje zákonodárnou moc a je volen námi, občany. Volební právo je tedy spojeno s možností podílet se na fungování státu. Jak se člověk, občan, zasazený v určitém prostředí a společnosti, rozhoduje? Změnily se kampaně a propaganda? Jak se proměnilo volební právo a samotný parlament? To je jen několik otázek, na které si během výstavy budete moci sami odpovědět. Národní památník na Vítkově je místo, kde probíhají pietní i slavnostní akty spojené s českou státností, ne náhodou se proto výstava Parlament! koná právě zde."
        url="/view/Parlamentmezirevolucadualismem2021-01-18T235428057Z"
      />
      <ExhibitionCard
        backgroundImgSrc={exhibition5Bg}
        title="Projekt_Piombo"
        description="Sebastiano Luciani, zvaný del Piombo (kolem 1485, Benátky – 21. červen 1547, Řím) Madona s rouškou, kolem 1520, olej, topolové dřevo; 120,5×92,5 cm, značeno: SEBASTIANUS FACIEBAT, získáno 1673, Arcibiskupství olomoucké – Arcidiecézní muzeum Olomouc, inv. č. A 1076"
        url="/view/ProjektPiombo2021-05-05T115848277Z/start"
      />
    </Slider>
  );
};

export default Carousel;
