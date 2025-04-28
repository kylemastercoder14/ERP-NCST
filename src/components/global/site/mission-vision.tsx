/* eslint-disable react/no-unescaped-entities */
const MissionVision = () => {
	return (
	  <section className="py-20 bg-white">
		<div className="container mx-auto px-4">
		  <h2 className="section-title">Our Vision & Mission</h2>
		  <div className="flex flex-col lg:flex-row gap-6">
			<div className="flex-1 bg-light p-8 rounded relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-secondary">
			  <h3 className="text-primary text-xl font-semibold mb-5">Our Vision</h3>
			  <p>
				To be the most professional security service provider and leader in the industry by exceeding our client's expectations and creating working partnerships while giving prime value to our employees.
			  </p>
			</div>
			<div className="flex-1 bg-light p-8 rounded relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-secondary">
			  <h3 className="text-primary text-xl font-semibold mb-5">Our Mission</h3>
			  <p className="mb-4">
				To provide world class progressive security expertise and solutions to our clients, partners and stakeholders. Our management team consists of the industry's leading experts in their field.
			  </p>
			  <p>
				We will endeavor to improve and sustain the professional growth of every employee through continuous industry related training to support the client's strategic goals.
			  </p>
			</div>
			<div className="flex-1 bg-light p-8 rounded relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-secondary">
			  <h3 className="text-primary text-xl font-semibold mb-5">Quality Policy</h3>
			  <p className="mb-4">
				We strive to provide quality service that will meet and satisfy recipient requirements and to respond to our corporate responsibility to our clients, the community and employees.
			  </p>
			  <p>
				We will actively pursue ever improving quality service through programs that enable each of our personnel to perform their job efficiently and effectively.
			  </p>
			</div>
		  </div>
		</div>
	  </section>
	);
  };

  export default MissionVision;
