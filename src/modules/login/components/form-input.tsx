import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ id, label, type, value, onChange, placeholder, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const Icon = isPassword ? Lock : (id === 'email' ? Mail : User);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 mb-1 text-sm">
        {label}
      </label>
      {/* Each input line */}
      <div className="relative">
        {/* Icon */}
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        {/* Input */}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-9 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white outline-none transition-all duration-200 text-sm ${isPassword ? 'pr-9' : 'pr-3'}`}
          required={required}
        />

        {/* Hidden password button (for only password) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};