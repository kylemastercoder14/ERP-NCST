/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Employee,
  Children,
  EducationRecord,
  EmploymentRecord,
  CharacterReferences,
  Branch,
} from "@prisma/client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function EmployeeProfileView({
  employee,
  childrenData,
  education,
  employment,
  references,
  department,
  jobTitle,
}: {
  employee: Employee & {
    Branch: Branch;
  };
  childrenData: Children[];
  education: EducationRecord[];
  employment: EmploymentRecord[];
  references: CharacterReferences[];
  department: string;
  jobTitle: string;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow && printRef.current) {
        printWindow.document.write(`
			  <!DOCTYPE html>
			  <html>
				<head>
				  <title>Employee Profile - ${employee.firstName} ${employee.lastName}</title>
				  <style>
					body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
					h1, h2, h3 { color: #111; }
					.print-container { max-width: 210mm; margin: 0 auto; }
					.header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
					.grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
					.section { margin-bottom: 20px; }
					.section-title { font-size: 18px; font-weight: 600; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
					@page { size: A4; margin: 15mm; }
					@media print {
					  body { padding: 0; }
					  .no-print { display: none !important; }
					}
				  </style>
				</head>
				<body>
				  <div class="print-container">
					${printRef.current.innerHTML}
				  </div>
				  <script>
					setTimeout(() => {
					  window.print();
					  window.close();
					}, 200);
				  </script>
				</body>
			  </html>
			`);
        printWindow.document.close();
      }
    }
  };
  return (
    <div className="relative">
      {/* Print Button - visible only on screen */}
      <div className="no-print absolute top-0 right-0 p-4">
        <Button onClick={handlePrint}>Print Profile</Button>
      </div>
      <div
        ref={printRef}
        className="max-w-7xl mx-auto p-6 bg-white border shadow-lg rounded-lg"
      >
        {/* Header Section */}
        <div className="border-b-2 border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {employee.firstName}{" "}
                {employee.middleName && `${employee.middleName} `}
                {employee.lastName}
              </h1>
              <p className="text-lg text-gray-600">{jobTitle}</p>
              <p className="text-gray-500">{department}</p>
            </div>

            {employee.signature && (
              <div className="w-32 h-20 border border-gray-300 p-1">
                <img
                  src={employee.signature}
                  alt="Employee Signature"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Personal Details */}
          <div className="md:col-span-1 space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                Personal Details
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">License No:</span>{" "}
                  {employee.licenseNo || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {employee.expiryDate || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {employee.dateOfBirth}
                </p>
                <p>
                  <span className="font-medium">Place of Birth:</span>{" "}
                  {employee.placeOfBirth}
                </p>
                <p>
                  <span className="font-medium">Civil Status:</span>{" "}
                  {employee.civilStatus}
                </p>
                <p>
                  <span className="font-medium">Citizenship:</span>{" "}
                  {employee.citizenship}
                </p>
                <p>
                  <span className="font-medium">Religion:</span>{" "}
                  {employee.religion}
                </p>
                <p>
                  <span className="font-medium">Height/Weight:</span>{" "}
                  {employee.height} / {employee.weight}
                </p>
                <p>
                  <span className="font-medium">Sex:</span> {employee.sex}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                Contact Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Present Address:</span>{" "}
                  {employee.presentAddress}
                </p>
                <p>
                  <span className="font-medium">Provincial Address:</span>{" "}
                  {employee.provincialAddress}
                </p>
                <p>
                  <span className="font-medium">Tel No:</span>{" "}
                  {employee.telNo || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Cel No:</span> {employee.celNo}
                </p>
                <p>
                  <span className="font-medium">Emergency Contact:</span>{" "}
                  {employee.contactPerson}
                </p>
                <p>
                  <span className="font-medium">Emergency Number:</span>{" "}
                  {employee.contactNumber}
                </p>
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                Government IDs
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">TIN:</span> {employee.tinNo}
                </p>
                <p>
                  <span className="font-medium">SSS:</span> {employee.sssNo}
                </p>
                <p>
                  <span className="font-medium">PhilHealth:</span>{" "}
                  {employee.philhealthNo}
                </p>
                <p>
                  <span className="font-medium">Pag-IBIG:</span>{" "}
                  {employee.pagibigNo}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Professional Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Family Background */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                Family Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Spouse</h3>
                  {employee.spouseName ? (
                    <>
                      <p>Name: {employee.spouseName}</p>
                      <p>Occupation: {employee.spouseOccupation || "N/A"}</p>
                      <p>
                        Address: {employee.spouseAddress || "Same as employee"}
                      </p>
                    </>
                  ) : (
                    <p>No spouse information</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Parents</h3>
                  <p>
                    Father: {employee.fatherName} ({employee.fatherOccupation})
                  </p>
                  <p>
                    Mother: {employee.motherName} ({employee.motherOccupation})
                  </p>
                  <p>Address: {employee.parentAddress}</p>
                </div>
              </div>

              {childrenData.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium">Children</h3>
                  <ul className="list-disc pl-5">
                    {childrenData.map((child) => (
                      <li key={child.id}>
                        {child.name} (DOB: {child.dateOfBirth})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h3 className="font-medium">{edu.level}</h3>
                      {edu.course && <p>{edu.course}</p>}
                      <p>{edu.school}</p>
                      <p className="text-gray-600">{edu.address}</p>
                      <p className="text-gray-500">
                        Year Graduated: {edu.yearGraduate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employment History */}
            {employment.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                  Employment History
                </h2>
                <div className="space-y-4">
                  {employment.map((job) => (
                    <div
                      key={job.id}
                      className="border-l-4 border-green-500 pl-4"
                    >
                      <h3 className="font-medium">{job.position}</h3>
                      <p>{job.companyName}</p>
                      <p className="text-gray-600">
                        {job.dateFrom} - {job.dateTo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Character References */}
            {references.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                  Character References
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {references.map((ref) => (
                    <div key={ref.id} className="border rounded p-3">
                      <h3 className="font-medium">{ref.name}</h3>
                      <p>{ref.occupation}</p>
                      <p className="text-gray-600">{ref.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
                Additional Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Languages:</span>{" "}
                  {employee.languages.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Branch:</span>{" "}
                  {employee.Branch?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Training Status:</span>{" "}
                  {employee.trainingStatus || "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Employment Status:</span>{" "}
                  {employee.isNewEmployee
                    ? "New Employee"
                    : "Existing Employee"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
