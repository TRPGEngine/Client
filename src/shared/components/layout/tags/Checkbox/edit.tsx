import React, { useCallback, useMemo } from 'react';
import type { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Checkbox } from 'antd';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import type { TagCheckboxProps } from './shared';
import { useToBoolean } from '@shared/hooks/useToBoolean';

export const TagCheckboxEdit: TagComponent<TagCheckboxProps> = TMemo(
  (props) => {
    const { label, stateValue, setStateValue } = useLayoutFormData(props);

    const FormContainer = useLayoutFormContainer(props);
    const hideLabel = useToBoolean(props.hideLabel);
    const checked = useToBoolean(stateValue);

    const handleChange = useCallback(
      (e: CheckboxChangeEvent) => {
        const { checked } = e.target;

        setStateValue(checked);
      },
      [setStateValue]
    );

    return useMemo(
      () => (
        <FormContainer label={label}>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            disabled={props.disabled}
          >
            {hideLabel === true && label}
          </Checkbox>
        </FormContainer>
      ),
      [label, checked, handleChange, props.disabled, hideLabel]
    );
  }
);
TagCheckboxEdit.displayName = 'TagCheckboxEdit';
