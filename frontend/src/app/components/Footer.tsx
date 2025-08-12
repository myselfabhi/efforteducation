import Link from "next/link";
import { Youtube, Facebook, Twitter, Instagram } from "lucide-react";

const footerLinks = [
  {
    title: "Our Programs",
    links: [
      { label: "Young Scholars IAS", href: "#" },
      { label: "UGC NET/JRF Preparation", href: "#" },
      { label: "Bank Entrance Exams", href: "#" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "#features" },
      { label: "Success Stories", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  const socials = [
    { Icon: Youtube, href: "https://www.youtube.com" },
    { Icon: Facebook, href: "https://www.facebook.com" },
    { Icon: Twitter, href: "https://www.twitter.com" },
    { Icon: Instagram, href: "https://www.instagram.com" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12" id="contact">
      <div className="container mx-auto flex flex-col space-y-14 items-center">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div className="col-span-1">
            <div className="text-2xl font-bold mb-4">
              <span className="text-red-600">effort</span>
              <span className="text-white ml-1">education</span>
            </div>
            <p>Info@efforteducation.com</p>
            <p>+00 12354664</p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-red-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          {socials.map(({ Icon, href }) => (
            <Link key={href} href={href} className="text-gray-400 hover:text-red-600">
              <Icon size={20} />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Effort Education. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


