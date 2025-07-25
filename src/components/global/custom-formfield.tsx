/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import {
  DATE_DEFAULT_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_YEAR_MIN,
  FormFieldType,
  OPT_LENGTH,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "./custom-calendar";
import { CalendarIcon, Eye, EyeOff, CircleHelp } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { TagsInput } from "@/components/ui/tags-input";
import ComboBox from "@/components/ui/combo-box";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SignatureInput from "@/components/ui/signature-input";
import { TimePicker } from "@/components/ui/time-picker";
import MultipleImageUpload from "@/components/ui/multiple-images-upload";
import RichTextEditor from "./richtext-editor";
import { Switch } from "@/components/ui/switch";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  options?: Array<string>;
  feedbackOptions?: { label: string; value: string; icon: string }[];
  dynamicOptions?: { label: string; value: string }[];
  label?: string;
  type?: string | number;
  placeholder?: string;
  description?: string | React.ReactNode;
  dateFormat?: string;
  showTimeSelect?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  isRequired?: boolean;
  className?: string;
  autoFocus?: boolean;
  renderedValue?: string | string[];
  onCreate?: (value: string) => void;
  renderSkeleton?: (field: any) => React.ReactNode;
  onChange?: (value: any) => void;
  tooltip?: boolean;
  government?: boolean;
  tooltipContent?: string;
  imageCount?: number;
  isBirthdate?: boolean;
  bookedTimes?: { start: Date; end: Date }[];
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    fieldType,
    placeholder,
    disabled,
    description,
    type,
    options,
    dynamicOptions,
    label,
    autoFocus,
    renderedValue,
    onChange,
    government,
    imageCount,
    isBirthdate = true,
    bookedTimes
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <>
          <FormControl>
            <div className="relative">
              {/* Input field */}
              <Input
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className="relative"
                autoFocus={autoFocus}
                onChange={(event) => {
                  let value = event.target.value;

                  if (government) {
                    value = value.replace(/\D/g, ""); // Remove non-numeric

                    switch (field.name) {
                      case "sssNo":
                        value = value
                          .slice(0, 10)
                          .replace(/^(\d{2})(\d{7})(\d{0,1})$/, "$1-$2-$3");
                        break;
                      case "pagibigNo":
                        value = value
                          .slice(0, 12)
                          .replace(/^(\d{4})(\d{4})(\d{0,4})$/, "$1-$2-$3");
                        break;
                      case "philhealthNo":
                        value = value
                          .slice(0, 12)
                          .replace(/^(\d{4})(\d{4})(\d{0,4})$/, "$1-$2-$3");
                        break;
                      case "tinNo":
                        value = value
                          .slice(0, 12)
                          .replace(
                            /^(\d{3})(\d{3})(\d{3})(\d{0,3})$/,
                            "$1-$2-$3-$4"
                          );
                        break;
                    }
                  }

                  field.onChange(value);
                }}
              />

              {/* Toggle visibility for password fields */}
              {type === "password" && (
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={toggleShowPassword}
                  className="absolute top-2.5 right-2.5"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" /> // Icon to indicate password visibility is off
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" /> // Icon to indicate password visibility is on
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.TEXTAREA:
      return (
        <>
          <FormControl>
            <div className="shad-input-outer">
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className="shad-input"
                autoFocus={autoFocus}
              />
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.SWITCH:
      return (
        <>
          <FormControl>
            <Switch
              disabled={disabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.RICHTEXT:
      return (
        <>
          <FormControl>
            <div className="shad-input-outer">
              <RichTextEditor
                placeholder={placeholder}
                disabled={disabled}
                onChange={field.onChange}
                value={field.value}
              />
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <>
          <FormControl>
            <PhoneInput
              className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
              placeholder={placeholder}
              defaultCountry="PH"
              countries={["PH"]}
              international
              countryCallingCodeEditable={false}
              withCountryCallingCode
              limitMaxLength={true}
              value={field.value}
              onChange={field.onChange}
              numberInputProps={{
                className: `rounded-md px-4 focus:outline-none bg-transparent h-full w-full !bg-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed`,
              }}
              maxLength={16}
              disabled={disabled}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.SIGNATURE:
      return (
        <>
          <FormControl>
            <SignatureInput
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
              onSignatureChange={field.onChange}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.TAGSINPUT:
      return (
        <>
          <FormControl>
            <TagsInput
              placeholder={placeholder}
              value={field.value}
              onValueChange={field.onChange}
              className="!border-input !border"
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.COMBOBOX:
      return (
        <>
          <FormControl>
            <ComboBox
              data={
                dynamicOptions?.map((option) => ({
                  label: option.label,
                  value: option.value,
                })) || []
              }
              disabled={disabled}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
              className={`!border-input !border w-[500px]`}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.OTP_INPUT:
      return (
        <FormControl>
          <InputOTP
            maxLength={OPT_LENGTH}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            {...field}
          >
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTP>
        </FormControl>
      );

    case FormFieldType.MULTISELECT:
      return (
        <>
          <FormControl>
            <MultiSelector
              values={field.value}
              onValuesChange={field.onChange}
              loop
            >
              <MultiSelectorTrigger
                className={cn(
                  "shad-select-trigger",
                  !field.value && "text-muted-foreground"
                )}
              >
                <MultiSelectorInput
                  disabled={disabled}
                  placeholder={placeholder}
                />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {dynamicOptions && dynamicOptions.length > 0
                    ? dynamicOptions.map((option) => (
                        <MultiSelectorItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MultiSelectorItem>
                      ))
                    : options?.map((option) => (
                        <MultiSelectorItem key={option} value={option}>
                          {option}
                        </MultiSelectorItem>
                      ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={(value) => {
              if (onChange) {
                onChange(value);
              } else {
                field.onChange(value);
              }
            }}
            value={field.value || renderedValue}
          >
            <SelectTrigger
              disabled={disabled}
              className={cn(
                "shad-select-trigger",
                !field.value && "text-muted-foreground"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {dynamicOptions && dynamicOptions.length > 0
                ? dynamicOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                : options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex flex-col space-y-1">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center justify-start",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {field.value ? (
                    format(field.value, DATE_DISPLAY_FORMAT)
                  ) : (
                    <span>{placeholder || "Select a date"}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) =>
                  date && field.onChange(format(date, DATE_DEFAULT_FORMAT))
                }
                fromYear={DATE_YEAR_MIN}
                toYear={2050}
                disabled={
                  !isBirthdate ? (date) => date < new Date() : undefined
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case FormFieldType.TIME_PICKER:
      return (
        <>
          <FormControl>
            <TimePicker
              disabled={disabled}
              bookedTimes={bookedTimes}
              value={field.value}
              onChangeAction={field.onChange}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="radio-group flex items-center space-x-2"
            disabled={disabled}
          >
            {options &&
              options.map((option) => (
                <FormItem
                  key={option}
                  className="radio-item flex gap-1.5 items-center"
                >
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel
                    className={cn(
                      "!my-auto font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {option}
                  </FormLabel>
                </FormItem>
              ))}
          </RadioGroup>
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <div className="items-top flex space-x-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="grid gap-1.5 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </div>
      );

    case FormFieldType.DROP_ZONE:
      return (
        <FormControl>
          <ImageUpload
            defaultValue={field.value || ""}
            onImageUpload={(url) => field.onChange(url)}
          />
        </FormControl>
      );

    case FormFieldType.MULTIPLE_IMAGES:
      return (
        <>
          <FormControl>
            <MultipleImageUpload
              maxImages={imageCount || 3}
              onImageUpload={(urls: string[]) => field.onChange(urls)}
              disabled={disabled}
              defaultValues={field.value?.map((file: File | string) =>
                typeof file === "string" ? file : URL.createObjectURL(file)
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.HIDDEN:
      return (
        <FormControl>
          <Input
            type="text"
            name="verify"
            value={field.value}
            onChange={field.onChange}
            hidden
          />
        </FormControl>
      );

    case FormFieldType.HONEY_POT:
      return (
        <FormControl>
          <Input
            type="text"
            name="xfield"
            value={""}
            // onChange={field.onChange}
            className="hidden"
          />
        </FormControl>
      );

    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const {
    control,
    fieldType,
    label,
    name,
    isRequired,
    className,
    tooltip,
    tooltipContent,
  } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="space-y-1">
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel className="flex items-center mb-2">
                {label}
                {isRequired === true ? (
                  <span className="text-red-700 text-xs"> *</span>
                ) : isRequired === false ? (
                  <span className="text-gray-500 text-xs ml-2">(Optional)</span>
                ) : (
                  ""
                )}
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="ml-1">
                        <CircleHelp className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-60" side="right">
                        <p>{tooltipContent}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </FormLabel>
            )}
            <RenderField field={field} props={props} />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
