const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collectiondf

const url = "mongodb+srv://dbuser:stcDE94bbkEHjzLZ@cluster0.xnzlr.mongodb.net/leaderboard?retryWrites=true&w=majority";
const dbName = "leaderboard";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

// app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static('public')) // dont need to serve up html, automatically index like regular site

// app.get('/', (req, res) => {
//     if (err) return console.log(err)
//     res.send('index.html', {messages: result})
// })

app.get('/leaderboard', (req, res)=>{
  // if(err) return console.log(err)
  db.collection('timestamps').find().toArray((err,result)=>{
    if (err) return console.log(err)
    res.json({timestamps: result})
  })
})


// shuffles array
app.get('/shuffle', (req,res)=>{
  // if(err) return console.log(err)
  const images = [
  "images/blackpanther.png",
  "images/spiderman.png",
  "images/blackwidow.png",
  "images/ironman.png",
  "images/hulk.png",
  "images/blackpanther.png",
  "images/spiderman.png",
  "images/blackwidow.png",
  "images/ironman.png",
  "images/hulk.png"
  ]
  //shuffle images
  for(let i = images.length-1; i>=0; i--){ //starting from the last index
      const randomIndex = Math.floor(Math.random() * (i + 1)) // chooses a random number between 0-(i)
      const temp = images[i] // temporarily holds an index
      images[i] = images[randomIndex]
      images[randomIndex] = temp
    }
    res.send(images)
})

app.put('/storewin', (req, res) => {
  let time = req.body.time/1000;
  console.log('time is ' + time + 's')
  db.collection('timestamps')
  .findOneAndUpdate({username : req.body.username}, {
      $set: {
        time : time
        // [`${req.body.username}`]:time+ 's' //+ date;
        // time:time
      }
    }, {
    sort:{_id:-1},
    upsert:true
    }, (err,result) => {
    if (err) return res.send(err.data)
    res.json({fsf:'sfs'})
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
