const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
app.use(express.json());
app.use(cors());
let todos=[];
mongoose.connect("mongodb://localhost:27017/todomern")
.then(()=>{
 console.log("db is connected");
})
.catch((error)=>{

    console.log("err"+error);
})
const todoschema= new mongoose.Schema({
title :{
    required:true,
    type:String
},
description:String
});
const newmod=mongoose.model('newmodel',todoschema);
app.post('/todolist',async(req,res)=>{
    const{title,description} =req.body;
    /*const todo={
        id:todos.length+1,
        title,
        description
    };*/
    try{
    const newdata=newmod({title,description});
    await newdata.save();
    res.status(201).json(newdata); 
    }
    catch(error)
    {
        console.log("error message :"+error);
        res.status(500).json({message:error});

    }
    //todos.push(todo);
    
   
});
app.get("/todolist",async(req,res)=>
{ try{
    const getdat= await newmod.find();
    res.json(getdat);
   }
   catch(error)
   {
    console.log("error"+error);
    res.status(500); 
   }
})
app.put("/todolist/:id",async(req,res)=>
{try{
    const {title,description}=req.body;
    const id=req.params.id;
    const newmodell=await newmod.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
)
   //await newmodell.save();
if(!newmodell)
    res.status(404).json({message:"no todo list found"});
 res.json(newmodell);
}
catch(error){
    res.status(500).json({message:error});
    console.log(error);
}
})

app.delete("/todolist/:id",async(req,res)=>
{
    try{
    const id=req.params.id;
    await newmod.findByIdAndDelete(id)
    res.status(204).end()
}
    catch(error)
    {
        res.status(500).json({message:error});
        console.log(error);
    }
});

const port=process.env.PORT || 3001;
app.listen(port,()=>{
    console.log("server is listening on port "+(port));
});