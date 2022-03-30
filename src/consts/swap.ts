export const intervalTime = 20000;
export const localStorageSwapSettingKey = 'sw-st';
export const defaultSettingData = {
  slippage: '0.5',
  deadline: '10',
};
export const minSlippageValue = 0.1;
export const maxSlippageValue = 50;
export const slippageInputRegex = /^([0-9]+\.[0-9]{0,2})$|^([0-9]+)$/;
export const deadlineInputRegex = /^[0-9]+$/;
export const swapInputRegex = /^([0-9]+\.{0,1}[0-9]{0,10})$|^([0-9])*$/;
