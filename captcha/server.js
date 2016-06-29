const port = 8888;

var captchapng = require('captchapng'),
express = require('express'),
app = express(),
bodyParser = require('body-parser');

module.exports = (()=>{
	function inner(){
		this.start = whatToDo=>{
			app.use(bodyParser());
			app.use(express.static(__dirname+'/public'));
			app.get('/captcha', (req, res) => {
				res.sendFile(__dirname + '/public/public.html');
			});
			var num;
			function capture (req, res) {
				num = parseInt(Math.random()*9000 + 1000);
				if(req.url == '/captcha.png') {
					var p = new captchapng(80,30, num);
					p.color(0, 0, 0, 0);
					p.color(80, 80, 80, 255);

					var img = p.getBase64();
					var imgbase64 = new Buffer(img,'base64');
					res.writeHead(200, {
						'Content-Type': 'image/png'
					});
					res.end(imgbase64);
				} else {
					res.end('');
				}
			}
			app.get('/captcha.png', capture);

			app.post('/captcha', function(req, res){
				var lm = req.body.src;
				if(lm == num) {
					res.json({'answ' : 'Правильно!'});
				   }else{
					res.json({'answ' : 'Ошибочка :('});
				}
			});
			app.listen(process.env.port||port,()=>console.log('> Port:', port));
		};
	}
	return new inner;
})();
