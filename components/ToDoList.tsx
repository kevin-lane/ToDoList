import * as React from 'react';
import styles from './ToDoList.module.scss';
import { IToDoListProps, ISPList, ISPLists } from './IToDoListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import pnp from 'sp-pnp-js';
import * as jquery from 'jquery';

export interface IToDoListState{
  items: ISPLists[];
}

export default class ToDoList extends React.Component<IToDoListProps, any> {
  constructor(props: IToDoListProps){
      super(props);

      this.state = {
        items: this.props.list
      }
    }

    onCheckboxChanged(id: number, completed: boolean){
      console.log("Updating ", id, " stuff when clicked the checkbox");

      this.props.handleDataUpdate(id, completed).then((returnValue) => {
        this.setState({
            items: returnValue
        });   
      });
    }

    /*private componentDidMount(){
      setInterval(
        () => this.fetchDatafromSharePointList(),
        1000
      );
    }*/

    /*private fetchDatafromSharePointList(){
      var reactHandler = this;
      jquery.ajax({
        url: `${this.props.siteUrl}/_api/web/lists/getbytitle('ToDoList')/items`,    
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(resultData) {    
          /*resultData.d.results;*/    
          /*reactHandler.setState({    
            items: resultData.d.results
      });
    },
    error : function(jqXHR, textStatus, errorThrown){
    }
  });
    }*/


    public render(): React.ReactElement<IToDoListProps>{
      console.log("Render Demo: ", this.state.items);
      let items = [];

      for(let i = 0; i < this.state.items.length; i++){
        items.push(<li key={this.state.items[i].Id}>
          <Checkbox label = {this.state.items[i].Title}
         key={this.state.items[i].Id} defaultChecked={this.state.items[i].Completed}
          
        onChange={this.onCheckboxChanged.bind(this, this.state.items[i].Id, this.state.items[i].Completed)}
          />
    </li>);
      }

      
    return (

      <div className={ styles.toDoList }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <ul>
                {items}
              </ul>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
