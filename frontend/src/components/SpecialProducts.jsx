import Animation from "./Animation";
import ProductCard from "./ProductCard";
import ProductSlider from "./ProductSlider";
import SectionHeading from "./SectionHeading";
import InViewAnimation from "./InViewAnimation";
import { useGetAllProducts } from "../hooks/useGetAllProducts";

const SpecialProducts = () => {
  const { products = [] } = useGetAllProducts();

  const specialProducts = products?.filter((product) =>
    product.tags.includes("Special")
  );

  return (
    <div className="py-5">
      {specialProducts.length > 0 && (
        <div className="sm:mt-5">
          <InViewAnimation delay={0.1}>
            <div className="py-1 text-3xl">
              <SectionHeading text1="Our" text2="Special Products" />
            </div>
          </InViewAnimation>
        </div>
      )}

      {specialProducts.length > 0 && (
        <ProductSlider>
          {specialProducts.map((product, index) => (
            <Animation key={product._id} delay={index * 0.1}>
              <ProductCard product={product} />
            </Animation>
          ))}
        </ProductSlider>
      )}
    </div>
  );
};

export default SpecialProducts;
