import React, { useEffect, useState } from "react";
import type { FieldValues, Path, RegisterOptions } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDeepCompareEffect } from "react-use";
import type { TextInputProps } from "../text-input";
import { TextInput } from "../text-input";

export type CustomFormField = TextInputProps & {
  fieldName: string;
  validation?: RegisterOptions;
};

interface CustomFormProps<T> {
  onSubmit?: (data: T) => Promise<boolean>;
  fields: CustomFormField[];
  submitValue?: string;
}

export const CustomForm = <T extends FieldValues>({
  onSubmit,
  fields,
  submitValue,
}: CustomFormProps<T>) => {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<T>();

  useEffect(() => {
    const subscription = watch(() => clearErrors());
    return () => subscription.unsubscribe();
  }, [watch]);

  const [isError, setIsError] = useState(false);

  useDeepCompareEffect(() => {
    setIsError(Object.entries(errors).length > 0);
  }, [errors]);

  useDeepCompareEffect(() => {
    console.log("fields changed in custom-form");
  }, [fields]);

  return (
    <form
      onSubmit={onSubmit && handleSubmit(onSubmit)}
      className=" flex flex-col space-y-4"
    >
      <>
        {fields.map((field) => (
          <TextInput
            key={field.label}
            {...field}
            register={register(field.fieldName as Path<T>, field.validation)}
            state={!isSubmitted ? null : isError ? "error" : "success"}
          />
        ))}
        {submitValue && (
          <input
            className="btn-outline btn-secondary btn mt-4"
            type="submit"
            disabled={isError}
            value={submitValue}
          />
        )}
        {errors.root?.message && <p>{errors.root.message}</p>}
      </>
    </form>
  );
};
