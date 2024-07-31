import { loginRequest } from "@/services/msalConfig";
import { setCurrentAccount } from "@/utils/generalUtils";
import { SilentRequest } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { setAccessToken } from "./accessToken";

export const Authentication = (props: any): JSX.Element => {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();

    const name: string = accounts[0]?.name || '';
    console.log(accounts)
    setCurrentAccount(accounts[0]);

    const setResponseToken = (accessToken: string): void => {
        setAccessToken(accessToken);
        props.setAccessToken(accessToken);
    };

    useEffect((): void => {
        const request: SilentRequest = {
            ...loginRequest,
            account: accounts[0]
        };

        instance.acquireTokenSilent(request)
            .then((response: any): void => {
                setResponseToken(response.accessToken);
            })
            .catch((errors: any): void => {
                instance.acquireTokenRedirect(request);
            });
    }, [isAuthenticated]);

    return (
        <div id="main-user-content">
            {
                !isAuthenticated &&
                <div
                    id="autentication-content"
                    style={{
                        textAlign: "center",
                        marginTop: "10px"
                    }}>
                    <label>Your are currently logged out of your Office 365 account.</label>
                </div>
            }
            {
                isAuthenticated &&
                <div id="logged-in-user-content">
                    {props.children}
                </div>
            }
        </div>
    );
};