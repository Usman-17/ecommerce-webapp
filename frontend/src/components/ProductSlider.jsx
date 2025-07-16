import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Imports End

const ProductSlider = ({ children, slidesToShow = 6 }) => {
  const validChildren = React.Children.toArray(children);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow,
    initialSlide: 0,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2500,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  function CustomPrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="slick-prev custom-arrow"
        onClick={onClick}
        aria-label="Previous Slide"
      >
        <ChevronLeft />
      </button>
    );
  }

  function CustomNextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="slick-next custom-arrow"
        onClick={onClick}
        aria-label="Next Slide"
      >
        <ChevronRight />
      </button>
    );
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {validChildren.map((child, index) => (
          <div key={index} className="px-1">
            {child}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
