const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const Models = require("./models")
const WaiterRoutes = require("./waitersApp");
const waiters = Models(process.env.MONGO_DB_URL || "mongodb://localhost/waiter_availability");
const waitersRoutes = WaiterRoutes(waiters);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('handlebars',exphbs({defaultLayout : 'main'}) );
app.set('view engine', 'handlebars');
app.use(session({
    secret:'keyboard cat',
    cookie: { maxAge: 60000 *30 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.get("/",function(req,res){
    res.redirect("/waiter")
})

app.get("/waiter", waitersRoutes.avail)

app.get("/waiter/:id", waitersRoutes.usernames)
app.post("/waiter/:id", waitersRoutes.update)

app.get("/days",waitersRoutes.admin)
app.post("/days", waitersRoutes.admin)





let portNumber =process.env.PORT || 3005;
app.listen(portNumber, function(){
    console.log('Web application started on port ' + portNumber);
});
