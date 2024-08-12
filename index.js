const express=require("express");
const {connectToMongoDb} = require("./connect");
const path = require("path");
const app =express();
const PORT=8001;
const cookieParser = require("cookie-parser");

//connection
connectToMongoDb("mongodb://localhost:27017/short-url").then(()=>{console.log("MongoDb Connected")});

//MiddleWare
const {restrictToLoggedinUserOnly, checkAuth} = require("./middlewares/auth")
app.use(express.json());   //Used to parsh json data 
app.use(express.urlencoded({extended: false}));  //Used to parsh form(html) data 
app.use(cookieParser());





//routes
const URL=require("./models/url")
const staticRoute= require("./routes/staticRouter")
const userRoute = require("./routes/user")

const urlRoute = require("./routes/url")

app.use("/", checkAuth, staticRoute); //get req
app.use("/url", restrictToLoggedinUserOnly, urlRoute); //this Post req is done by the page itself(html form)
app.use("/user", userRoute);



app.get("/analytics/:shortId", urlRoute )   //Get req for analytics

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

// app.get("/test", async (req, res)=>{

//     const allurls = await URL.find({});
//     return res.render('home', {
//         urls: allurls,
//     });

// })

app.get("/url/:shortId", async(req, res)=>{
    const shortId= req.params.shortId;
   const entry= await URL.findOneAndUpdate({
        shortId
    }, 
    { $push: {
        visitHistory:{ 
            timestamp: Date.now(),
            },
        }, 
    }
 );
    res.redirect(entry.redirectURL); // to redirct at the original website page decoded in the shortid
});

app.listen(8001, ()=>{console.log(`Server Started at PORT: ${PORT}`)})
