import { Mail, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <div className="relative">
      <nav className="fixed z-50 h-[80px] px-40 py-3 inset-x-0 w-full bg-[#d88f28]">
        <div className="flex text-white items-center justify-between">
          <div className="flex text-sm items-center gap-7">
            <Link href="#blog" className="hover:underline">
              BLOG
            </Link>
            <Link href="#contact" className="hover:underline">
              CONTACT
            </Link>
            <Link href="#hotline" className="hover:underline">
              HOTLINE & ONLINE SUPPORT
            </Link>
            <Link href="#success-support" className="hover:underline">
              SUCCESS SUPPORT
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="#contact">
              <Mail className="size-5" />
            </Link>
            <Link href="/sign-in">
              <User className="size-5" />
            </Link>
            <Link href="#search">
              <Search className="size-5" />
            </Link>
          </div>
        </div>
      </nav>
      <div className="fixed z-50 left-28 top-12 w-[90%] px-10 py-3 bg-white">
        <div className="flex text-black items-center justify-between">
          <div className="flex text-base items-center gap-7">
            <Link href="#solutions" className="hover:underline">
              SOLUTIONS
            </Link>
            <Link href="#news-announcements" className="hover:underline">
              NEWS & ANNOUNCEMENTS
            </Link>
            <Link href="#about" className="hover:underline">
              ABOUT BAT
            </Link>
            <Link href="#policies" className="hover:underline">
              POLICIES
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/new-applicant">Apply Now &rarr;</Link>
            </Button>
            <Image src="/assets/logo.png" alt="Logo" width={50} height={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
