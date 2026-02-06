import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { AppContext } from "./app.context";

export default function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    userData: null,
    loading: true,
  });

  // keep same API you already use
  const setAppState = (updater) => {
    setState((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setState({ user: null, userData: null, loading: false });
          return;
        }

        const token = await firebaseUser.getIdToken(true);

        const res = await fetch("http://localhost:4000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setState({ user: null, userData: null, loading: false });
          return;
        }

        const mongoUser = await res.json();
        setState({ user: mongoUser, userData: null, loading: false });
      } catch {
        setState({ user: null, userData: null, loading: false });
      }
    });

    return () => unsub();
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setAppState }}>
      {children}
    </AppContext.Provider>
  );
}