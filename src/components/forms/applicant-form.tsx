"use client";

import React, { useEffect } from "react";
import { EmployeeWithProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ApplicantValidators } from "@/validators";

import { Form } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { civil_status, education_levels, sex } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CustomFieldArray from "@/components/global/custom-field-array";
import { createApplicant, updateApplicant } from "@/actions";
import { Branch, Department, JobTitle } from "@prisma/client";

const ApplicantForm = ({
  initialData,
  jobTitles,
  departments,
  isNewApplicant = false,
  branches,
  initialBranch,
}: {
  initialData: EmployeeWithProps | null;
  jobTitles: JobTitle[];
  departments: Department[];
  isNewApplicant?: boolean;
  branches: Branch[];
  initialBranch?: string;
}) => {
  const action = initialData ? "Save Changes" : "Submit";
  const router = useRouter();
  const searchParams = useSearchParams();
  const departmentId = searchParams.get("department");
  const jobTitleId = searchParams.get("jobTitle");
  const branch = searchParams.get("branch");
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof ApplicantValidators>>({
    resolver: zodResolver(ApplicantValidators),
    defaultValues: {
      positionDesired: initialData?.JobTitle.id || jobTitleId || "",
      department: initialData?.Department.id || departmentId || "",
      email: initialData?.UserAccount?.email || email || "",
      licenseNo: initialData?.licenseNo || "",
      expiryDate: initialData?.expiryDate || "",
      firstName: initialData?.firstName || "",
      middleName: initialData?.middleName || "",
      lastName: initialData?.lastName || "",
      presentAddress: initialData?.presentAddress || "",
      provincialAddress: initialData?.provincialAddress || "",
      isSameWithPresent: false,
      telNo: initialData?.telNo || "",
      celNo: initialData?.celNo || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      placeOfBirth: initialData?.placeOfBirth || "",
      civilStatus: initialData?.civilStatus || "",
      citizenship: initialData?.citizenship || "",
      religion: initialData?.religion || "",
      height: initialData?.height || "",
      weight: initialData?.weight || "",
      sex: initialData?.sex || "",
      spouseName: initialData?.spouseName || "",
      spouseOccupation: initialData?.spouseOccupation || "",
      spouseAddress: initialData?.spouseAddress || "",
      fatherName: initialData?.fatherName || "",
      motherName: initialData?.motherName || "",
      fatherOccupation: initialData?.fatherOccupation || "",
      motherOccupation: initialData?.motherOccupation || "",
      parentAddress: initialData?.parentAddress || "",
      languages: initialData?.languages || [],
      contactPerson: initialData?.contactPerson || "",
      contactAddress: initialData?.contactAddress || "",
      contactNumber: initialData?.contactNumber || "",
      tinNo: initialData?.tinNo || "",
      sssNo: initialData?.sssNo || "",
      philhealthNo: initialData?.philhealthNo || "",
      pagibigNo: initialData?.pagibigNo || "",
      signature: initialData?.signature || "",
      branch: initialData?.branchId || branch || initialBranch || "",
      isOnlyChild: true,
      isNewEmployee: initialData?.isNewEmployee || true,
      children:
        initialData?.Children && initialData.Children.length > 0
          ? initialData.Children
          : [{ name: "", dateOfBirth: "" }],
      education:
        initialData?.EducationRecord && initialData.EducationRecord.length > 0
          ? initialData.EducationRecord.map((record) => ({
              level: record.level,
              course: record.course || "",
              school: record.school,
              address: record.address,
              yearGraduated: record.yearGraduate,
            }))
          : [
              {
                level: "",
                course: "",
                school: "",
                address: "",
                yearGraduated: "",
              },
            ],
      employment:
        initialData?.EmploymentRecord && initialData.EmploymentRecord.length > 0
          ? initialData.EmploymentRecord
          : [{ from: "", to: "", position: "", company: "" }],
      characterReferences:
        initialData?.CharacterReferences &&
        initialData.CharacterReferences.length > 0
          ? initialData.CharacterReferences
          : [{ name: "", occupation: "", address: "" }],
    },
  });

  const { isSubmitting } = form.formState;
  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control: form.control,
    name: "employment",
  });

  const {
    fields: characterReferencesFields,
    append: appendCharacterReferences,
    remove: removeCharacterReferences,
  } = useFieldArray({
    control: form.control,
    name: "characterReferences",
  });

  const educationColumns = [
    {
      label: "Educational Level",
      fieldName: "level",
      fieldType: FormFieldType.SELECT,
      isRequired: true,
      dynamicOptions: education_levels.map((level) => ({
        value: level,
        label: level,
      })),
    },
    {
      label: "Name of School",
      fieldName: "school",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Address",
      fieldName: "address",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Course (if any)",
      fieldName: "course",
      fieldType: FormFieldType.INPUT,
      isRequired: false,
    },
    {
      label: "Year Graduated",
      fieldName: "yearGraduated",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
  ];

  const childrenColumns = [
    {
      label: "Name",
      fieldName: "name",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Date of Birth",
      fieldName: "dateOfBirth",
      fieldType: FormFieldType.DATE_PICKER,
      isRequired: true,
    },
  ];

  const employmentColumns = [
    {
      label: "From",
      fieldName: "from",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "To",
      fieldName: "to",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Position",
      fieldName: "position",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Company",
      fieldName: "company",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
  ];

  const characterReferencesColumns = [
    {
      label: "Name",
      fieldName: "name",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Occupation",
      fieldName: "occupation",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
    {
      label: "Address",
      fieldName: "address",
      fieldType: FormFieldType.INPUT,
      isRequired: true,
    },
  ];

  const isSameWithPresent = form.watch("isSameWithPresent");
  const presentAddress = form.watch("presentAddress");
  const isOnlyChild = form.watch("isOnlyChild");

  // Watch the positionDesired field value
  const selectedJobTitleId = form.watch("positionDesired");

  // Filter department based on job position department
  const filteredDepartment = selectedJobTitleId
    ? jobTitles.find((d) => d.id === selectedJobTitleId)?.name === "Trainer"
      ? departments.filter((department) => department.name === "Operation")
      : departments
    : departments;

  useEffect(() => {
    if (isSameWithPresent) {
      form.setValue("provincialAddress", presentAddress);
    } else {
      form.setValue("provincialAddress", "");
    }
  }, [form, isSameWithPresent, presentAddress]);

  const onSubmit = async (values: z.infer<typeof ApplicantValidators>) => {
    try {
      if (initialData) {
        const res = await updateApplicant(initialData.id, values);
        if (res.success) {
          toast.success(res.success);
          setTimeout(() => {
            window.location.reload();
            router.refresh();
          }, 2000);
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createApplicant(values);
        if (res.success) {
          toast.success(res.success);
          setTimeout(() => {
            window.location.reload();
            router.refresh();
          }, 2000);
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the employee.");
    }
  };

  return (
    <div className="pb-10">
      <Heading
        title="Personnel Data Sheet"
        description="The information contained in this data sheet is strictly confidential and shall not be disclosed to anyone without prior consent of the individual concerned."
      />
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5"
        >
          <div className="space-y-4">
            {!isNewApplicant && (
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.CHECKBOX}
                isRequired={true}
                name="isNewEmployee"
                disabled={isSubmitting}
                label="Is this a new employee?"
                description="Check this box if this is a new employee."
              />
            )}
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                isRequired={true}
                name="positionDesired"
                dynamicOptions={jobTitles.map((job) => ({
                  value: job.id,
                  label: job.name,
                }))}
                disabled={isSubmitting || !!jobTitleId}
                label="Position Desired"
                placeholder="Select position desired"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                isRequired={true}
                name="department"
                dynamicOptions={filteredDepartment.map((department) => ({
                  value: department.id,
                  label: department.name,
                }))}
                disabled={isSubmitting || !!departmentId}
                label="Department"
                placeholder="Select department"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                isRequired={true}
                name="branch"
                dynamicOptions={branches.map((branch) => ({
                  value: branch.id,
                  label: branch.name,
                }))}
                disabled={isSubmitting || !!branch || !!initialBranch}
                label="Branch"
                placeholder="Select branch"
              />
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="email"
                disabled={
                  !!initialData?.UserAccount?.email?.trim() ||
                  isSubmitting ||
                  !!email
                }
                label="Email Address"
                placeholder="Enter email address"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={false}
                name="licenseNo"
                disabled={isSubmitting}
                label="License No."
                placeholder="Enter license number"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                isRequired={false}
                name="expiryDate"
                disabled={isSubmitting}
                label="Expiry Date"
                placeholder="Select expiry date"
              />
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="firstName"
                disabled={isSubmitting}
                label="First Name"
                placeholder="Enter first name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={false}
                name="middleName"
                disabled={isSubmitting}
                label="Middle Name"
                placeholder="Enter middle name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="lastName"
                disabled={isSubmitting}
                label="Last Name"
                placeholder="Select last name"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="presentAddress"
              disabled={isSubmitting}
              label="Present Address"
              placeholder="Enter present address"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="provincialAddress"
              disabled={isSubmitting}
              label="Provincial Address"
              placeholder="Enter provincial address"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              isRequired={true}
              name="isSameWithPresent"
              disabled={isSubmitting}
              label="Is same with present address?"
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={false}
                name="telNo"
                disabled={isSubmitting}
                label="Telephone No."
                placeholder="Enter telephone number"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                isRequired={true}
                name="celNo"
                disabled={isSubmitting}
                label="Phone No."
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                isRequired={true}
                name="dateOfBirth"
                disabled={isSubmitting}
                label="Date of Birth"
                placeholder="Select date of birth"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="placeOfBirth"
                disabled={isSubmitting}
                label="Place of Birth"
                placeholder="Enter place of birth"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                isRequired={true}
                name="civilStatus"
                disabled={isSubmitting}
                dynamicOptions={civil_status.map((status) => ({
                  value: status,
                  label: status,
                }))}
                label="Civil Status"
                placeholder="Select civil status"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="citizenship"
                disabled={isSubmitting}
                label="Citizenship"
                placeholder="Enter citizenship"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="height"
                disabled={isSubmitting}
                label="Height (cm)"
                placeholder="Enter height"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="weight"
                disabled={isSubmitting}
                label="Weight (kg)"
                placeholder="Enter weight"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="religion"
                disabled={isSubmitting}
                label="Religion"
                placeholder="Enter religion"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                isRequired={true}
                name="sex"
                dynamicOptions={sex.map((s) => ({
                  value: s,
                  label: s,
                }))}
                disabled={isSubmitting}
                label="Sex"
                placeholder="Select sex"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TAGSINPUT}
              isRequired={true}
              name="languages"
              disabled={isSubmitting}
              label="Languages Spoken"
              tooltip={true}
              tooltipContent="You can add multiple languages or dialects, press the enter key to add a new language."
              placeholder="Enter languages or dialects you can speak or write"
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={false}
                name="spouseName"
                disabled={isSubmitting}
                label="Spouse Name"
                placeholder="Enter spouse name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={false}
                name="spouseOccupation"
                disabled={isSubmitting}
                label="Spouse Occupation"
                placeholder="Enter spouse occupation"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={false}
              name="spouseAddress"
              disabled={isSubmitting}
              label="Spouse Address"
              placeholder="Enter spouse address"
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Family Background
              </span>
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              isRequired={true}
              name="isOnlyChild"
              disabled={isSubmitting}
              label="Uncheck the box if you have siblings"
            />
            {!isOnlyChild && (
              <div className="space-y-1">
                <Label>
                  Name of Children and Date of Birth{" "}
                  <span className="text-red-600">*</span>
                </Label>

                <CustomFieldArray
                  control={form.control}
                  name="children"
                  fields={childrenFields}
                  append={appendChild}
                  remove={removeChild}
                  columns={childrenColumns}
                  disabled={isSubmitting}
                />
              </div>
            )}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="fatherName"
                disabled={isSubmitting}
                label="Father's Name"
                placeholder="Enter father's name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="fatherOccupation"
                disabled={isSubmitting}
                label="Father's Occupation"
                placeholder="Enter father's occupation"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="motherName"
                disabled={isSubmitting}
                label="Mother's Name"
                placeholder="Enter mother's name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="motherOccupation"
                disabled={isSubmitting}
                label="Mother's Occupation"
                placeholder="Enter mother's occupation"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="parentAddress"
              disabled={isSubmitting}
              label="Parent's Address"
              placeholder="Enter parent's address"
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Contact Information
              </span>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="contactPerson"
                disabled={isSubmitting}
                label="Contact Person"
                placeholder="Enter contact person name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                isRequired={true}
                name="contactNumber"
                disabled={isSubmitting}
                label="Contact Number"
                placeholder="Enter contact number"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="contactAddress"
              disabled={isSubmitting}
              label="Contact Address"
              placeholder="Enter contact address"
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Educational Background
              </span>
            </div>
            <CustomFieldArray
              control={form.control}
              name="education"
              isRequired={true}
              fields={educationFields}
              append={appendEducation}
              remove={removeEducation}
              columns={educationColumns}
              disabled={isSubmitting}
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Employment Record
              </span>
            </div>
            <CustomFieldArray
              control={form.control}
              name="employment"
              isRequired={true}
              fields={employmentFields}
              append={appendEmployment}
              remove={removeEmployment}
              columns={employmentColumns}
              disabled={isSubmitting}
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Character References
              </span>
            </div>
            <CustomFieldArray
              control={form.control}
              name="characterReferences"
              isRequired={true}
              fields={characterReferencesFields}
              append={appendCharacterReferences}
              remove={removeCharacterReferences}
              columns={characterReferencesColumns}
              disabled={isSubmitting}
            />
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Government Mandatories
              </span>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="tinNo"
                disabled={isSubmitting}
                label="Tin No."
                government={true}
                placeholder="Enter tin number"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="sssNo"
                disabled={isSubmitting}
                label="SSS No."
                government={true}
                placeholder="Enter sss number"
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="philhealthNo"
                disabled={isSubmitting}
                government={true}
                label="Philhealth No."
                placeholder="Enter philhealth number"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                isRequired={true}
                name="pagibigNo"
                disabled={isSubmitting}
                government={true}
                label="Pagibig No."
                placeholder="Enter pagibig number"
              />
            </div>
            <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 font-semibold">
                Signature
              </span>
            </div>
            {!initialData && (
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SIGNATURE}
                isRequired={true}
                name="signature"
                disabled={isSubmitting}
                label="Signature"
              />
            )}
            <div className="flex items-center justify-start">
              <Button
                onClick={() => router.back()}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantForm;
