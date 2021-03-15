

import React, { Component } from 'react';
import { Table, Pagination, Input, Button } from 'semantic-ui-react';

import _ from 'lodash'
import XLSX from 'xlsx';

const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

const search = (data, searchString) => {
    return data.filter(r => _.includes(Object.values(r).join('|').toLowerCase(), _.toString(searchString)))
}

class SemanticTablePlus extends Component {
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
                           pageSize:size,
                         }); 
            }   
        }

    createHeader = () => {
        const { columns, searchable,exportable } = this.props;
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
        
        const utilityBox =   <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell colSpan={columns.length} >
                                    {searchable?<Input  {...this.props.SearchInputProps} icon='search' placeholder='Search...' onChange={this.updateSearchString} value={searchString}/>:null}
                                    {exportable?<Button {...this.props.ExportButtonProps} floated='right' onClick={this.exportToExcel}>Export</Button>:null}
                                </Table.HeaderCell>
                            </Table.Row>

        const header = <Table.Header fullWidth>
                            {searchable|exportable?utilityBox:null}
                            <Table.Row>{headerCells}</Table.Row>
                        </Table.Header>     
        return header;
    };

    handleData = (data) => {
        const { searchable } = this.props;
        const { sortColumn, sortDirection, searchString } = this.state;
        if (searchable) {
            data = search(data,searchString);
          };

        if (sortColumn!==null){
            data = _.sortBy(data, sortColumn);
        }

        if (sortDirection==='descending'){
            data.reverse();
        };

        return data;
    };

    exportToExcel = () => {
        const data = this.handleData(this.props.data);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
        XLSX.writeFile(wb, 'download.xlsx')
    }

    createBody = () => {

        const { data, columns, cellRenderer, onRowSelect } = this.props;
        const { page,  pageSize } = this.state;

        const selectable = onRowSelect!==undefined;

        const renderCells = cellRenderer!==undefined;
        
        const shouldRenderCell = (column) =>  {if(renderCells){return _.includes(Object.keys(cellRenderer),column)}else{return false}}

        
        if (data===null||data===undefined){
            return null;
        } else {
        
        let finalData = data.map((d,i)=>{return{...d,index:i}});
        
        finalData = this.handleData(finalData);
       
        const rows = finalData.map((r,i)=>{ 
                           
                            const cells = columns.map((c, ci)=>{
                                return <Table.Cell 
                                            key={`cell-${r.index}-${ci}`} 
                                            id={`cell-${r.index}-${ci}`}>
                                            {shouldRenderCell(c)?cellRenderer[c](r[c],r.index):r[c]}
                                        </Table.Cell>
                            })
                            cells.unshift(<Table.Cell 
                                            collapsing 
                                            key={`cells-${r.index}`} 
                                            id={`cells-${r.index}`}
                                            >   
                                                {selectable?<Button circular toggle size='mini' icon='chevron right' onClick={()=>{this.props.onRowSelect(r)}}/>:null}
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
                         {...this.props.PaginationProps}
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
            <Table {...this.props.TableProps} sortable >
                {header}
                {body}
                {footer}
            </Table>
         );
    }
}
 
export default SemanticTablePlus;