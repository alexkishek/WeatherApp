import toast, { ToastOptions as HotToastOptions } from 'react-hot-toast';

interface ToastOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  duration?: number;
}

const defaultOptions: Partial<HotToastOptions> = {
  position: 'top-right',
  duration: 4000,
};

export const toastError = (message: string): void => {
  toast.error(message, defaultOptions);
};

export const toastSuccess = (message: string): void => {
  toast.success(message, defaultOptions);
};

export const toastInfo = (message: string): void => {
  toast(message, defaultOptions);
};
