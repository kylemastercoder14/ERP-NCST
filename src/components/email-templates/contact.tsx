import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	render,
	Section,
	Text,
  } from "@react-email/components";
  import * as React from "react";

  interface InquiryEmailProps {
	name: string;
	email: string;
	subject: string;
	message: string;
  }

  export const InquiryEmail = ({
	name,
	email,
	subject,
	message,
  }: InquiryEmailProps) => (
	<Html>
	  <Head />
	  <Body style={main}>
		<Preview>New Inquiry from {name}</Preview>
		<Container style={container}>
		  <Section style={coverSection}>
			<Section style={imageSection}>
			  <Img
				src={
				  "https://firebasestorage.googleapis.com/v0/b/personaapplication-b086b.appspot.com/o/454317114_122094839102469739_5197759434856842856_n-fotor-2025031302019.png?alt=media&token=064d24ca-41f9-4538-8149-fa543d9f4af9"
				}
				width="60"
				height="60"
				alt="BAT Security Services Logo"
			  />
			</Section>
			<Section style={upperSection}>
			  <Heading style={h1}>New Contact Form Submission</Heading>
			  <Text style={mainText}>
				{"You've"} received a new inquiry from your website contact form.
			  </Text>

			  <Section style={detailsSection}>
				<Text style={labelText}>From:</Text>
				<Text style={detailText}>{name} &lt;{email}&gt;</Text>

				<Text style={labelText}>Subject:</Text>
				<Text style={detailText}>{subject}</Text>

				<Text style={labelText}>Message:</Text>
				<Text style={detailText}>{message}</Text>
			  </Section>
			</Section>
			<Hr />
			<Section style={lowerSection}>
			  <Text style={cautionText}>
				This message was sent via your website contact form. Please respond
				to the sender using the email address provided above.
			  </Text>
			</Section>
		  </Section>

		  <Text style={footerText}>
			This message was produced and distributed by BAT Security Services
			INC., Roof Deck MBT Bldg. The Prominade Residences, Brgy. Salawag,
			Dasmarinas City, Cavite. © 2025, BAT Security Services INC. All
			rights reserved. BAT Security Services INC. is a registered trademark
			of{" "}
			<Link
			  href="https://batsecurityservices.com"
			  target="_blank"
			  style={link}
			>
			  batsecurityservices.com
			</Link>
			. View our{" "}
			<Link
			  href="https://batsecurityservices.com/privacy-policy"
			  target="_blank"
			  style={link}
			>
			  privacy policy
			</Link>
			.
		  </Text>
		</Container>
	  </Body>
	</Html>
  );

  export const InquiryEmailHTML = (props: InquiryEmailProps) =>
	render(<InquiryEmail {...props} />, {
	  pretty: true,
	});

  // Reuse your existing styles and add new ones
  const main = {
	backgroundColor: "#fff",
	color: "#212121",
  };

  const container = {
	padding: "20px",
	margin: "0 auto",
	backgroundColor: "#eee",
  };

  const h1 = {
	color: "#333",
	fontFamily:
	  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px",
  };

  const link = {
	color: "#eec80f",
	fontFamily:
	  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	textDecoration: "underline",
  };

  const text = {
	color: "#333",
	fontFamily:
	  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
  };

  const imageSection = {
	backgroundColor: "#252f3d",
	display: "flex",
	padding: "20px",
	alignItems: "center",
	justifyContent: "center",
  };

  const coverSection = { backgroundColor: "#fff" };

  const upperSection = { padding: "25px 35px" };

  const lowerSection = { padding: "25px 35px" };

  const footerText = {
	...text,
	fontSize: "12px",
	padding: "0 20px",
  };

  const mainText = { ...text, marginBottom: "14px" };

  const cautionText = { ...text, margin: "0px" };

  // New styles for inquiry details
  const detailsSection = {
	backgroundColor: "#f9f9f9",
	padding: "20px",
	borderRadius: "5px",
	margin: "20px 0",
  };

  const labelText = {
	...text,
	fontWeight: "bold",
	margin: "10px 0 5px 0",
	fontSize: "13px",
  };

  const detailText = {
	...text,
	margin: "0 0 15px 0",
	fontSize: "15px",
  };
