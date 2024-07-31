export const msalConfig = {
    auth: {
        clientId: "865b26fa-ff1c-4ee5-8f60-9ad11bcb0373",
        authority: "https://login.microsoftonline.com/01f9eba2-9007-43a8-9560-d7b94ee76c3f",
        redirectUri: "http://localhost:3000"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

export const loginRequest: any = {
    scopes: ["User.Read.All", "Group.Read.All", "GroupMember.Read.All"]
};

export const graphResource: string = "https://graph.microsoft.com/v1.0";