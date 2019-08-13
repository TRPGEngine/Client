export type AlertPayload =
  | string
  | {
      title?: string;
      content: string;
      confirmTitle?: string;
      onConfirm?: Function;
      onCancel?: Function;
    };
