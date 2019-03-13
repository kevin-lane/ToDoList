import { ISPList } from './components/IToDoListProps';
import { HttpClient, SPHttpClient } from '@microsoft/sp-http';
import { sp } from 'sp-pnp-js';


export interface IGetDataService {
    getData(): Promise<ISPList[]>;

    handleCheckboxChange(id: number, completed: boolean): Promise<ISPList[]>;
}

export class MockDataService implements IGetDataService {

    private myList: ISPList[] = [
        {Title: 'ToDos', Id: '1', Completed: true},
        {Title: 'Webparts', Id: '2', Completed: true},
        {Title: 'I like summer', Id: '3', Completed: false}
    ];

    getData(): Promise<ISPList[]>{
        return new Promise<ISPList[]>((resolve) => {
            resolve(this.myList);
        });
    }

    handleCheckboxChange(id: number, completed: boolean): Promise<ISPList[]> {
        console.log("Updating data source with id: ", id);

        // this.myList.map((element) => {
        //     if(element.Id === id.toString()){
        //         element.Completed = !element.Completed;
        //     }
        // }); 

        return new Promise<ISPList[]>((resolve) => {
            resolve(this.myList);
        });
    }
}

export class SPDataService implements IGetDataService{
    private spHttpClient : SPHttpClient;
    private absoluteUrl : string;

    constructor(httpClient:SPHttpClient, url:string){
        this.spHttpClient = httpClient;
        this.absoluteUrl = url;
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    getData(): Promise<ISPList[]>{
        return this.spHttpClient.get(this.absoluteUrl + `/_api/web/lists/GetByTitle('ToDoList')/Items`, SPHttpClient.configurations.v1)
        .then((result) => {
            return result.json().then((json) => {
                return json.value;
            })
        })
    }
    handleCheckboxChange(id: number, completed: boolean): Promise<ISPList[]> {
        console.log("In service and handleCheckboxChange: ", id, " " , completed);
        return sp.web.lists.getByTitle("ToDoList").items.getById(id)
        .update({Completed: !completed}).then(() => {
            return this.getData().then((updatedValue) => {
                console.log("Data after update: ", updatedValue);
                return updatedValue;
            })
        });
       
            /*list.items.getById(id).update({
                Id: id,
                Completed: completed
                
            }).then(i => {
                console.log(i);
                return this.getData;
            });
           return this.handleCheckboxChange(id, completed);*/
    }
}

export class PNPDataService implements IGetDataService{
    getData(): Promise<ISPList[]>{
        return sp.web.lists.get().then((result) => {
            return result;
        })
    }
    handleCheckboxChange(id: number): Promise<ISPList[]> {
        throw new Error ("Method not implemented");
    }
}