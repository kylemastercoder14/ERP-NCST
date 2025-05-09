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

interface InitialInterviewDetailsProps {
  email: string;
  date: string;
  time: string;
  department: string;
  jobTitle: string;
  branch: string;
  location: string;
}

export const InitialInterviewDetails = ({
  email,
  date,
  time,
  department,
  jobTitle,
  branch,
  location,
}: InitialInterviewDetailsProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Initial Interview Invitation - BAT Security Services INC.
      </Preview>
      <Container style={container}>
        <Section style={coverSection}>
          <Section style={imageSection}>
            <Img
              src="https://firebasestorage.googleapis.com/v0/b/personaapplication-b086b.appspot.com/o/454317114_122094839102469739_5197759434856842856_n-fotor-2025031302019.png?alt=media&token=064d24ca-41f9-4538-8149-fa543d9f4af9"
              width="60"
              height="60"
              alt="Logo"
            />
          </Section>
          <Section style={upperSection}>
            <Heading style={h1}>Initial Interview Invitation</Heading>
            <Text style={mainText}>Dear Applicant ({email}),</Text>
            <Text style={mainText}>
              Congratulations! You are invited for an Initial Interview with BAT
              Security Services INC. Below are the details:
            </Text>

            <Section style={verificationSection}>
              <Text style={verifyText}>Date:</Text>
              <Text style={codeText}>{date}</Text>

              <Text style={verifyText}>Time:</Text>
              <Text style={codeText}>{time}</Text>

              <Text style={verifyText}>Location:</Text>
              <Text style={codeText}>{location}</Text>
            </Section>

            <Text style={mainText}>
              Please make sure to arrive 10-15 minutes before your scheduled
              time. Bring a valid ID and any supporting documents.
            </Text>

            <Section style={formSection}>
              <Text style={formText}>
                Please complete the employee form by clicking the button below:
              </Text>
              <Link
                href={`https://bat-security-services-inc.vercel.app/new-applicant?department=${department}&jobTitle=${jobTitle}&branch=${branch}&email=${email}`}
                target="_blank"
                style={button}
              >
                Complete Employee Form
              </Link>
              <Text style={noteText}>
                Note: The form can only be filled out once and must be submitted
                on or before {date}.
              </Text>
            </Section>
          </Section>

          <Hr />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              If you have any questions, feel free to contact us. We look
              forward to meeting you!
            </Text>
          </Section>
        </Section>

        <Text style={footerText}>
          This message was produced and distributed by BAT Security Services
          INC., Roof Deck MBT Bldg. The Prominade Residences, Brgy. Salawag,
          Dasmarinas City, Cavite. © 2025, BAT Security Services INC. All
          rights reserved. Visit us at{" "}
          <Link
            href="https://batsecurityservices.com"
            target="_blank"
            style={link}
          >
            batsecurityservices.com
          </Link>
          .
        </Text>
      </Container>
    </Body>
  </Html>
);

export const InitialInterviewDetailsHTML = (
  props: InitialInterviewDetailsProps
) =>
  render(<InitialInterviewDetails {...props} />, {
    pretty: true,
  });

// Styles (updated with new styles for the form section)
const main = { backgroundColor: "#fff", color: "#212121" };
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
const footerText = { ...text, fontSize: "12px", padding: "0 20px" };
const verifyText = {
  ...text,
  margin: "5px 0",
  fontWeight: "bold",
  textAlign: "center" as const,
};
const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "20px",
  margin: "5px 0",
  textAlign: "center" as const,
};
const verificationSection = {
  margin: "20px 0",
};
const mainText = { ...text, marginBottom: "14px" };
const cautionText = { ...text, margin: "0px" };
const formSection = {
  margin: "20px 0",
  textAlign: "center" as const,
};
const formText = {
  ...text,
  marginBottom: "16px",
};
const noteText = {
  ...text,
  fontSize: "12px",
  color: "#666",
  fontStyle: "italic",
  marginTop: "10px",
};
const button = {
  backgroundColor: "#eec80f",
  borderRadius: "4px",
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px 20px",
  margin: "0 auto",
};
