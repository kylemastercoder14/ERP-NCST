import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const contactInfo =[
  {
    icon: 'map-marker-alt',
    text: 'Roof Deck MBT Bldg., The Promenade Residences, Brgy. Salawag, Dasmarifias City, Cavite'
  },
  {
    icon: 'phone',
    text: '(046) 424-4234'
  },
  {
    icon: 'mobile-alt',
    text: '(0917) 803-3280 / (0995) 987-2877 (Lerry - Operations Manager)'
  },
  {
    icon: 'envelope',
    text: 'batsecservicesinc@gmail.com'
  }
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Contact Us</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-primary text-2xl font-semibold mb-5">Get in Touch</h3>
            <div className="mb-8">
              {contactInfo.map((info, index) => (
                <p key={index} className="flex items-start mb-3">
                  <FontAwesomeIcon icon={["fas", info.icon as IconName]} className='text-secondary mr-3 mt-1' />
                  {info.text}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-3">Business Hours</h4>
              <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p>Emergency services available 24/7</p>
            </div>
          </div>
          <div className="flex-1">
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-medium mb-1">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
