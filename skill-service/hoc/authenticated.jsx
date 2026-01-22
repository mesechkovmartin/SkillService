import { useContext, useEffect } from "react";
import { AppContext } from "../src/store/app.context";
import  PropTypes from "prop-types";

export default function Authenticated ({ children }) {

    const { appState } = useContext(AppContext);

    useEffect(() => {
        console.log('Curent appState:', appState);
    }, [appState]);

    if (!appState.user) {
        console.warn('User not authenticated');
        return <div>Please log in to access this page.</div>;
    }
     return <div>{children}</div>;

}

Authenticated.propTypes = {
    children: PropTypes.node.isRequired,
};