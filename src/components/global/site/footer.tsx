import Link from 'next/link';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="flex-1">
            <h3 className="text-secondary text-xl font-semibold mb-4">BAT Security Services Inc.</h3>
            <p>Providing top-quality security services nationwide since 2017.</p>
          </div>
          <div className="flex-1">
            <h3 className="text-secondary text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-secondary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="text-secondary text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-colors text-xl">
                <FontAwesomeIcon icon={["fab", "facebook-f" as IconName]} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors text-xl">
                <FontAwesomeIcon icon={["fab", "twitter" as IconName]} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors text-xl">
                <FontAwesomeIcon icon={["fab", "linkedin-in" as IconName]} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors text-xl">
                <FontAwesomeIcon icon={["fab", "instagram" as IconName]} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-700 text-center">
          <p>&copy; 2024 BAT Security Services Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
