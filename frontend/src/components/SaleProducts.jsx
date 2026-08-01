import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionHeading from "./SectionHeading";
import SaleProductCard from "./SaleProductCard";
import { useGetAllProducts } from "../hooks/useGetAllProducts";

const SaleProducts = () => {
  const { saleProducts } = useGetAllProducts();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    saleProducts.length > 0 && (
      <div className="slider-container mt-2">
        <div className="py-1 text-3xl">
          <SectionHeading text1={"Our"} text2={"Flash Sale"} />
        </div>

        <Slider {...settings}>
          {saleProducts.map((product) => (
            <div key={product._id} className="px-2">
              <SaleProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
    )
  );
};

export default SaleProducts;
