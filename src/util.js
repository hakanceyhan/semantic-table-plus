
import _ from 'lodash';

export const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

export const search = (data, searchString) => {
    return data.filter(r => _.includes(Object.values(r).join('|').toLowerCase(), _.toString(searchString)))
}