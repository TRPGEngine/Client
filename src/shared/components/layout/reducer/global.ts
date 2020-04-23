import { createAction, createReducer } from '@reduxjs/toolkit';
import { XMLBuilderState } from '../XMLBuilder';
import { StateActionType } from '../types';
import _set from 'lodash/set';
import _isFunction from 'lodash/isFunction';

/**
 * 更新数据
 */
export const updateData = createAction<
  {
    scope: string;
    field: string;
    value: any;
  },
  StateActionType.UpdateData
>(StateActionType.UpdateData);

/**
 * 增加Define组件定义
 */
export const addDefine = createAction<
  {
    name: string;
    component: any;
  },
  StateActionType.AddDefine
>(StateActionType.AddDefine);

/**
 * 设置全局变量
 */
export const setGlobal = createAction<
  {
    name: string;
    value: any;
  },
  StateActionType.SetGlobal
>(StateActionType.SetGlobal);

export function buildGlobalReducer() {
  return createReducer<XMLBuilderState>(
    {
      defines: {},
      global: {},
      data: {},
    },
    (builder) => {
      builder
        .addCase(updateData, (state, action) => {
          const data = { ...state.data };
          const { scope, field, value } = action.payload;

          if (scope === 'data') {
            // 修改data
            _set(data, field, value);
          } else if (scope === 'global') {
            // 修改global数据
            _set(state, ['global', field].join('.'), value);
          } else {
            _set(data, [scope, field].join('.'), value);
          }

          state.data = data;
        })
        .addCase(addDefine, (state, action) => {
          state.defines[action.payload.name] = action.payload.component;
        })
        .addCase(setGlobal, (state, action) => {
          state.global[action.payload.name] = action.payload.value;
        });
    }
  );
}
