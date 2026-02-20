export function useToast() {
  const uiStore = useUiStore();

  return {
    success: (message: string) => uiStore.addToast({ message, type: 'success' }),
    error: (message: string) => uiStore.addToast({ message, type: 'danger' }),
    warning: (message: string) => uiStore.addToast({ message, type: 'warning' }),
    info: (message: string) => uiStore.addToast({ message, type: 'info' }),
  };
}
