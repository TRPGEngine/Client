import { createReducer } from '@reduxjs/toolkit';

const initialState = [];

export default createReducer(initialState, (builder) => {
  builder
    .addCase<string, any>('ADD_NOTIFICATION', (state, action) => {
      const { notification } = action.payload;

      state.push(notification);
    })
    .addCase<string, any>('REMOVE_NOTIFICATION', (state, action) => {
      const { notificationId } = action.payload;

      const idx = state.findIndex(
        (notification) => notification.id === notificationId
      );
      if (idx >= 0) {
        state.splice(idx, 1);
      }
    })
    .addCase<string, any>('REMOVE_ALL_NOTIFICATIONS', (state, action) => {
      state = [];
    });
});
