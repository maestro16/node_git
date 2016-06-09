var PORT = 8889;
var express = require('express'),
	app = express(),
    fs = require('fs'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    multiparty = require('multiparty');

module.exports = (function(){
   function inner(){
      this.start = function (whatToDo){
          app.use(express.static('public'));

		  app.get('/page', function(req, res){
			  res.send('<h1>Hey it works!</h1>');
		  });

		  io.on('connection', function(socket){
		  		      console.log('a user connected!');
                      var ID = (socket.id).toString().substr(0, 5);



              socket.on('file message', function(msg) {
                  console.log(msg.substring(0,10));
                  if (msg.substring(0,10) == 'data:image') {
                      socket.emit('file message push', '<p>me: </p><br> <img style="width:50%" class="img-thumbnail img-rounded" src=" ' + msg + '"/>');
                      socket.broadcast.emit('file message push', '<p>' + 'Аноним' + '</p><br> <img style="width:50%" class="img-thumbnail img-rounded" src=" ' + msg + '"/>');
                  }
                  else {
                      socket.emit('chat message push', 'Выберите изображение!');
                  }
              })
              socket.broadcast.emit('chat message push', '>> a user ' + ID + ' connected '); //everyone except the new one
			  socket.emit('chat message push', 'Добро пожаловать!(Автор: Буснюк Илья)'); //only the newcomer

				      //message from client - recast to others
				      socket.on('chat message', function(msg){
				            console.log('message: ' + msg);
				            socket.broadcast.emit('chat message push', 'Аноним' + ":" + msg);
				            socket.emit('chat message push', 'me:' + msg );
				      });



				      socket.on('disconnect', function(){
				         console.log('a user disconnected!');
				         socket.broadcast.emit('chat message push', '>> a user disconnected ');
				      });
          });
    
		  app.get('/chat', function(req, res){
			  res.sendFile(__dirname + '/public/chat.html');

		  });
          app.use('/file', function(req,res) {
              res.set({'Content-Type' : 'text/plain'});
             res.sendFile(__dirname + '/server.js');
          });
          app.use('/file2', function(req, res) {
              res.set({'Content-Type' : 'text/plain'});
              res.sendFile(__dirname + '/public/chat.html');
          })


		  http.listen(process.env.port || PORT, function(){
			  console.log(PORT);
		  });
      };

    }
  return new inner;
})();
