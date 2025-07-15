import { Helmet } from "react-helmet-async";
import SectionHeading from "../components/SectionHeading";
import img from "../assets/model.webp";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Jemzy.pk - Premium Jewelry in Pakistan</title>
        <meta
          name="description"
          content="Discover the story behind Jemzy.pk — Pakistan's trusted online jewelry store for elegant and timeless designs."
        />
        <meta
          name="keywords"
          content="Jemzy, Jemzy.pk, Pakistani jewelry, premium jewelry, online jewelry store, fashion jewelry Pakistan"
        />
        <link rel="canonical" href="https://www.jemzy.pk/about" />
      </Helmet>

      <div className="text-xl text-center pt-6 sm:pt-8 border-t">
        <SectionHeading text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-16">
        <img
          src={img}
          alt="Jemzy.pk - About us"
          className="w-full lg:max-w-[450px] mb-2 lg:mb-20"
          loading="lazy"
          decoding="async"
        />

        {/* About Content */}
        <div className="flex flex-col justify-center gap-4 sm:gap-6 lg:w-2/4 text-gray-600">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-gray-900">Jemzy.pk</span>, your
            go-to destination for premium jewelry in Pakistan. At Jemzy, we
            blend timeless elegance with modern craftsmanship to bring you
            jewelry that tells a story.
          </p>

          <p>
            Since our launch, Jemzy.pk has proudly offered a carefully selected
            range of high-quality jewelry — from classic everyday essentials to
            statement pieces for special moments. Whether you&#39;re shopping
            for yourself or a loved one, our designs celebrate individuality and
            style with a modern touch.
          </p>

          <b className="text-gray-800 mt-2 text-lg">Our Mission</b>
          <p style={{ marginTop: "-14px" }}>
            Our mission is to redefine how jewelry is discovered and worn in
            Pakistan. We aim to make luxury accessible, offering elegant and
            affordable pieces crafted with precision and care. Through a
            seamless online experience, we bring quality craftsmanship and
            contemporary design to your doorstep.
          </p>

          <b className="text-gray-800 mt-2 text-lg">Why Choose Jemzy?</b>
          <p style={{ marginTop: "-14px" }} className="mb-10">
            At Jemzy.pk, we value trust, quality, and customer satisfaction.
            From handpicked materials to modern finishes, every detail is made
            to impress. We’re committed to helping you celebrate life&#39;s
            moments with jewelry that lasts.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
