module.exports = {
  showHomePage: function (req, res) {
  	HomeAPI.find().exec(function(err,data){
  		if(err) {
  			return res.serverError();
  		}
  		data[0].projectName = 'Transurban';
  		console.log(data,typeof data);
  		return res.json(data);
  	});
  }
};