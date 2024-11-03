import React from 'react';

export type InputProperties = {
  classname?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};
export const Input = ({
  disabled,
  id,
  name,
  placeholder,
  readOnly,
  type,
  value,
  classname,
  onBlur,
  onChange,
}: InputProperties): JSX.Element => (
  <input
    id={id}
    value={value}
    type={type}
    name={name}
    onChange={onChange}
    onBlur={onBlur}
    className={classname}
    placeholder={placeholder || ''}
    disabled={disabled}
    readOnly={readOnly}
  />
);
