export const goFullscreen = (logoutCallback) => {
    const doc = document.documentElement;
  
    // Function to request fullscreen
    const requestFullscreen = () => {
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      } else if (doc.mozRequestFullScreen) { // Firefox
        doc.mozRequestFullScreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      } else if (doc.webkitRequestFullscreen) { // Chrome, Safari and Opera
        doc.webkitRequestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      } else if (doc.msRequestFullscreen) { // IE/Edge
        doc.msRequestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
      }
    };
  
    // Function to exit fullscreen
    const exitFullscreen = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    };
  
    // Function to confirm exit fullscreen
    const confirmExitFullscreen = () => {
      const confirmMessage = 'Are you sure you want to exit fullscreen mode?';
      if (window.confirm(confirmMessage)) {
        exitFullscreen();
        logoutCallback(); // Logout after exiting fullscreen
      }
    };
  
    // Event listener for keydown (Escape key)
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault(); // Prevent default 'Escape' key behavior (like closing modals)
        const confirmMessage = 'Are you trying to switch tabs?';
        console.error('Confirmation message:', confirmMessage); // Log confirmMessage to console
        if (window.confirm(confirmMessage)) {
          confirmExitFullscreen();
        }
      }
    });
  
    // Request fullscreen
    requestFullscreen();
  
    // Add event listeners for fullscreen change and visibility change
    document.addEventListener('fullscreenchange', () => handleFullscreenChange(logoutCallback));
    document.addEventListener('mozfullscreenchange', () => handleFullscreenChange(logoutCallback));
    document.addEventListener('webkitfullscreenchange', () => handleFullscreenChange(logoutCallback));
    document.addEventListener('MSFullscreenChange', () => handleFullscreenChange(logoutCallback));
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', logoutCallback);  // Tab becomes inactive
    window.addEventListener('focus', handleFocus);    // Tab becomes active again
  };
  
  // Function to handle fullscreen changes
  const handleFullscreenChange = (logoutCallback) => {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      logoutCallback();
    }
  };
  
  // Function to handle visibility changes
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      window.location.replace('/');
    }
  };
  
  // Function to handle window focus
  const handleFocus = () => {
    // Do nothing when the tab becomes active again
  };
  