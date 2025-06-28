import type { RegisterOptions, UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Input } from '@components/common/Input';

interface Props<T extends FieldValues = FieldValues> {
  id?: string;
  type: React.HTMLInputTypeAttribute;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T>;
  autoComplete?: string;
}

export default function InputComponent<T extends FieldValues = FieldValues>({
  id,
  type,
  label,
  errorMessage,
  placeholder,
  name,
  register,
  rules,
  autoComplete,
}: Props<T>) {
  return (
    <Input
      id={id}
      type={type}
      label={label}
      autoComplete={autoComplete}
      placeholder={placeholder}
      {...register(name, rules)}
      error={errorMessage}
    />
  );
}
