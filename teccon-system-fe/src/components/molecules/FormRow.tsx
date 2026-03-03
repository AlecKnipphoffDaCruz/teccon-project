import React from 'react';
import Label from '../atoms/Label';

interface FieldConfig {
  id: string;
  label: string;
  children: React.ReactNode;
}

interface FormRowProps {
  fields: [FieldConfig, FieldConfig?];
}

const FormRow: React.FC<FormRowProps> = ({ fields }) => {
  const [left, right] = fields;
  return (
    <div className={`grid gap-4 ${right ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <div>
        <Label htmlFor={left.id}>{left.label}</Label>
        {left.children}
      </div>
      {right && (
        <div>
          <Label htmlFor={right.id}>{right.label}</Label>
          {right.children}
        </div>
      )}
    </div>
  );
};

export default FormRow;