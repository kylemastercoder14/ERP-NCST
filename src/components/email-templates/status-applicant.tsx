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

interface InitialInterviewStatusProps {
  email: string;
  status: string;
  remarks?: string; // Optional remarks for failed applicants
}

export const InitialInterviewStatus = ({
  email,
  status,
  remarks,
}: InitialInterviewStatusProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Initial Interview Status - BAT Security Services INC.</Preview>
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
            <Heading style={h1}>Interview Status</Heading>
            <Text style={mainText}>Dear Applicant ({email}),</Text>
            <Text style={mainText}>
              We would like to inform you about the status of your initial
              interview with BAT Security Services INC.
            </Text>

            <Section style={verificationSection}>
              <Text style={verifyText}>Status:</Text>
              <Text style={codeText}>{status}</Text>

              {status === "Failed" && remarks && (
                <>
                  <Text style={verifyText}>Remarks:</Text>
                  <Text style={codeText}>{remarks}</Text>
                </>
              )}
            </Section>

            <Text style={mainText}>
              {status === "Passed"
                ? "We look forward to your next steps in the process."
                : "Thank you for your time, and we wish you the best in your future endeavors."}
            </Text>
          </Section>

          <Hr />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              If you have any questions, feel free to contact us. We wish you
              the best.
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

export const InitialInterviewStatusHTML = (
  props: InitialInterviewStatusProps
) =>
  render(<InitialInterviewStatus {...props} />, {
    pretty: true,
  });

// Styles (same as before)
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
