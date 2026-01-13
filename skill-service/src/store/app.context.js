import { createContext } from "react";

/**
 * React Context for managing application-wide state.
 * 
 * @type {React.Context<Object>}
 * @property {null|Object} user - The authenticated user object, or null if not authenticated.
 * @property {null|Object} userData - Additional user data, or null if not available.
 * @property {Function} setAppState - Function to update the application state.
 */
export const AppContext = createContext(
    {
        user:null,
        userData:null,
        setAppState: () => {}
    }
);