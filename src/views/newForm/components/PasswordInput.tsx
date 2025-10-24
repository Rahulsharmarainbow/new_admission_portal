import React, { useEffect, useRef } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  placeholder?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  showPassword,
  setShowPassword,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // When showPassword changes, restore focus and move caret to end
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Focus input
    input.focus();

    // Move caret to end
    const len = input.value.length;
    try {
      input.setSelectionRange(len, len);
    } catch (err) {
      // some browsers may throw if input not focusable, ignore
    }
  }, [showPassword]);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    // no need for setTimeout here because useEffect handles focusing after state change
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full border border-gray-300 rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
        // optional: prevent mobile autofill weirdness (if relevant)
        autoComplete="new-password"
      />

      <button
        type="button"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        onClick={handleToggle}
        // preventDefault on mouseDown so button doesn't steal focus from input
        onMouseDown={(e) => e.preventDefault()}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
