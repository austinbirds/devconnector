const express = require ('express');
const app = express();


app.get('/', (req,res) =>{
    res.send('API is running');
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen (PORT, () => console.log(`Server started on port ${PORT}`));
