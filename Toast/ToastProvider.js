import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { ToastContext } from './ToastContext';
import { Toast } from './Toast';

// Create a random ID
const generateUEID = () => {
  let first = (Math.random() * 46656) | 0;
  let second = (Math.random() * 46656) | 0;
  first = ('000' + first.toString(36)).slice(-3);
  second = ('000' + second.toString(36)).slice(-3);

  return first + second;
};

const createToast = (content, options) => ({
  content,
  options,
  id: generateUEID(),
});

const commonDefaultOptions = {
  autoHideDuration: 5000,
  resumeHideDuration: 3000,
};

const toastDefaultOptions = {
  ...commonDefaultOptions,
  persistent: false,
};

const providerDefaultOptions = {
  ...commonDefaultOptions,
  maxCount: 5,
  position: {
    vertical: 'bottom',
    horizontal: 'right',
  },
};

export const ToastProvider = ({ children, ...rest }) => {
  const [toasts, setToasts] = useState([]);

  // Separate provider options from toast options
  const { maxCount, position, ...toastOptions } = {
    ...providerDefaultOptions,
    ...rest,
  };

  const open = (content, options = {}) => {
    if (!content) return null;

    const mergedToastOptions = {
      ...toastDefaultOptions,
      ...toastOptions,
      ...options,
    };
    const newToast = createToast(content, mergedToastOptions);
    setToasts((currentToasts) => [...currentToasts, newToast]);

    return newToast.id;
  };

  const close = (id) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );

  const contextValue = useMemo(() => ({ open, close }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {createPortal(
        <div
          className={`toasts-wrapper toasts-wrapper--${providerDefaultOptions.position.vertical} toasts-wrapper--${providerDefaultOptions.position.horizontal}`}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              close={() => close(toast.id)}
              {...toast.options}
            >
              {toast.content}
            </Toast>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
