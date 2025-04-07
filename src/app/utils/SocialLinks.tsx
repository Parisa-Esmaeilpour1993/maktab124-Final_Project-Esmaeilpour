import { FaFacebookF, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function SocialLinks() {
  return (
    <div className="flex gap-3 items-center justify-center">
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-black rounded-full hover:border-blue-500 hover:text-blue-500"
      >
        <FaFacebookF />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-black rounded-full hover:border-blue-500 hover:text-blue-500"
      >
        <FaTwitter />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-black rounded-full hover:border-blue-500 hover:text-blue-500"
      >
        <SiGmail />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-black rounded-full hover:border-blue-500 hover:text-blue-500"
      >
        <FaLinkedin />
      </a>
    </div>
  );
}
