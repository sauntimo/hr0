import { useState } from "react";

interface TextInputProps {
  label?: string;
  initialValue?: string | null;
  editable?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  initialValue = null,
  editable = true,
}) => {
  const [currentValue, setCurrentValue] = useState<string | null>(initialValue);

  return (
    <div className="form-control w-full max-w-xs">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        type="text"
        placeholder="Type here"
        className="input-bordered input w-full max-w-xs"
        value={currentValue ?? ""}
        onChange={(e) => setCurrentValue(e.target.value)}
        disabled={!editable}
      />
    </div>
  );
};
