const mongoose = require('mongoose')

var UserSchema = new mongoose.Schema(
    {
        username:
        {
            type:String,
            trim:true,
            required:true,
            lowercase:true,
            index:
            {
                unique:true
            }
        },
        firstname:
        {
            type:String,
            required:true,
            trim:true,

        },
       
        lastname: {
            type: String, 
            required: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String, 
            required: true,        
        }

    })