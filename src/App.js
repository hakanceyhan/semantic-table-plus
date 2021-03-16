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

	rowSelector = (data) => {alert(JSON.stringify(data,null,2))}

	render() {
		return (
			<div>
				<SemanticTablePlus
					data={data}
					columns={columns}
					TableProps={{celled:true, collapsing:true, compact:true}}
					pageSize={10}
					onRowSelect={this.rowSelector}
					cellRenderer={{species:(c,i)=>{return <Button key={i}>{c}</Button>}}}	
				/>
			</div>
		);
	}
}

export default App;			
      