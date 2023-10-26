export const usePWA = () => {
  const isInstallable = ref(false);
  let deferredPrompt: any = null;

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User declined the installation');
        }
        deferredPrompt = null;
      });
    }
  };

  onMounted(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // The PWA is already installed

      isInstallable.value = false;
    } else if ('onbeforeinstallprompt' in window) {
      // The PWA is not installed, and `beforeinstallprompt` is supported
      isInstallable.value = true;
      window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredPrompt = event;
      });
    }
  });

  return { installPWA, deferredPrompt, isInstallable };
};
