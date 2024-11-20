// fullscreenUtils.js

/**
 * Requests fullscreen mode for a given element.
 * @param {Element} element The DOM element to request fullscreen.
 */
export function requestFullscreen(element) {
    try {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Failed to request fullscreen:", error);
    }
  }
  
  /**
   * Adds event listeners for fullscreen change events to handleFullScreenExit.
   * @param {Function} handleFullScreenExit Callback function to handle exit from fullscreen.
   */
  export function addFullscreenEventListeners(handleFullScreenExit) {
    document.addEventListener("fullscreenchange", handleFullScreenExit);
    document.addEventListener("mozfullscreenchange", handleFullScreenExit);
    document.addEventListener("webkitfullscreenchange", handleFullScreenExit);
    document.addEventListener("msfullscreenchange", handleFullScreenExit);
  }
  
  /**
   * Removes event listeners for fullscreen change events from handleFullScreenExit.
   * @param {Function} handleFullScreenExit Callback function to remove from fullscreen change events.
   */
  export function removeFullscreenEventListeners(handleFullScreenExit) {
    document.removeEventListener("fullscreenchange", handleFullScreenExit);
    document.removeEventListener("mozfullscreenchange", handleFullScreenExit);
    document.removeEventListener("webkitfullscreenchange", handleFullScreenExit);
    document.removeEventListener("msfullscreenchange", handleFullScreenExit);
  }
  