const mongoose =require ('mongoose')

const users=new mongoose.Schema({
    name:"string",
    email:"string",
    password:"string",
    
})
module.exports=mongoose.model("users",users);