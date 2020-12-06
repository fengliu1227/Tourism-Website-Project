const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const static = express.static(__dirname + "/public");
app.use("/public", static);

app.use(
  session({
    name: 'XiaolinYangFinalProject',
    secret: "I'm tired",
    saveUninitialized: true,
    resave: false,
    // cookie: { maxAge: 180000 }
  })
);

app.use((req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
});

app.use('/users/private', (req, res, next) => {
    if(!req.session.user) {
      return res.redirect('/users/login')
    }else {
        next(); 
    }
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});