const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI="mongodb://localhost:27017/property?retryWrites=true&w=majority"
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const PORT = 8080;




app.get('/', (req, res) => {
  res.send('application is running!');
});

app.post('/login',async(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const user=await User.findOne({username,password});

  if(!user){
    return res.json({
      "status":400,
      "message":"Wrong username or password"
    })
  }
  // do login success operations
  return res.json({
    "status":200,
    "data":user,
    "message":"Login was successiful!"
  })
})


app.post('/register',[
    body('first_name').notEmpty().withMessage('First Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
,async(req,res)=>{
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log({...req.body})
  //  const {first_name,email,username,password}=req.body;
  try{
  const exists=await User.exists({email:req.body.email});
  if(exists){
     return res.json({
      "status":400,
      "message":`Ooops The email is already taken`
    })
  }
   const user= await User.create({...req.body});
    // insert to db
    return res.json({
      "status":200,
      "data":user,
      "message":`Dear ${req.body.first_name}, Account created successfully`
    })
  }
  catch(error){
    console.log(error)
      return res.json({
        "status":500,
        "message":"Internal Server Error"
      })
    }
   
  })

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => 
{
  app.listen(PORT, () => {
    console.log("Db Connected")
    console.log(`Server is running on http://localhost:${PORT}`);
});

})
.catch((err) => console.error('❌ MongoDB connection error:', err));

