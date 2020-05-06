import { createAction, createReducer } from '@reduxjs/toolkit';
import { XMLBuilderState } from '../XMLBuilder';
import { StateActionType } from '../types';
import _set from 'lodash/set';
import _isFunction from 'lodash/isFunction';

/**
 * @deprecated 有无法越过的访问内存问题。使用原来的reduce操作(即useBuildLayoutStateContext的操作)
 * NOTICE: global必须复用原来的内存地址
 * 因为要让任意位置的代码在任何时刻都能获取到最新的global数据而不用更新
 * 如在Script中使用global
 */

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
