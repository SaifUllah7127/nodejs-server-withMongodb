import express from "express"
import morgan from "morgan"
import cors from "cors"
import mongoose from "mongoose"

mongoose.connect('mongodb+srv://dbu:dbp@cluster0.xowtt.mongodb.net/chatbot?retryWrites=true&w=majority')

const User =mongoose.model('User',{
    name:String,
    email:String,
    address:String
})


const app=express()
const port=process.env.PORT || 3000

app.use(express.json())
app.use(morgan('short'))
app.use(cors())


app.use((req, res, next) => {
    console.log("a request came", req.body);
    next()
  })

app.get('/users',(req,res)=>{
    User.find({},(err,users)=>{
        if(!err)
        {
            res.send(users)
        }
        else{
            res.status(500).send("Error Happened :(")
        }
    })
})

app.get('/user/:id',(req,res)=>{
    
    User.findOne({_id:req.params.id},(err,user)=>{
          if(!err)
          {
              res.send(user)
          }
          else
          {
              res.status(500).send("Error Happened")
          }
    })
    
})


app.post('/user',(req,res)=>{
    if(!req.body.name || !req.body.email || !req.body.address)
    {
        res.status(400).send("Invalid Data")
    }
    else{
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            address:req.body.address
        })

        newUser.save().then(()=>{
            res.send("user created :)")
        })
    }
    
})


app.put('/user/:id',(req,res)=>{

    let updateObj={}
    if(req.body.name)
    {
        updateObj.name=req.body.name
    }

    if(req.body.email)
    {
        updateObj.email=req.body.email
    }

    
    if(req.body.address)
    {
        updateObj.address=req.body.address
    }
    User.findOneAndUpdate({_id:req.params.id},updateObj,{new:true},(err,user)=>{
        if(!err)
        {
            res.send(user)
        }
        else
        {
            res.status(500).send("Error Happpened")
        }
    })

})


app.delete('/user/:id',(req,res)=>{
    User.findOneAndRemove({_id:req.params.id},(err,user)=>{
        if(!err)
        {
            res.send("This User is Deleted"+user)
        }
        else
        {
            res.status(500).send("Error Happened")
        }
    })
})

app.get('/home',(req,res)=>{
    res.send("Welcome :)")
})

app.get('/', (req, res) => {
    res.send('Hi I am a hello world Server program')
  })


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})

// deploy this server to heroku cloud