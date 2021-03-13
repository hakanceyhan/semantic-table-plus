

import React, { Component } from 'react';
import { Table, Icon, Pagination, Input } from 'semantic-ui-react';
import { paginate, search } from './util'
import _ from 'lodash'

class SemanticDndTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            page:1,
            noOfPages:1,
            sortColumn:null,
            sortDirection:null,
            searchString:'',
         }

        this.createHeader = this.createHeader.bind(this);
        this.createFooter = this.createFooter.bind(this);
        this.createBody = this.createBody.bind(this);
        this.handleColumnSort = this.handleColumnSort.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.updateSearchString = this.updateSearchString.bind(this);
       
    }

    componentDidMount(){
        const { data, pageSize } = this.props;
        
        if (!(data===null||data===undefined)){
            const size = pageSize===null||pageSize===undefined?data.length:pageSize;
            this.setState({noOfPages:Math.ceil(data.length/size),
                           pageSize:size}); 
            }   
        }

    createHeader = () => {
        const { columns, searchable } = this.props;
        const { sortColumn, sortDirection, searchString } = this.state;
      
        const headerCells = columns.map((c, i)=>{
            return (<Table.HeaderCell 
                        key={`column-${i}`} 
                        id={c}
                        value={c}
                        sorted={sortColumn === c ? sortDirection : null}
                        onClick={this.handleColumnSort}
                        >
                        {c}
                    </Table.HeaderCell>)})
        headerCells.unshift(<Table.HeaderCell key='column-f' id='column-f' />)
        
        const searchBox =   <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell colSpan={columns.length}>
                                    <Input  icon='search' placeholder='Search...' onChange={this.updateSearchString} value={searchString}/>
                                </Table.HeaderCell>
                            </Table.Row>

        const header = <Table.Header fullWidth>
                            {searchable?searchBox:null}
                            <Table.Row>{headerCells}</Table.Row>
                        </Table.Header>     
        return header;
    };

    createBody = () => {

        const { data, columns, searchable } = this.props;
        const { page, sortColumn, sortDirection, searchString, pageSize } = this.state;
        
        if (data===null||data===undefined){
            return null;
        } else {
        
        let finalData = data.map((d,i)=>{return{...d,index:i}});
        
        if (searchable) {
            finalData = search(finalData,searchString);
          };

        if (sortColumn!==null){
            finalData = _.sortBy(finalData, sortColumn);
        }

        if (sortDirection==='descending'){
            finalData.reverse();
        };

  
       
        const rows = finalData.map((r,i)=>{ 
                           
                            const cells = columns.map((c, ci)=>{
                                return <Table.Cell 
                                            key={`cell-${r.index}-${ci}`} 
                                            id={`cell-${r.index}-${ci}`}>
                                            {r[c]}
                                        </Table.Cell>
                            })
                            cells.unshift(<Table.Cell 
                                            collapsing 
                                            key={`cells-${r.index}`} 
                                            id={`cells-${r.index}`}
                                            style={{background:'#f9fafb'}}>
                                             <Icon name='ellipsis vertical' />
                                        </Table.Cell>)
                            const row = <Table.Row
                                            key={`row-${r.index}`} 
                                            id={`row-${r.index}`}>
                                                {cells}
                                        </Table.Row>
                            return row
                        });
        
        const paginatedRows=paginate(rows,pageSize,page);

        return <Table.Body>{paginatedRows}</Table.Body>
        }
    };

    createFooter = () => {
        const { page, noOfPages } = this.state;
        const {pageSize} = this.props;
        if (pageSize!==null&&pageSize!==undefined) {

        return <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell colSpan={this.props.columns.length}>
                         <Pagination
                         activePage={page}
                         totalPages={noOfPages}
                         onPageChange={this.handlePaginationChange}
                         />
                    </Table.HeaderCell>
                 </Table.Row>
               </Table.Footer>
        } else {
            return null;
        }
    };

    handlePaginationChange = (e, { activePage }) => {this.setState({ page: activePage })}

    handleColumnSort = (e) => {
        const sortColumn = e.currentTarget.id;
        const sortDirection = this.state.sortDirection === 'ascending' ? 'descending' : 'ascending';
        this.setState({sortColumn,sortDirection});
    }

    updateSearchString = (e) => {
        const searchResult = search(this.props.data, e.target.value)
        const size = this.props.pageSize===null||this.props.pageSize===undefined?searchResult.length:this.props.pageSize;
        const noOfPages = Math.ceil(searchResult.length/size);
        this.setState({searchString: e.target.value, noOfPages: noOfPages});
    }


    render() { 
        const header = this.createHeader()
        const body = this.createBody()
        const footer = this.createFooter()
        return ( 
            <Table sortable celled>
                {header}
                {body}
                {footer}
            </Table>
         );
    }
}
 
export default SemanticDndTable;