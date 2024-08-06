import { InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { loginRequest } from "../../services/msalConfig";
import { setCurrentAccount } from "../../utils/generalUtils";

interface AuthenticationProps {
    setAccessToken: (token: string) => void;
    children: React.ReactNode;
};

export const Authentication: React.FC<AuthenticationProps> = ({ setAccessToken, children }) => {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [isInteractionInProgress, setIsInteractionInProgress] = useState(false);

    useEffect((): void => {
        const initializeAuth = async () => {
            if (accounts.length > 0 && !isInteractionInProgress) {
                setCurrentAccount(accounts[0]);
                const request: SilentRequest = {
                    ...loginRequest,
                    account: accounts[0]
                };

                try {
                    const response = await instance.acquireTokenSilent(request);
                    setAccessToken(response.accessToken);

                } catch (error) {
                    if (error instanceof InteractionRequiredAuthError) {
                        setIsInteractionInProgress(true);
                        instance.acquireTokenRedirect(request).catch(err => {
                            console.error("Redirect failed: ", err);
                            setIsInteractionInProgress(false);
                        });
                    } else {
                        console.error("Silent token acquisition failed: ", error);
                    }
                }
            } else if (!isAuthenticated && !isInteractionInProgress) {
                setIsInteractionInProgress(true);
                instance.loginRedirect(loginRequest).catch(err => {
                    console.error("Login failed: ", err);
                    setIsInteractionInProgress(false);
                });
            }
        };

        initializeAuth();
    }, [isAuthenticated, accounts, instance, isInteractionInProgress, setAccessToken]);

    if (!isAuthenticated) {
        return (
            <div id="authentication-content" style={{ textAlign: "center", marginTop: "10px" }}>
                <label>You are currently logged out of your Office 365 account.</label>
            </div>
        );
    }

    return <div id="logged-in-user-content">{children}</div>;
};