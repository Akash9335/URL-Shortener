const {getUser} = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next){
    
    const userUid = req.cookies?.uid;
    // const userUid = req.headers["authorization"];
    // const token = userUid.split('Bearer')[1];  
    // const user= getUser(token);
    if(!userUid) return res.redirect("/login");
    const user= getUser(userUid );

    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}

async function checkAuth(req, res, next){
    // const userUid = req.headers["authorization"]; //ye string return karega jisme bearer word bhi hoga
    // console.log(req.headers)
    // const token = userUid.split('Bearer ')[1] ;  // bearer ko separate karne ke liye split ka use kiya hai  
    // const user= getUser( token );
    const userUid = req.cookies?.uid;
    const user= getUser(userUid );
    req.user = user;
    next();
}

module.exports ={
    restrictToLoggedinUserOnly,
    checkAuth,
}