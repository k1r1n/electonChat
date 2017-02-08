var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var data = [{'who':'Chai Holway','message':'Hi!, everybody','datetime':'Today'}]
var user = []
app.get('/json', function(req, res){
  res.json(data)
});



io.on('connection', function(socket){
  console.log('a user connected')
  socket.on('chat message', function(msg){
    if(msg.message=="/c"){
      console.log("clear")
      data = []
    }
    else{
      data.push(msg)
      io.emit('chat message', msg)
      console.log(msg)
    }
  })
  socket.on('disconnect', function(){
    console.log('user disconnected')
    user.splice(0, 1)
  })
})

http.listen(1150, function(){
  console.log('listening on *:1150')
})
