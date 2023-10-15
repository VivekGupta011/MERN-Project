const express=require("express");
// calling this module
const app=express();
const userRouter = require("./routes/userRouter");
const noteRouter = require("./routes/noteRouter");
const mongoose=require("mongoose");

//this line parse data into json format so that out 'req.body()' can access for further process..
app.use(express.json());

app.use("/users",userRouter);
app.use("/note",noteRouter);

app.get("/",(req,res)=>{
    res.send("Hello Vivekk!")
})


mongoose.connect("mongodb+srv://fdsafa670:sueSEUrMgXzb7O0T@cluster0.b8r0hjw.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
