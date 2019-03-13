import { SPHttpClient } from "@microsoft/sp-http";

export interface IToDoListProps {
  greeting: string;
  list: ISPList[];
  siteUrl: string;
  handleDataUpdate(id: number, completed: boolean): Promise<ISPList[]>;
  handleCheckboxChange(id: number, completed: boolean): Promise<ISPList[]>;
  spHttpClient: SPHttpClient;
}

export interface ISPLists{
  value: ISPList[];
}
export interface ISPList{
  Title: string;
  Id: string;
  Completed: boolean;
  //DueTime: Date;
  
}