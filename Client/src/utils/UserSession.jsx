import { useEffect, useState } from "react";

// Generic hook for reactive sessionStorage state
export const useSessionAuth = (authKey) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const status = sessionStorage.getItem(`${authKey}_isLoggedIn`);
      setIsAuthenticated(status === "true");
    };

    checkAuthStatus();

    const handleStorageChange = () => checkAuthStatus();

    const handleCustomStorageEvent = (event) => {
      if (event.detail.key === `${authKey}_isLoggedIn`) {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("sessionStorageUpdated", handleCustomStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "sessionStorageUpdated",
        handleCustomStorageEvent
      );
    };
  }, [authKey]);

  return isAuthenticated;
};

// export function useSessionStorage(key) {
//   // Initialize state with value from sessionStorage, or null if not available
//   const [value, setValue] = useState(() => {
//     if (typeof window !== "undefined") {
//       return sessionStorage.getItem(key);
//     }
//     return null;
//   });

//   useEffect(() => {
//     // Only run on client side
//     if (typeof window === "undefined") return;

//     const handleStorageChange = () => {
//       setValue(sessionStorage.getItem(key));
//     };

//     // Listen for storage updates in other tabs
//     window.addEventListener("storage", handleStorageChange);

//     // Listen for manual updates in the same tab
//     const handleCustomStorageEvent = (event) => {
//       if (event.detail.key === key) {
//         setValue(sessionStorage.getItem(key));
//       }
//     };
//     window.addEventListener("sessionStorageUpdated", handleCustomStorageEvent);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener(
//         "sessionStorageUpdated",
//         handleCustomStorageEvent
//       );
//     };
//   }, [key]);

//   return value;
// }

// export const usePlayerDetails = () => {
//   const playerDetailsStr = useSessionStorage("playerDetails");

//   const [playerDetails, setPlayerDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);

//     if (playerDetailsStr) {
//       try {
//         const parsed = JSON.parse(playerDetailsStr);
//         setPlayerDetails(parsed);
//       } catch (err) {
//         console.error("Failed to parse playerDetails:", err);
//         setPlayerDetails(null);
//       }
//     } else {
//       setPlayerDetails(null);
//     }

//     setLoading(false);
//   }, [playerDetailsStr]);
//   return { playerDetails, loading };
// };

export function setSessionStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(key, value);
    window.dispatchEvent(
      new CustomEvent("sessionStorageUpdated", { detail: { key } })
    );
  } catch (error) {
    console.error(`Error setting sessionStorage for key "${key}":`, error);
  }
}
// Optional: Safe direct access (non-hook) for use outside React
export const getPlayerId = () => {
  if (typeof window === "undefined") return null;
  const data = sessionStorage.getItem("playerDetails");
  return data ? JSON.parse(data)?.id : null;
};
