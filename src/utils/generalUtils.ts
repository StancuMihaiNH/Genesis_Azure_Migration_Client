import IRole from "@/models/IRole";
import { IUser } from "@/models/IUser";
import { AccountInfo } from "@azure/msal-browser";
import { ConstantValues } from "./constantValues";

export let currentAcount: IUser = {
    Id: ConstantValues.EMPTY_STRING,
    PrincipalName: ConstantValues.EMPTY_STRING,
    DisplayName: ConstantValues.EMPTY_STRING,
    Mail: ConstantValues.EMPTY_STRING,
    OfficeLocation: ConstantValues.EMPTY_STRING,
    MobilePhone: ConstantValues.EMPTY_STRING,
    Roles: new Array<IRole>()
};

export const setCurrentAccount = (account: AccountInfo): void => {
    currentAcount.PrincipalName = account?.username;
    currentAcount.DisplayName = account?.name ?? "";
};