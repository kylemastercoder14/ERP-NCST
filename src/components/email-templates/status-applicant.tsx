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
import { ApplicationStatus, TrainingStatus } from "@/types";

export interface TrainingStatusEmailProps {
  email: string;
  trainingStatus?: TrainingStatus;
  applicationStatus: ApplicationStatus;
  date: string;
  time: string;
  location: string;
  branch?: string;
  company?: string;
  remarks?: string;
  failureReason?: string;
  averageRating?: number;
  overallPerformance?: string;
}

export const TrainingStatusEmail = ({
  email,
  trainingStatus,
  applicationStatus,
  date,
  time,
  location,
  branch,
  company,
  averageRating,
  overallPerformance,
  remarks,
}: TrainingStatusEmailProps) => {
  const getStatusContent = () => {
    if (applicationStatus === "Failed") {
      return {
        title: `${trainingStatus} - Status Update`,
        message: "Thank you for participating in our recruitment process.",
        details: (
          <>
            <Text style={verifyText}>Status:</Text>
            <Text style={failedText}>Not Passed</Text>
            {remarks && (
              <>
                <Text style={verifyText}>Evaluation Remarks:</Text>
                <Text style={remarksText}>{remarks}</Text>
              </>
            )}
          </>
        ),
        instructions:
          "You may re-apply after one month from the date of this notice. Any re-application will start from the initial interview process.",
      };
    }

    switch (trainingStatus) {
      case "Initial Interview":
        return {
          title: "Initial Interview - Passed",
          message: "Congratulations! You have passed the initial screening.",
          details: (
            <>
              <Text style={verifyText}>Next Step:</Text>
              <Text style={codeText}>Final Interview</Text>
              <Text style={verifyText}>Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Time:</Text>
              <Text style={codeText}>{time}</Text>
              <Text style={verifyText}>Location:</Text>
              <Text style={codeText}>{location}</Text>
            </>
          ),
          instructions:
            "Please bring all original documents for verification. Business attire is recommended.",
        };
      case "Final Interview":
        return {
          title: "Final Interview - Passed",
          message:
            "Congratulations! You have successfully passed the final interview.",
          details: (
            <>
              <Text style={verifyText}>Next Step:</Text>
              <Text style={codeText}>Orientation</Text>
              <Text style={verifyText}>Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Time:</Text>
              <Text style={codeText}>{time}</Text>
              <Text style={verifyText}>Location:</Text>
              <Text style={codeText}>{location}</Text>
            </>
          ),
          instructions:
            "Please prepare all required documents for onboarding. Smart casual attire is recommended for the orientation.",
        };
      case "Orientation":
        return {
          title: "Orientation - Passed",
          message:
            "Welcome to BAT Security Services INC.! You have completed the orientation process.",
          details: (
            <>
              <Text style={verifyText}>Next Step:</Text>
              <Text style={codeText}>Physical Training</Text>
              <Text style={verifyText}>Start Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Reporting Time:</Text>
              <Text style={codeText}>{time}</Text>
              <Text style={verifyText}>Training Location:</Text>
              <Text style={codeText}>{location}</Text>
            </>
          ),
          instructions:
            "Please wear appropriate athletic clothing and bring water for the physical training sessions.",
        };
      case "Physical Training":
        return {
          title: "Physical Training - Passed",
          message: "Congratulations on completing your physical training!",
          details: (
            <>
              <Text style={verifyText}>Next Step:</Text>
              <Text style={codeText}>Customer Service Training</Text>
              <Text style={verifyText}>Start Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Reporting Time:</Text>
              <Text style={codeText}>{time}</Text>
              <Text style={verifyText}>Training Location:</Text>
              <Text style={codeText}>{location}</Text>
              {averageRating && (
                <>
                  <Text style={verifyText}>Average Rating:</Text>
                  <Text style={codeText}>{averageRating.toFixed(1)}/5.0</Text>
                </>
              )}
              {overallPerformance && (
                <>
                  <Text style={verifyText}>Overall Performance:</Text>
                  <Text style={codeText}>{overallPerformance}</Text>
                </>
              )}
            </>
          ),
          instructions:
            "Please bring a notebook and pen. Business casual attire is required for customer service training.",
        };
      case "Customer Service Training":
        return {
          title: "Customer Service Training - Passed",
          message:
            "You have successfully completed the customer service training program.",
          details: (
            <>
              <Text style={verifyText}>Next Step:</Text>
              <Text style={codeText}>Deployment</Text>
              <Text style={verifyText}>Deployment Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Reporting Time:</Text>
              <Text style={codeText}>{time}</Text>
              {averageRating && (
                <>
                  <Text style={verifyText}>Average Rating:</Text>
                  <Text style={codeText}>{averageRating.toFixed(1)}/5.0</Text>
                </>
              )}
              {overallPerformance && (
                <>
                  <Text style={verifyText}>Overall Performance:</Text>
                  <Text style={codeText}>{overallPerformance}</Text>
                </>
              )}
            </>
          ),
          instructions:
            "Please wait for your deployment assignment details from the HR department.",
        };
      case "Deployment":
        return {
          title: "Deployment Assignment",
          message: "Congratulations! You are now ready for deployment.",
          details: (
            <>
              <Text style={verifyText}>Assigned Branch:</Text>
              <Text style={codeText}>{branch}</Text>
              <Text style={verifyText}>Client Company:</Text>
              <Text style={codeText}>{company}</Text>
              <Text style={verifyText}>Report Date:</Text>
              <Text style={codeText}>{date}</Text>
              <Text style={verifyText}>Report Time:</Text>
              <Text style={codeText}>{time}</Text>
              <Text style={verifyText}>Location:</Text>
              <Text style={codeText}>{location}</Text>
            </>
          ),
          instructions:
            "Please bring your security license and company ID. Report to the site supervisor upon arrival.",
        };
      default:
        return {
          title: "Training Status Update",
          message: "Your training status has been updated.",
          details: null,
          instructions:
            "Please wait for further instructions from our HR department.",
        };
    }
  };

  const content = getStatusContent();

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{content.title} - BAT Security Services INC.</Preview>
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
              <Heading style={h1}>{content.title}</Heading>
              <Text style={mainText}>Dear {email},</Text>
              <Text style={mainText}>{content.message}</Text>

              <Section style={verificationSection}>{content.details}</Section>

              <Text style={mainText}>{content.instructions}</Text>
            </Section>

            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                {applicationStatus === "Failed"
                  ? "We appreciate your participation in our recruitment process."
                  : "If you have any questions, please contact our HR department."}
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
};

export const TrainingStatusEmailHTML = (props: TrainingStatusEmailProps) =>
  render(<TrainingStatusEmail {...props} />, {
    pretty: true,
  });

// Styles
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
const failedText = {
  ...text,
  color: "#d32f2f",
  fontWeight: "bold",
  fontSize: "20px",
  margin: "5px 0",
  textAlign: "center" as const,
};
const remarksText = {
  ...text,
  color: "#555",
  fontStyle: "italic",
  textAlign: "center" as const,
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
