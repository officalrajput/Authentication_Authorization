const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dataranu', {
}).then(function(){
    console.log("Connected with Local Database");
}).catch(function(error){
    console.error("Error connecting to database:", error);
});
