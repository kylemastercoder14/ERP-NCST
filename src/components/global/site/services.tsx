import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const services = [
  {
    icon: "shield-alt",
    title: "Private Security",
    description:
      "Professional security personnel trained to protect your property, assets, and people with the highest standards of service.",
  },
  {
    icon: "search",
    title: "Investigation Services",
    description:
      "Thorough and discreet investigative services to uncover facts and provide you with the information you need.",
  },
  {
    icon: "user-tie",
    title: "Executive Protection",
    description:
      "Specialized protection services for executives and high-profile individuals who require enhanced security measures.",
  },
  {
    icon: "building",
    title: "Corporate Security",
    description:
      "Comprehensive security solutions tailored for businesses of all sizes to protect your premises and operations.",
  },
  {
    icon: "graduation-cap",
    title: "Security Training",
    description:
      "Marksmanship proficiency, customer service refresher seminars, and continuous industry-related training programs.",
  },
  {
    icon: "clipboard-check",
    title: "Security Assessment",
    description:
      "Professional evaluation of your security needs and vulnerabilities with customized recommendations.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="text-4xl text-secondary mb-5">
                <FontAwesomeIcon icon={["fas", service.icon as IconName]} />
              </div>
              <h3 className="text-primary text-xl font-semibold mb-4">
                {service.title}
              </h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
