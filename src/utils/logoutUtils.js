// logoutUtils.js

import { logoutUser } from "../utils/auth";

export const handleLogout = (navigate) => {
  logoutUser(navigate);
};

export const handleVisibilityChange = () => {
  if (document.hidden) {
    logoutUser();
  }
};

// export const handleKeyDown = (event, setShowWarning) => {
//   if (event.key === "Escape"|| event.key === "Control" || event.key === "Alt") {
//     setShowWarning(true);
//   }
// };
