/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from '@/lib/constants';

interface Column {
  label: string;
  fieldName: string;
  fieldType: FormFieldType;
  isRequired: boolean;
  dynamicOptions?: { value: string; label: string }[]; // For SELECT fields
}

interface CustomFieldArrayProps {
  control: any;
  name: string;
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  columns: Column[];
  disabled?: boolean;
  isRequired?: boolean;
}

const CustomFieldArray: React.FC<CustomFieldArrayProps> = ({
  control,
  name,
  fields,
  append,
  remove,
  columns,
  disabled = false,
  isRequired
}) => {
  return (
    <div className="space-y-1">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.fieldName}>{col.label} {isRequired ? <span className='text-red-600'>*</span> : <span className='text-muted-foreground'>(optional)</span>}</TableHead>
            ))}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              {columns.map((col) => (
                <TableCell key={col.fieldName}>
                  <CustomFormField
                    control={control}
                    fieldType={col.fieldType}
                    isRequired={col.isRequired}
                    name={`${name}.${index}.${col.fieldName}`}
                    disabled={disabled}
                    placeholder={`Enter ${col.label.toLowerCase()}`}
                    dynamicOptions={col.dynamicOptions}
                  />
                </TableCell>
              ))}
              <TableCell>
                {index > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length + 1}>
              <Button
                onClick={() =>
                  append(
                    Object.fromEntries(
                      columns.map((col) => [
                        col.fieldName,
                        col.fieldType === FormFieldType.SELECT ? "" : "",
                      ])
                    )
                  )
                }
                className="w-full"
                type="button"
                variant="ghost"
              >
                <PlusCircle /> Add another field
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CustomFieldArray;
