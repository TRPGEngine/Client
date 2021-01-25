import React from 'react';
import { regCup, saucerStoreHelper } from '@saucerjs/core';

regCup({
  name: 'Input',
  displayName: '输入框',
  desc: '标准输入框',
  type: 'leaf',
  render: ({ attrs }) => {
    return <input />;
  },
});

saucerStoreHelper.setAvailableCup(['Input']);
