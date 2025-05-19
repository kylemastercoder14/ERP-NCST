import About from "@/components/global/site/about";
import AccreditationSection from "@/components/global/site/accreditation";
import Contact from "@/components/global/site/contact";
import Footer from "@/components/global/site/footer";
import Hero from "@/components/global/site/hero";
import MissionVision from "@/components/global/site/mission-vision";
import Services from "@/components/global/site/services";
import Header from "@/components/global/site/navigation";
import JobPost from "@/components/global/site/job-posting";
import db from "@/lib/db";

export default async function Home() {
  const jobPosts = await db.jobPosting.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      finacialStatus: "Approved",
      adminApproval: "Approved",
    },
    include: {
      department: true,
      JobTitle: true,
      Branch: true,
    }
  });
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <MissionVision />
      <AccreditationSection />
      <JobPost jobPosts={jobPosts} />
      <Contact />
      <Footer />
    </>
  );
}
