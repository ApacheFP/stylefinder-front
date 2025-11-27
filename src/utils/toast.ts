import toast from 'react-hot-toast';

// Custom toast configurations with StyleFinder AI branding
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl border border-gray-100 dark:border-gray-700',
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl border border-gray-100 dark:border-gray-700',
      iconTheme: {
        primary: '#EF4444',
        secondary: '#fff',
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl border border-gray-100 dark:border-gray-700',
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl border border-gray-100 dark:border-gray-700',
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl border border-gray-100 dark:border-gray-700',
      }
    );
  },
};
