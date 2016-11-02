module.exports = {
   	tableName: 'Users',    // mongo collection name
   	attributes: {
  	_id: {
  		type: 'objectid'
  	},
  	username: {
  		type: 'object'
  	},
  	password: {
  		type: 'object'
  	}
  }
};