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
    username: String,
    from_user: 
    {
      type:String,
      default: "User"
    },
    date_sent:{
      type: Date,
      default: Date.now
    },
    message : String,
    room: String

    //“_id”: 847het8nieigouy4v”,
    // “from_user”: “pritamworld”,
    // “to_user”: “moxdroid”,
    // “room”: “covid19”,
    // “message”: “What about covid19 vaccine?”
    // “date_sent”: “01-28-2021 18:30 PM”

  })

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

app.post('/login',function(req,res)
{
})

app.get('/register',function(req,res)
{
  res.sendFile('register.html')
})

app.post('/register',function(req,res)
{
  req.body.password
})

io.on('connection', (socket) => {

  
  console.log(`A user is connected: ${socket.id}`)

  //Join New room
   socket.on('join',async ({roomName, roomLeave}) => {
    
    console.log(roomName,roomLeave)

    socket.join(roomName)
    socket.leave(roomLeave)

    var roomy = await Message.find({room:roomName})
    
    socket.emit('JoinedRoom', roomy)
})


socket.on('sentMessage',async ({message, roomName, fromuser}) => 
{
  console.log(message, roomName)
  var combined = new Message({room:roomName, message:message.message, from_user: fromuser})
  await combined.save()
  
  var roomy = await Message.find({room:roomName})  
    socket.emit('JoinedRoom', roomy)
})


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



