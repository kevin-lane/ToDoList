import * as React from 'react';
import * as ReactDom from 'react-dom';
import { 
  Version,
  Environment,
  EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import styles from './components/ToDoList.module.scss';
import * as strings from 'ToDoListWebPartStrings';
import ToDoList from './components/ToDoList';
import { IToDoListProps, ISPList } from './components/IToDoListProps';
import { IGetDataService, MockDataService, SPDataService, PNPDataService } from './GetDataService';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'; //Checkbox
import { SPHttpClient, HttpClientResponse } from '@microsoft/sp-http';  //Importing the SPHttpClient (REST?)
import { SPHttpClientResponse } from '@microsoft/sp-http';  //Importing the SPHttpClientResponse (REST?)

export interface IToDoListWebPartProps {
  description: string;
  ShowCompletedTasks: boolean;
  NumberOfTasks: number;
}

export default class ToDoListWebPart extends BaseClientSideWebPart<IToDoListWebPartProps> {

  public render(): void {

    let service: IGetDataService;

    if(Environment.type == EnvironmentType.Local){
      service = new MockDataService();
    }
    else{
      service = new SPDataService(this.context.spHttpClient, this.context.pageContext.web.absoluteUrl);
    }

    service.getData().then((result) => {
    const element: React.ReactElement<IToDoListProps > = React.createElement(
      ToDoList,
      {
        greeting: this.properties.description,
        list: result,
        handleDataUpdate: service.handleCheckboxChange,
        handleCheckboxChange: service.handleCheckboxChange,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient
      }
    );

    ReactDom.render(element, this.domElement);
    });

    //this._renderListDataAsync();
}

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
//(REST?)
  /*private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + 
      `/_api/web/lists/GetByTitle('ToDoList')/Items`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        debugger;
        return response.json();
      });
  }

private _renderList(items: ISPList[]): void {  
  let html: string = '';  
  debugger; 
  items.forEach((item: ISPList) => {  
    html += `  
         <tr>  
        <td>${item.Title}</td>  
        </tr>  
        `;  
  });  
    
  const listContainer: Element = this.domElement.querySelector('#spListContainer');  
  listContainer.innerHTML = html;  
}   */

/*private _renderListDataAsync(): void{
  /*this._getListData().then((response) => 
  {
    debugger;
      this._renderList(response.value);
  });
}*/


 /* private _renderListAsync(): void {  
      
    if (Environment.type === EnvironmentType.Local) {  
      this._getMockListData().then((response) => {  
        this._renderList(response.value);  
      });  
    }  
     else {  
       this._getListData()  
      .then((response) => {  
        this._renderList(response.value);  
      });  
   }  
  }
//(MockData)
/*private _getMockListData(): Promise<ISPLists>{
  return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(() => {
    const listData: ISPLists = {
      value: 
      [  
        { Title: 'Winter', Completed: true },
        { Title: 'Spring', Completed: false },
        { Title: 'Autumn', Completed: false }
    ]  
    };
    return listData;
  }) as Promise<ISPLists>;
}*/
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }), 
                PropertyPaneCheckbox('ShowCompletedTasks', {
                  
                }),
                PropertyPaneSlider('NumberOfTasks', {
                  label: "How many To Do checks?",
                  min: 1,
                  max: 5
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
