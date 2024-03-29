const express = require ('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path');

//Connect Database
connectDB();
// Init middleware
app.use(express.json({extended: false}));



// Routes definition
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve Static Assets in Production
if(process.env.NODE_ENV === 'production'){
    //Set the static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
    })
}


// Starting Server 
const PORT = process.env.PORT || 5000;
app.listen (PORT, () => console.log(`Server started on port ${PORT}`));
