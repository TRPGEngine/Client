import React, { useMemo, useState } from 'react';
import { TMemo } from '../TMemo';
import { useFormik } from 'formik';
import _isNil from 'lodash/isNil';
import _fromPairs from 'lodash/fromPairs';
import _isFunction from 'lodash/isFunction';
import { ObjectSchema } from 'yup';
import { FastFormContext } from './context';
import { FastFormFieldMeta, getField } from './field';
import { getFormContainer } from './container';

/**
 * 表单配置
 */
export interface FastFormProps {
  fields: FastFormFieldMeta[]; // 字段详情
  schema?: ObjectSchema; // yup schame object 用于表单校验
  submitLabel?: string; // 提交按钮的标签名
  onSubmit: (values: any) => Promise<void> | void; // 点击提交按钮的回调
}

/**
 * 一个快速生成表单的组件
 * 用于通过配置来生成表单，简化通用代码
 */
export const FastForm: React.FC<FastFormProps> = TMemo((props) => {
  const initialValues = useMemo(() => {
    return _fromPairs(props.fields.map((field) => [field.name, '']));
  }, [props.fields]);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: props.schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        _isFunction(props.onSubmit) && (await props.onSubmit(values));
      } finally {
        setLoading(false);
      }
    },
  });
  const { handleSubmit, setFieldValue, values, errors } = formik;

  const FastFormContainer = getFormContainer();

  if (_isNil(FastFormContainer)) {
    console.warn('FastFormContainer 没有被注册');
    return null;
  }

  const fieldsRender = useMemo(() => {
    return props.fields.map((fieldMeta, i) => {
      const fieldName = fieldMeta.name;
      const value = values[fieldName];
      const error = errors[fieldName];
      const Component = getField(fieldMeta.type);

      if (_isNil(Component)) {
        return null;
      } else {
        return (
          <Component
            key={fieldName + i}
            {...fieldMeta}
            value={value}
            error={error}
            onChange={(val) => setFieldValue(fieldName, val)}
          />
        );
      }
    });
  }, [props.fields, values, errors, setFieldValue]);

  return (
    <FastFormContext.Provider value={formik}>
      <FastFormContainer
        loading={loading}
        submitLabel={props.submitLabel}
        handleSubmit={handleSubmit}
      >
        {fieldsRender}
      </FastFormContainer>
    </FastFormContext.Provider>
  );
});
FastForm.displayName = 'FastForm';
FastForm.defaultProps = {
  submitLabel: '提交',
};
