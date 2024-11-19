import { assets } from "../assets/assets_frontend/assets";

const NewHeader = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap mb-10 md:mb-0">
      {/* left side */}
      <div className="md:w-2/3 flex flex-col items-start justify-start gap-8 m-auto md:py-[3.5vw] md:pt-[5vw]">
        <p className="text-3xl md:text:4xl lg:text-4xl font-semibold leading-tight md:leading-tight lg:leading-tight">
          Providing Quality <span className="text-primary">Healthcare</span> For
          A <br /> <span className="text-success">Brighter </span>And{" "}
          <span className="text-success">Healthy</span> Future{" "}
        </p>
        <div className="flex flex-col items-start md:flex-row gap-3 opacity-70 text-lg tracking-wide font-light">
          <p className="capitalize">
            At Our Hospital, We Are Dedicated To providing exceptional
            <br /> medical care to our patients and their families. Our
            <br />
            experienced team of medical professionals, cutting-edge
            <br /> technology, and compassionate approach make us a leader
            <br /> in the healthcare industry
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-primary px-8 py-3 rounded-lg text-white text-md m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment{" "}
        </a>
      </div>
      {/* right side */}
      <div className="w-full md:w-1/3 pt-20 relative mx-auto">
        {/* First Image */}
        <img
          className="w-80 mx-auto relative md:absolute md:top-24  md:right-8 lg:top"
          src={assets.new_header_svg}
          alt=""
        />

        {/* Second Image (Centered on top of the first one) */}
        <img
          src={assets.new_header_image}
          alt=""
          className="w-64 sm:w-72 z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default NewHeader;
