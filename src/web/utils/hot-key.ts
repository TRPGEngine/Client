import { isHotkey } from 'is-hotkey';

export const isSaveHotkey = isHotkey('mod+s');

export const isTabHotkey = isHotkey('tab');
export const isEnterHotkey = isHotkey('enter');
export const isEscHotkey = isHotkey('escape');

export const isArrowUpHotkey = isHotkey('arrowup');
export const isArrowDownHotkey = isHotkey('arrowdown');
