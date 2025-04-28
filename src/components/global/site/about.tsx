import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Us</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-primary text-2xl font-semibold mb-5">
              Our History
            </h3>
            <p className="mb-4">
              With the growing demand and concern for top quality providers of
              private security service, BAT Security Services Inc. was
              established in June 2017 with SEC Reg. No. CS201712621. Operating
              for almost 7 years, we have built a reputation for excellence in
              the security industry.
            </p>
            <p>
              We are a corporation duly organized, registered and granted
              license to manage, operate and maintain a private protective,
              detective and investigation agency nationwide as authorized under
              Republic Act 5487.
            </p>
          </div>
          <div className="flex-1 relative w-full h-64 md:h-96">
            <Image
              src="/assets/bg.jpg"
              alt="Professional Security Team"
              fill
              className="rounded shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
