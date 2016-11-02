/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

var Tokens = require('csrf'),
  tokens = new Tokens({ saltLength: 10, secretLength: 20 }),
  jwt = require('jsonwebtoken');

module.exports.http = {

  /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/

  middleware: {

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'authenticate',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      'customMiddleware',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/
    authenticate: function(req, res, next) {
      if(req.url === '/login') {
        next();
      } else {
          console.log(req.cookies.jwtToken);
          var token = req.cookies.jwtToken,
            csrfFromHeader = req.headers['authorization'].split(" ")[1];
          
          if(!token) {
            res.send('cookie expired or token not found in cookie');
          }


          jwt.verify(token, GlobalConstantsService.globalVariables.secretKeyForJWTToken, function(err, decoded) {
            
            if(err) {
              res.send('jwt token signature is invalid');
            } else {
              
              if(!tokens.verify(decoded.secret, csrfFromHeader)) {
                res.send('csrf token signature is invalid');
              } else if(csrfFromHeader !== decoded.csrf) {
                res.send('csrf and jwt do not match');
              } else {
                // csrf and jwt are verified, proceed further...........
                next();
              }
            
            }
        });
      }
    },
    myRequestLogger: function(req, res, next) {

      console.log("Requested :: ", req.method, req.url);
      return next();
    },

    // customMiddleware: function(app,next){
    //   console.log(app);
    //   next();
    // },


    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     * Note that Sails uses an internal instance of Skipper by default; to      *
     * override it and specify more options, make sure to "npm install skipper" *
     * in your project first.  You can also specify a different body parser or  *
     * a custom function with req, res and next parameters (just like any other *
     * middleware function).                                                    *
     *                                                                          *
     ***************************************************************************/

    bodyParser: require('skipper')({ strict: true })

  },

  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  // cache: 31557600000
};
