import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left section */}
        <div>
          <div
            onClick={() => {
              navigate("/");
              scrollTo(0, 0);
            }}
            className="flex items-center cursor-pointer"
          >
            <img src={assets.logo} alt="logo" className="w-28" />
            <span className="text-3xl font-semibold text-primary relative left-[-20px]">
              Med<span className="text-blue-600">.com</span>
            </span>
          </div>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        {/* center section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/* right section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+20-114-403-1576</li>
            <li>ammarahmed10000@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* copy right section */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024 @ Ammar_Abdelaziz - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
