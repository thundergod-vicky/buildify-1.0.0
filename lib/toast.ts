import { toast, Bounce, ToastOptions } from 'react-toastify';

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Bounce,
};

export const showToast = {
  success: (message: string) => toast.success(message, toastConfig),
  error: (message: string) => toast.error(message, toastConfig),
  info: (message: string) => toast.info(message, toastConfig),
  warning: (message: string) => toast.warn(message, toastConfig),
};
