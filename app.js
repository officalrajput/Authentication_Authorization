const express = require('express');
const app = express();
const path = require('path')
const bcrypt = require('bcrypt');
const AuthSchema = require('./models/auth-model')
const cookieparser = require('cookie-parser')
const mongoose = require('mongoose')
const jwt  = require('jsonwebtoken')
const mongooseconnection = require('./config/mongoose')
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieparser());
app.get('/', function (req, res) {
    res.render('index')
});
app.post('/create',  (req, res) => {
        let { name, email, password, age } = req.body;

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async  (err, hash) => {
                let createUser = await AuthSchema.create({
                    name,
                    email,
                    password:hash,
                    age,
                });
                let token = jwt.sign({email},'snehasaduuravi@1');
                res.cookie('token',token);          
                res.send(createUser);

            })
        })
});

app.get('/login',function(req,res){
    res.render('login')
})
app.post('/login', async function(req,res){
    let userEmail = await AuthSchema.findOne({email:req.body.email})
    if(!userEmail) res.send('Email Not Exist In Database Try Another Email')

        //For Check Password is correct or Not
        bcrypt.compare(req.body.password,userEmail.password , function(err,result){
            if(result) {
                let token = jwt.sign({email:userEmail.email},'Snehasaduu@1')
                res.cookie('token',token);
                res.send('YES NOW  YOU  LOGIN SUCCESSFULY ON HOMEPAGE') 
            }
                else res.status(500).send("Password Not Exist In Database Try Aain")
        })
})
app.get('/logout',function(req,res){
    res.cookie('token',"");
    res.redirect('/'); 
})

app.listen(3000); 