import { createAction } from '@reduxjs/toolkit';
import constants from '../constants';
const { RESET } = constants;

export const resetCreator = createAction(RESET);
