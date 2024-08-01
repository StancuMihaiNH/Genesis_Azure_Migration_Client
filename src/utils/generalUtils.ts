import { IUser } from "@/models/IUser";
import { AccountInfo } from "@azure/msal-browser";
import { ConstantValues } from "./constantValues";

export let currentAccount: IUser = {
    Id: ConstantValues.EMPTY_STRING,
    PrincipalName: ConstantValues.EMPTY_STRING,
    DisplayName: ConstantValues.EMPTY_STRING,
    Mail: ConstantValues.EMPTY_STRING
};

export const setCurrentAccount = (account: AccountInfo): void => {
    console.log(account);
    currentAccount.PrincipalName = account?.username;
    currentAccount.DisplayName = account?.name ?? ConstantValues.EMPTY_STRING;
};