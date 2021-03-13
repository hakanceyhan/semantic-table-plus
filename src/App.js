import React, { Component } from 'react';
import SemanticDndTable from "./SemanticDndTable"
import 'semantic-ui-css/semantic.min.css'
import {data, columns, } from "./data"




class App extends Component {
	render() {
		return (
			<div>
				<SemanticDndTable
					data={data}
					columns={columns}
					pageSize={15}
					searchable={true}
				/>
			</div>
		);
	}
}

export default App;			
      