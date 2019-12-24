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

export type UIState = {
  showAlert: boolean;
  showAlertInfo: any;
  showLoading: boolean;
  showLoadingText: string;
  showModal: boolean;
  showModalBody: any;
  showToast: boolean;
  showToastText: string;
  showProfileCard: boolean;
  showProfileCardUUID: string;
  showSlidePanel: boolean;
  showSlidePanelInfo: {
    title: string;
    content: string;
  };
  showLigthbox: boolean;
  showLigthboxInfo: any;
  menuIndex: number;
  menuPannel: any;
  network: {
    isOnline: boolean;
    tryReconnect: boolean;
    msg: string;
  };
  socketId: string;
  lastDiceType: string;
};
