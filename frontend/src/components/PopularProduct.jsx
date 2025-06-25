import ProductCard from "./ProductCard";
import ProductSlider from "./ProductSlider";
import SectionHeading from "./SectionHeading";
import Animation from "./Animation";
import InViewAnimation from "./InViewAnimation";
import ProductCardSkeleton from "./Skeleton/ProductCardSkeleton";
import { useGetAllProducts } from "../hooks/useGetAllProducts";

const PopularProduct = () => {
  const { products = [], productIsLoading } = useGetAllProducts();

  const popularProducts = products?.filter((product) =>
    product.tags.includes("Popular")
  );

  return (
    <>
      <div className="mt-4 sm:mt-10">
        <InViewAnimation delay={0.1}>
          <div className="py-1 text-3xl">
            <SectionHeading text1={"Our"} text2={"Popular Products"} />
          </div>
        </InViewAnimation>

        <div>
          <ProductSlider>
            {productIsLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Animation key={index} delay={index * 0.1}>
                    <ProductCardSkeleton />
                  </Animation>
                ))
              : popularProducts?.map((product, index) => {
                  return (
                    <Animation key={product._id} delay={index * 0.1}>
                      <ProductCard product={product} key={product?._id} />
                    </Animation>
                  );
                })}
          </ProductSlider>
        </div>
      </div>
    </>
  );
};

export default PopularProduct;
