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

interface ContractEmailProps {
  name: string;
  file: string;
  signUrl: string;
}

export const ContractEmail = ({ name, file, signUrl }: ContractEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>BAT Security Services - Contract Agreement</Preview>
      <Container style={container}>
        <Section style={coverSection}>
          <Section style={imageSection}>
            <Img
              src="https://firebasestorage.googleapis.com/v0/b/personaapplication-b086b.appspot.com/o/454317114_122094839102469739_5197759434856842856_n-fotor-2025031302019.png?alt=media&token=064d24ca-41f9-4538-8149-fa543d9f4af9"
              width="60"
              height="60"
              alt="BAT Security Logo"
            />
          </Section>
          <Section style={upperSection}>
            <Heading style={h1}>Dear {name},</Heading>
            <Text style={mainText}>
              Thank you for joining BAT Security Services INC. Please review and
              sign your employment contract to complete the onboarding process.
            </Text>

            <Section>
              <Text style={verifyText}>Contract Document</Text>
              <Text style={codeText}>{file.split("/").pop()}</Text>
            </Section>

            <Section style={buttonSection}>
              <Link href={signUrl} style={buttonStyle} target="_blank">
                Review & Sign Contract
              </Link>
            </Section>

            <Text style={secondaryText}>
              Or copy and paste this link into your browser: <br />
              <Link href={signUrl} style={link}>
                {signUrl}
              </Link>
            </Text>
          </Section>
          <Hr />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              <strong>Important:</strong> This contract must be signed within 24
              hours of receipt. If you have any questions about the terms,
              please contact HR before signing.
            </Text>
          </Section>
        </Section>

        <Text style={footerText}>
          This message was produced and distributed by BAT Security Services
          INC., Roof Deck MBT Bldg. The Prominade Residences, Brgy. Salawag,
          Dasmarinas City, Cavite. © {new Date().getFullYear()}, BAT Security
          Services INC. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const ContractEmailHTML = (props: ContractEmailProps) =>
  render(<ContractEmail {...props} />, { pretty: true });

// Styles
const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
  maxWidth: "600px",
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
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
  lineHeight: "1.5",
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

const verifyText = {
  ...text,
  margin: "10px 0 5px 0",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "16px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const mainText = { ...text, marginBottom: "14px" };

const secondaryText = {
  ...text,
  fontSize: "12px",
  color: "#666",
  margin: "20px 0",
};

const cautionText = {
  ...text,
  margin: "0px",
  fontSize: "13px",
  color: "#d32f2f",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const buttonStyle = {
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
