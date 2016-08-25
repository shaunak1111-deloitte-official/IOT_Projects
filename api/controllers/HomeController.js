module.exports = {
  showHomePage: function (req, res) {
  	HomeAPI.find().exec(function(err,data){
  		if(err) {
  			return res.serverError();
  		}
  		return res.json('transurban members', data);
  	})

	
  }
};