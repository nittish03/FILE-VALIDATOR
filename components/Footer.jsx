import Icons from "@/utils/components/global/icons";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-[#1b1a1a] w-full text-white">
      <div className="mx-auto w-full max-w-screen-xl p-4 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="https://flowbite.com/" className="flex items-center">
             
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Astra
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {[
              {
                title: "Resources",
                links: [
                  { name: "Flowbite", url: "https://flowbite.com/" },
                  { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
                ],
              },
              {
                title: "Follow us",
                links: [
                  {
                    name: "Github",
                    url: "https://github.com/themesberg/flowbite",
                  },
                  { name: "Discord", url: "https://discord.gg/4eeurUVvTy" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy Policy", url: "#" },
                  { name: "Terms & Conditions", url: "#" },
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h2 className="mb-6 text-sm font-semibold uppercase">
                  {section.title}
                </h2>
                <ul className="text-gray-400 font-medium">
                  {section.links.map((link, i) => (
                    <li key={i} className="mb-4">
                      <a href={link.url} className="hover:underline">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-400 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Flowbite™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {["Facebook", "Discord", "Twitter", "GitHub", "Dribbble"].map(
              (platform, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white ms-5"
                >
                  <span className="sr-only">{platform} page</span>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
