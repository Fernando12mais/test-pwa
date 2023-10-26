export const usePWA = () => {
  const isInstallable = ref(false);
  const deferredPrompt = ref<any>(null);
  const stream = ref<MediaStream>();

  const installPWA = () => {
    console.log(deferredPrompt.value);

    if (deferredPrompt.value) {
      deferredPrompt?.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User declined the installation');
        }
        deferredPrompt.value = null;
      });
    }
  };

  const getCameraAccess = async () => {
    console.log(navigator);
    console.log(navigator.mediaDevices.getSupportedConstraints());
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const videoTracks = stream.value.getVideoTracks();

    console.log({ stream, videoTracks });
  };

  onMounted(() => {
    window.addEventListener('appinstalled', e => {
      console.log('installed', e);
      isInstallable.value = false;
    });

    // The PWA is already installed

    if ('onbeforeinstallprompt' in window) {
      // The PWA is not installed, and `beforeinstallprompt` is supported

      window.addEventListener('beforeinstallprompt', event => {
        isInstallable.value = true;
        event.preventDefault();

        console.log(event);

        deferredPrompt.value = event;
      });
    }

    console.log('mounted');
  });

  return { installPWA, deferredPrompt, isInstallable, getCameraAccess, stream };
};
