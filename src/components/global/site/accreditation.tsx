import { Accreditation } from '@/types';

const accreditations: Accreditation[] = [
  {
    title: 'SEC Registration',
    details: ['CS201712621']
  },
  {
    title: 'PNP SOSIA License',
    details: ['PSA-R-04-166639-4749', 'Valid until July 31, 2026']
  },
  {
    title: 'Mayor\'s Permit',
    details: ['Valid until Dec. 31, 2025']
  },
  {
    title: 'DOLE Certification',
    details: ['R01VA-CPO-D0174-0224-007-R', 'Valid until March 10, 2026']
  },
  {
    title: 'BIR Registration',
    details: ['Certificate of Registration']
  }
];

const AccreditationSection = () => {
  return (
    <section id="accreditation" className="py-20 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Accreditation</h2>
        <div className="flex flex-wrap justify-center gap-5">
          {accreditations.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded shadow-md min-w-[250px] text-center">
              <h4 className="font-semibold mb-2">{item.title}</h4>
              {item.details.map((detail, i) => (
                <p key={i} className="text-sm">{detail}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;
