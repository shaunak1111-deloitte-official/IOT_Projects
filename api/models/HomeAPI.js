/**
 * HomeAPI.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// mongo collection name
module.exports = {
   	tableName: 'Transurban',    
   	attributes: {
  	_id: {
  		type: 'objectid'
  	},
  	members: {
  		type: 'array'
  	}
  }
};

