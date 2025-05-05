/* eslint-disable react/no-unescaped-entities */
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

interface ForgotPasswordProps {
  resetLink: string;
  expiryHours?: number;
}

export const ForgotPasswordEmail = ({
  resetLink,
  expiryHours = 24,
}: ForgotPasswordProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset your BAT Security Services password</Preview>
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
            <Heading style={h1}>Password Reset Request</Heading>
            <Text style={mainText}>
              We received a request to reset the password for your BAT Security
              Services account.
            </Text>

            <Section style={verificationSection}>
              <Text style={verifyText}>
                Click the link below to reset your password:
              </Text>
              <Link href={resetLink} style={resetLinkStyle}>
                Reset Password
              </Link>
              <Text style={validityText}>
                This link will expire in {expiryHours} hours.
              </Text>
            </Section>

            <Text style={mainText}>
              If you didn't request this password reset, you can safely ignore
              this email. Your password won't be changed until you access the
              link above and create a new one.
            </Text>
          </Section>
          <Hr />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              For security reasons, BAT Security Services will never email you
              asking for your password. This link can only be used once and will
              expire after {expiryHours} hours.
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

export const ForgotPasswordEmailHTML = (props: ForgotPasswordProps) =>
  render(<ForgotPasswordEmail {...props} />, {
    pretty: true,
  });

// Styles
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

const resetLinkStyle = {
  backgroundColor: "#eec80f",
  borderRadius: "4px",
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  padding: "12px 24px",
  margin: "20px 0",
  display: "inline-block",
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

const verifyText = {
  ...text,
  margin: "10px 0 5px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "10px 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#666",
};

const verificationSection = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  margin: "20px 0",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px", fontSize: "12px" };
