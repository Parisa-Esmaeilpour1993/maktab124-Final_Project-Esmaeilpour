import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { SiGmail, SiWhatsapp } from "react-icons/si";
import { FaYoutube } from "react-icons/fa6";

export default function SocialLinks() {
  return (
    <div className="flex gap-3 items-center justify-center">
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-gray-800 text-gray-700 rounded-full hover:border-secondary hover:text-secondary hover:translate-y-1 hover:animate-ping"
      >
        <FaFacebookF className="hover:animate-spin" />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-gray-800 text-gray-700 rounded-full hover:border-secondary hover:text-secondary hover:translate-y-1 hover:animate-ping"
      >
        <FaXTwitter className="hover:animate-spin" />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-gray-800 text-gray-700 rounded-full hover:border-secondary hover:text-secondary hover:translate-y-1 hover:animate-ping"
      >
        <SiGmail className="hover:animate-spin" />
      </a>

      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-gray-800 text-gray-700 rounded-full hover:border-secondary hover:text-secondary hover:translate-y-1 hover:animate-ping"
      >
        <GrInstagram className="hover:animate-spin" />
      </a>
      <a
        href="#"
        className="flex justify-center items-center p-2 border-2 border-gray-800 text-gray-700 rounded-full hover:border-secondary hover:text-secondary hover:translate-y-1 hover:animate-ping"
      >
        <SiWhatsapp className="hover:animate-spin" />
      </a>
    </div>
  );
}
