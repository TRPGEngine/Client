export type AlertPayload =
  | string
  | {
      type?: 'alert';
      title?: string;
      content: string;
      confirmTitle?: string;
      onConfirm?: Function;
      onCancel?: Function;
    };
