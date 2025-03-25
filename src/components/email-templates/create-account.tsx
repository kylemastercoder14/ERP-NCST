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

interface CreateAccountProps {
  email: string;
  password: string;
  name: string;
}

export const CreateAccount = ({
  email,
  password,
  name,
}: CreateAccountProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>BAT Security Services INC.</Preview>
      <Container style={container}>
        <Section style={coverSection}>
          <Section style={imageSection}>
            <Img
              src={
                "https://firebasestorage.googleapis.com/v0/b/personaapplication-b086b.appspot.com/o/454317114_122094839102469739_5197759434856842856_n-fotor-2025031302019.png?alt=media&token=064d24ca-41f9-4538-8149-fa543d9f4af9"
              }
              width="60"
              height="60"
              alt="Logo"
            />
          </Section>
          <Section style={upperSection}>
            <Heading style={h1}>
              Hi {name}, welcome to BAT Security Services INC.
            </Heading>
            <Text style={mainText}>
              Thanks for starting the new BAT Security Services account creation
              process. We&apos;re excited to have you on board. Your account has
              been created successfully.
            </Text>
            <Section style={verificationSection}>
              <Text style={verifyText}>Email Address</Text>
              <Text style={codeText}>{email}</Text>
              <Text style={validityText}>
                (This is your password: {password})
              </Text>
              <Text>Please keep it safe. You can change it later.</Text>
            </Section>
          </Section>
          <Hr />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              BAT Security Services will never email you and ask you to disclose
              or verify your password. If you receive an email asking you to do
              so, please report it to us immediately.
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

export const CreateAccountHTML = (props: CreateAccountProps) =>
  render(<CreateAccount {...props} />, {
    pretty: true,
  });

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

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "30px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
  fontWeight: "bold"
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
