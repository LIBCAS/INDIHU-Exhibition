import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// React slick carousel
import Slider from "react-slick";

// Components
import CreatorCard from "./CreatorCard";

// Others
import "./carousel.scss";

// - -

const carouselSettings = {
  dots: true,
  infinite: true,
  // autoplay: true,
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

const Carousel = () => {
  return (
    <Slider {...carouselSettings} className="creators-carousel">
      <CreatorCard />
      <CreatorCard />
      <CreatorCard />
      <CreatorCard />
      <CreatorCard />
      <CreatorCard />
      <CreatorCard />
    </Slider>
  );
};

export default Carousel;
