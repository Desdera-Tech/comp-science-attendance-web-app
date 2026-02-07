import { cn } from "@/lib/utils";
import { Option } from "@/types";
import { FieldError as FormFieldError } from "react-hook-form";
import { FieldError, FieldLabel } from "./field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

export function SelectInput({
  label,
  selectLabel,
  className,
  placeholder,
  options,
  icon,
  value,
  error,
  defaultValue,
  onValueChange,
}: {
  label?: string;
  selectLabel?: string;
  className?: string;
  placeholder?: string;
  options: Option[];
  icon?: React.ReactNode;
  value?: string;
  error?: FormFieldError;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        {label && <FieldLabel>{label}</FieldLabel>}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
        >
          <SelectTrigger
            className={cn("cursor-pointer w-full py-0 min-h-9.5", className)}
          >
            {icon}{" "}
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectLabel && <SelectLabel>Fruits</SelectLabel>}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <FieldError errors={[error]} />}
      </div>
    </>
  );
}
