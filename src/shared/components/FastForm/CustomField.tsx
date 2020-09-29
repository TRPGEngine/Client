import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { FastFormFieldComponent, FastFormFieldProps } from './field';

export const CustomField: FastFormFieldComponent<{
  render: (props: FastFormFieldProps) => React.ReactNode;
}> = TMemo((props) => {
  const { render, ...others } = props;

  return <>{render(others)}</>;
});
CustomField.displayName = 'CustomField';
