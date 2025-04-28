import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-primary text-white py-5 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          BAT <span className="text-secondary">Security</span>
        </div>
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link href="#home" className="font-medium hover:text-secondary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="font-medium hover:text-secondary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="#services" className="font-medium hover:text-secondary transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="#jobPosts" className="font-medium hover:text-secondary transition-colors">
                Job Posts
              </Link>
            </li>
            <li>
              <Link href="#accreditation" className="font-medium hover:text-secondary transition-colors">
                Accreditation
              </Link>
            </li>
            <li>
              <Link href="#contact" className="font-medium hover:text-secondary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
