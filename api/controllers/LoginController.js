'use strict'
/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logincontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Tokens = require('csrf'),
tokens = new Tokens({saltLength:10,secretLength:20}),
jwt = require('jsonwebtoken');

function generateCSRF (callback){
	tokens.secret(function(err, secret){
		if(err){
			callback('cannot generate csrf token error');
		}else {
			let token = tokens.create(secret);
			callback(null,{secret:secret,token:token});
		}
	});
}

module.exports = {
	generateCSRFToken: function(req,res){
		tokens.secret(function(err, secret){
			if(err){
				res.send('cannot generate csrf token error');
			}else {
				let token = tokens.create(secret);
				res.send({secret:secret,token:token});
			}
		});
	},

	generateJWTTokens: function(req,res){
		var userNameFromUser = req.body.username,
			passwordFromUser = req.body.password;
		
		console.log('username',userNameFromUser,passwordFromUser);

		UserAPI.find({username:userNameFromUser}).exec(function(err,data){
			if(err){
				return res.serverError();
			}else{
				if(userNameFromUser === data[0].username && passwordFromUser === data[0].password){
					generateCSRF(function(err,csrfToken){
						if (err){
							console.error(err);
						}else{
							// CSRF TOKEN CHANGES EVERYTIME ....
							var token = jwt.sign({csrf:csrfToken.token,secret:csrfToken.secret},GlobalConstantsService.globalVariables.secretKeyForJWTToken,{expiresIn:1000});
							if(err){
								res.send('err could not generate jwt token');
							}else{
								res.cookie('jwtToken', token, { maxAge: 900000, httpOnly: true });
								res.json({'csrfToken':csrfToken.token});
							}
						}
					});
				}else {
					res.send('Username or password do not match...');
				}
			}
		});

		// generateCSRF(function(err,csrfToken){
		// 	if (err){
		// 		console.error(err);
		// 	}else{
		// 		// CSRF TOKEN CHANGES EVERYTIME ....
		// 		var token = jwt.sign({csrf:csrfToken.token,secret:csrfToken.secret},GlobalConstantsService.globalVariables.secretKeyForJWTToken,{expiresIn:1000});
		// 		if(err){
		// 			res.send('err could not generate jwt token');
		// 		}else{
		// 			res.cookie('jwtToken', token, { maxAge: 900000, httpOnly: true });
		// 			res.json({'csrfToken':csrfToken.token});
		// 		}
		// 	}
		// });
	},
	authenticate: function(req,res){
		console.log(req.cookies.jwtToken);
		res.send('test123');
	// 	var token = req.cookies.jwtToken,
	// 	csrfFromHeader = req.headers['authorization'].split(" ")[1];
	// 	if(!token){
	// 		res.badRequest('cookie expired');
	// 	}
	// 	jwt.verify(token,GlobalConstantsService.globalVariables.secretKeyForJWTToken,function(err,decoded){
	// 		if (err){
	// 			res.badRequest('jwt token signature is invalid');
	// 		}else {
	// 			if(!tokens.verify(decoded.secret, csrfFromHeader)){
	// 				res.badRequest('csrf token signature is invalid');
	// 			}else if(csrfFromHeader !== decoded.csrf){
	// 				res.badRequest('csrf and jwt do not match');
	// 			}else{
	// 				res.send('tokens verified....');
	// 			}
	// 		}
	// 	});
	}
};