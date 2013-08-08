var http = require('http'),
    faye = require('faye');

var server = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var secret = 'this_is_a_SeCRet';

server.addExtension({
  incoming: function(message, callback) {
    if (!message.channel.match(/^\/meta\//)) {
      var password = message.ext && message.ext.password;
      if (password !== secret)
        message.error = '403::Password required';
    }
    callback(message);
  },

  outgoing: function(message, callback) {
    if (message.ext) delete message.ext.password;
    callback(message);
  }
});

var port = process.env.PORT || 8000;
console.log("Listening on port " + port + "...");
server.listen(port);
