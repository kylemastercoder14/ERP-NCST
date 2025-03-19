import Image from "next/image";
import Navigation from "@/components/global/site/navigation";
import { CogIcon, HandHeartIcon, UsersIcon, WalletIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      <Navigation />
      <div className="h-[60vh] relative w-full">
        <Image
          src="/assets/hero.jpg"
          fill
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>
      <section className="py-3">
        <div className="text-4xl px-5 mt-7 font-semibold text-[#91661d]">
          BAT Security Services INC.
        </div>
        <div className="bg-[#d88f28] flex justify-end mt-10 w-full px-40">
          <div className="bg-white w-40 text-[#91661d] text-center">
            ERP SOFTWARE
          </div>
        </div>
        <div className="mt-20 px-40">
          <div className="text-center relative font-normal text-2xl text-[#91661d]">
            <p>BAT SOLUTIONS</p>
          </div>
          <p className="text-center mt-5">
            Enterprise Resource Planning (ERP) software solution designed to
            streamline and enhance security service operations. Our ERP system
            integrates essential business processes, ensuring seamless
            coordination between different departments, real-time data
            accessibility, and improved operational efficiency.
          </p>
        </div>
        <div className="mt-20 grid lg:grid-cols-4 px-20 grid-cols-1 gap-4">
          <div className="bg-[#d88f28] text-white flex items-center justify-center flex-col px-5 py-10">
            <WalletIcon size={50} />
            <p className="mt-5 text-xl text-center">
              ACCOUNTING & FINANCE MANAGEMENT
            </p>
          </div>
          <div className="bg-[#d88f28] text-white flex items-center justify-center flex-col px-5 py-10">
            <CogIcon size={50} />
            <p className="mt-5 text-xl text-center">OPERATIONS MANAGEMENT</p>
          </div>
          <div className="bg-[#d88f28] text-white flex items-center justify-center flex-col px-5 py-10">
            <UsersIcon size={50} />
            <p className="mt-5 text-xl text-center">
              CUSTOMER RELATIONSHIP MANAGEMENT
            </p>
          </div>
          <div className="bg-[#d88f28] text-white flex items-center justify-center flex-col px-5 py-10">
            <HandHeartIcon size={50} />
            <p className="mt-5 text-xl text-center">
              HUMAN RESOURCE MANAGEMENT
            </p>
          </div>
        </div>
      </section>
      <section className="py-5 pb-10 mt-5 px-5">
        <h1 className="text-[#91661d]">OUR COMPANY</h1>
        <p className="mt-5">
          <b className="text-xl">BAT SECURITY SERVICES, INC.</b> is a
          corporation duly organized, registered and granted license to manage,
          operate and maintain a private protective, detective and investigation
          agency nationwide as authorized under <b>Republic Act 5487.</b>
        </p>
        <div className='mt-10'>
          <b>A. HISTORY</b> <br />
          <p className='ml-5'>With the overgrowing demand and concerns for TOP QUALITY PROVIDER of
          Private Security Service, <b>BAT SECURITY SERVICES, INC</b>. was
          established June 2017 with <b>SEC Reg. No. CS201712621</b>. Operating
          for almost 8 years this 2025.</p>
        </div>
        <div className='mt-10'>
          <b>B. GOVERNMENT PERMITS (LICENSES/ACCREDITATION/AFFILIATION)</b> <br />
          <p className='ml-5'>- {"MAYOR'S"} PERMIT (Valid until <b>Dec 31, 2025</b>)</p>
          <p className='ml-5'>- PNP SOSIA License to Operate No. PSA-R-04-1666-39-4749 (Valid until <b>July 31, 2026</b>)</p>
          <p className='ml-5'>- SECURITIES AND EXCHANGE COMMISION REG. NO. CS201712621</p>
          <p className='ml-5'>- DEPARTMENT OF LABOR AND EMPLOYMENT CERTIFICATION NO. ROIVA-CPO-DO174-0224-007-R (Valid until <b>Mar 10, 2026</b>)</p>
          <p className='ml-5'>- BUREAU OF INTERNAL REVENUE CERTIFICATE OF REGISTRATION</p>
          <p className='ml-5'>- UNIFIED REGISTRATION RECORD</p>
          <p className='ml-5'>- SOCIAL SECURITY SYSTEM (SSS)</p>
          <p className='ml-5'>- PHILHEALTH</p>
          <p className='ml-5'>- PAGIBIG</p>
        </div>
      </section>
      <footer className='border-t py-2'>
        <p className='text-center'>&copy; 2025. <b className='text-[#91661d]'>BAT SECURITY SERVICES, INC</b>. All rights reserved</p>
      </footer>
    </div>
  );
}
