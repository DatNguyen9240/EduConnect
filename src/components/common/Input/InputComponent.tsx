import type { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { Input } from '@components/common/Input';

interface Props {
  id?: string;
  type: React.HTMLInputTypeAttribute;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  name: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions<any>;
  autoComplete?: string;
}

export default function InputComponent({
  id,
  type,
  label,
  errorMessage,
  placeholder,
  name,
  register,
  rules,
  autoComplete,
}: Props) {
  return (
    <Input
      id={id}
      type={type}
      label={label}
      autoComplete={autoComplete}
      // value={formData.fullName}
      // onChange={handleChange}
      placeholder={placeholder}
      {...register(name, rules)}
      error={errorMessage}
    />
  );
}
