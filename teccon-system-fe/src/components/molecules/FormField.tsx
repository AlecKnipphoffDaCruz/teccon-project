import React from 'react';
import Label from '../atoms/Label';
import InputField from '../atoms/InputField';

interface FormFieldProps {
    id: string;
    label: string;
    icon?: React.ReactNode;
    error?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, icon, error, inputProps }) => {
    return (
        <div className="flex flex-col mb-1">
            <Label htmlFor={id}>{label}</Label>
            <InputField id={id} icon={icon} error={error} {...inputProps} />
        </div>
    );
};

export default FormField;