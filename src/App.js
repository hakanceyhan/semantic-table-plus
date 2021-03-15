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
					pageSize={15}
					exportable={true}
					searchable={true}
					TableProps={{celled:true}}
					PaginationProps={{}}
					SeachInputProps={{}}
					ExportButtonProps={{}}
					onRowSelect={this.rowSelector}
					cellRenderer={{sepal_length:(c,i)=>{return <Button key={i}>{c}</Button>}}}	
				/>
			</div>
		);
	}
}

export default App;			
      