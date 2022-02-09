var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
const { channel } = require('diagnostics_channel');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


//Declare MongoDB Schemas
var Message = mongoose.model('Message',{
    name : String,
    message : String,
    room: String
  })


//boy room *********************************************************************************************

  var dbUrl = 'mongodb+srv://robbi:Panchitoisfat12@assignment2db.znhee.mongodb.net/labtest1?retryWrites=true&w=majority'
  
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
      
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{ 
    if(err)
    {
      //sendStatus(500);
      console.log(err)
    }
    //Send Message to all users
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

app.get('/login',function(req,res)
{
  res.sendFile('login.html')
})

// socket.on('clear', function(data)
// {
//   Message.remove({}, function()
//   {
//     io.emit('cleared')
//   })
// })

io.on('connection', (socket) => {
  console.log(`A user is connected: ${socket.id}`)
  //console.log(socket.rooms);
  //socket.join("room1")
  //console.log(socket.rooms);

  socket.on('disconnection', () =>
  {
    io.emit('message', 'User has left the chat')
  }
  )

})

mongoose.connect(dbUrl , { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('mongodb connected',err);
    }else{
        console.log('Successfully mongodb connected');
    }
})

var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});


