const express = require('express')
const app = express()
var MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt')
const bodyParser=require('body-parser')
const cookieParser = require("cookie-parser");
const session = require('express-session')
const req = require('express/lib/request')
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
const url = "mongodb://mongodb:27017/scoobido"; 
let dbo;
// set the view engine to ejs
app.set('view engine', 'ejs');
// cookie parser middleware
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());



// a variable to save a session
var sessionUser;


// You can also use an ENS name for the contract address
const daiAddress = "0x4dabdd79fef74fe226362df3963af50be6cd4ace";
/*
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
  // Some details about the token
  "function balanceOf(address _owner) public view returns (uint256)",
  "function mintToken(address to, string memory tokenURI) external returns (uint tokenId)"
];

let provider;
window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
const signer = provider.getSigner();
const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./build/contracts/tokenTest.json', 'utf8'));
// The Contract object
const daiContract = new ethers.Contract(daiAddress, contract.abi, provider);
const daiWithSigner = daiContract.connect(signer);

*/

function setDB(){
    dbo.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("Users created!");
        
      });
    dbo.createCollection("favoriteTokens", function(err, res) {
        if (err) throw err;
        console.log("Users created!");
        
    });
}




MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("mydb");
    //setDB()
    console.log("connected to our DB !")
    });

app.use(session({
    secret:'this is secret',
    cookie : { maxAge : 1800000},
    saveUninitialized: false,
    resave: false 
}))
      
app.use('/about', (req,res,next) => {
    console.log('hello')
    next()
})

app.use('/login', (req,res,next) => {
    if(req.session.user==undefined){
        next()
    } else {
        res.redirect('/')
    }
    
})

app.use('/register', (req,res,next) => {
    if(req.session.user==undefined){
        next()
    } else {
        res.redirect('/')
    }
    
})

app.use('/indexLoggedIn', (req,res,next)=>{
    if(req.session.user==undefined){
        res.redirect('/login')
    } else {
        next()
    }
})

// index page
app.get('/', async function(req, res) {
  /*  customHttpProvider.getBlockNumber().then((result) => {
        daiContract.balanceOf("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703").then((balance) =>{
            
        console.log("Current block number: " + result);
        var x = new BigNumber(balance._hex)
        
        console.log( x.toString())

        })*/

    if (req.session.user==undefined){
        res.render('pages/index')
        
    } else {
        console.log("you're logged in !")
        res.redirect('/indexLoggedIn')
    }
    
});

// about page
app.get('/about', function(req, res) {
    sessionUser=req.session.user
    res.render('pages/about',  {
        sessionUser : sessionUser
    });
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});



// index page when logged in
app.get('/indexLoggedIn', async function(req, res) {
    var favorites =[]
    favorites= await dbo.collection("favoriteTokens").find({user:req.session.user}).toArray()
    console.log(favorites)
    res.render('pages/indexLoggedIn', {
        sessionUser : req.session.user,
        favoriteList : JSON.stringify(favorites),
    })
});


// login page
app.get('/login', function(req, res) {
    res.render('pages/login');
});

// register page
app.get('/register', function(req, res) {
    res.render('pages/register');
});



app.post('/login', async (req,res) =>  {
    const obj = JSON.parse(JSON.stringify(req.body));
    const user = await dbo.collection("customers").findOne({name:obj.name})
    if (user == null){
        return res.status(400).send('Authentification failed')
    }
    
    
    try{
        if (await bcrypt.compare(obj.password, user.password)){
            req.session.authenticated = true
            req.session.user = user.name
            console.log(req.session)
            sessionUser=req.session.user
            res.redirect('/')
        } else {
            res.send('Authentification failed')
        }
    } catch {
        res.status(500).send()
    }
})      

app.post('/register', async (req,res) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    try{
        if (await obj.password==obj.confirmPassword){
            const salt= await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(obj.password,salt)
            const user= {name:obj.name , password: hashedPassword}
            dbo.collection("customers").insertOne(user)
            res.redirect('/')
        } else {
            res.send('Passwords do not match')
        }
    } catch (err){
        console.log(err)
        res.status(500).send()
        //const user= {name:obj.name , password: hashedPassword}
        //dbo.collection("customers").insertOne(user)
    }
    
})

app.post('/indexLoggedIn', async (req,res) => {
    try{
        var userFavorites = await dbo.collection("favoriteTokens").find({user:req.session.user})
        res.json(userFavorites)
    } catch(err) {
        console.log(err)
        res.send("dajzjda")
    }
    
})

app.post('/indexLoggedIn/favUpdate', async (req,res) => {
    try{
        const favorite = JSON.parse(JSON.stringify(req.body));
        const fav= {user:req.session.user , tokenId: favorite.tokenId, contractAddress: favorite.contractAddress}
        var favoriteDB = await dbo.collection("favoriteTokens").findOne(fav)
        console.log("found"+await favoriteDB)
        if (favoriteDB) {
            await dbo.collection("favoriteTokens").deleteOne(fav)
        } else {
            await dbo.collection("favoriteTokens").insertOne(fav)
        }
        var userFavorites = await dbo.collection("favoriteTokens").find({user:req.session.user}).toArray()
        console.log(userFavorites)
        res.json(userFavorites)
    } catch(err) {
        console.log(err)
        res.send("dajzjda")
    }
    
})

app.listen(3000) 

/*
dbo.collection("customers").insertMany(getDatas(), function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();
      });

*/