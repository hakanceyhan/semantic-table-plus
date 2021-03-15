import React, { Component } from 'react';
import SemanticTablePlus from "./SemanticTablePlus"
import 'semantic-ui-css/semantic.min.css'
import {data, columns, } from "./data"
import { Button } from "semantic-ui-react"

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {};

        this.rowSelector = this.rowSelector.bind(this); 
    }

	rowSelector = (data) => {console.log(data)}

	render() {
		return (
			<div>
				<SemanticTablePlus
					data={data}
					columns={columns}
					TableProps={{celled:true}}
					pageSize={15}
					PaginationProps={{}}
					searchable={true}
					SeachInputProps={{size:'big'}}
					exportable={true}
					ExportButtonProps={{color:'red'}}
					onRowSelect={this.rowSelector}
					cellRenderer={{species:(c,i)=>{return <Button key={i}>{c}</Button>}}}	
				/>
			</div>
		);
	}
}

export default App;			
      