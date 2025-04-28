const Hero = () => {
	return (
	  <section
		id="home"
		className="hero bg-cover bg-center text-white py-24 text-center"
		style={{
		  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
		}}
	  >
		<div className="container mx-auto px-4">
		  <h1 className="text-4xl md:text-5xl font-bold mb-5">
			Professional Security Services You Can Trust
		  </h1>
		  <p className="text-xl max-w-3xl mx-auto mb-8">
			BAT Security Services Inc. provides top-quality private security solutions nationwide, ensuring safety and peace of mind for our clients.
		  </p>
		  <a href="#contact" className="btn">
			Get in Touch
		  </a>
		</div>
	  </section>
	);
  };

  export default Hero;
