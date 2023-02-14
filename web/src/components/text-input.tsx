import type { UseFormRegisterReturn } from "react-hook-form";

export interface TextInputProps {
  label: string;
  initialValue?: string | number | null;
  editable?: boolean;
  register?: UseFormRegisterReturn<string>;
  state?: "success" | "error" | null;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  initialValue,
  editable = true,
  register,
  state,
}) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        placeholder={editable ? "Type here" : ""}
        className={`input-bordered input w-full ${
          state === "success"
            ? "input-success"
            : state === "error"
            ? "input-error"
            : ""
        }`}
        defaultValue={initialValue ?? undefined}
        disabled={!editable}
        {...register}
      />
    </div>
  );
};
