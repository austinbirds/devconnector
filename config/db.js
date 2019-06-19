const mongoose = require ('mongoose');
const config = require ('config');


//Get the connection string
const db = config.get('mongoURI');

// connect the db
const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser : true, useCreateIndex: true, useFindAndModify:false});
        console.log("Mongo DB connected");
    }catch(err){
        console.log("ERROR : ", err.message);
        //Exit process if not able to connect DB
        process.exit(1);
    }
};

module.exports = connectDB;

