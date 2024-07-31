import IRole from "./IRole";

export interface IUser {
    Id: string;
    PrincipalName: string;
    DisplayName: string;
    Mail: string;
    OfficeLocation: string;
    MobilePhone: string;
    Roles: Array<IRole>;
};