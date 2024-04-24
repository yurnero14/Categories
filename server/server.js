'use strict';

const express = require('express');
const res = require('express/lib/response');
const {check, validationResult} = require('express-validator');
const morgan = require('morgan');
// const dao = require('./dao');
const userDao = require('./dao-users');
const cDao = require('./categories-dao');
const rDao = require('./dao-round');
const resDao = require('./dao-response');
const catDao = require('./Category_data-dao');
const uti = require('./utilities');
const cors = require('cors');

//passport related imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');



// init express
const app = new express();
const port = 3001;

// set up the midddleware==>> Links the application needed for the web app
app.use(morgan('dev'));
app.use(express.json());

function generateRandomLetter(){
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return letters[Math.floor(Math.random() * letters.length)];
}


function getFirstLetters(str) {
    const firstLetters = str
      .split(',')
      .map(word => word[0])
      .join('');

    return firstLetters;
}


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
async function verify(email, password, cb){
  const user = await userDao.getUser(email, password);
  if(!user){
    return cb(null, false, 'Incorrect email or password');
  }
  return cb(null, user);
}))

passport.serializeUser(function(user, cb){
  cb(null,user);
});

passport.deserializeUser(function(user, cb){
  cb(null,user);
});

app.use(session({
  secret: "shhhh...it's a secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  return res.status(401).json({error: 'Unauthorized'});
}

const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
  return `${location}[${param}]: ${msg}`;
}
/***USER APIs ***/
app.post('/api/sessions', function (req, res, next){

  passport.authenticate('local', (err, user, info)=>{
    if(err)
    {

      return next(err);
    }
    if(!user){

      return res.status(401).json({error:info});
    }
    // console.log(req.body)
    req.login(user, (err) => {
      if(err)
      {
        return next(err);
      }
      return res.json(req.user.email);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res)=>{
  if(req.isAuthenticated()){
    res.status(200).json(req.user);
  }
  else{
    res.status(401).json({error: 'Not authenticated'});
  }
});

app.delete('/api/sessions/current', (req,res) =>{
  req.logout(()=>{
    res.status(200).json({});
  });
});
/*this one is just to check*/
app.get('/api/catidget/:category', async (req,res)=>{
  try{
    const cdId = await cDao.getCategoryId(req.params.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      res.status(200).json(cdId);

    }
  }
  catch(err){
    res.status(500).end();
  }


});

app.post('/api/RoundAndResponse', isLoggedIn, async(req,res)=>{
  const errors = validationResult(req).formatWith(errorFormatter);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array().join(', ')});
  }
  
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }

    if(req.body.category==undefined || req.body.difficulty == undefined || req.body.difficulty > 4 || req.body.difficulty < 1){
      return res.status(422).json({error: 'Invalid input'});
    }
    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      const rand = generateRandomLetter();

      const round = {
        cat_Id: cdId,
        letter: rand,
        difficulty: req.body.difficulty,
        StartTime: Math.floor(Date.now() / 1000)
      }

      
      const result = await rDao.createRound(round);
      
      const resp = {
        user_id: req.user.id,
        round_id: result.id,
      }
      
      const reso = await resDao.createResponse(resp);

      
      result["resp_id"] = reso.id;
      result["user_id"] = reso.user_id;
      console.log(result);
      res.json(result);

    }
  }
  catch(err){
    res.status(503).json();
    console.log(err);
  }

})

app.get('/api/roundId', async(req, res)=>{
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }
    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      const result = await rDao.getRoundId(cdId, req.body.letter);
      return res.status(200).json(result);
    }
  }
  catch(err){
    res.status(501).json();
  }
})

app.get('/api/countRound', async(req, res)=>{
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }
    if(req.body.category==undefined || req.body.letter==undefined ||req.body.letter.length !=1){
      return res.status(422).json({error: 'Invalid input'});
    }

    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }

    else{
      if(req.body.letter.toUpperCase()){
        req.body.letter = req.body.letter.toLowerCase();
      }
      const result = await rDao.countRoundId(cdId, req.body.letter);
      return res.status(200).json(result);
    }

  }
  catch(err){
    res.status(501).json();
  }
})

app.put('/api/answer/:respId', isLoggedIn, async(req, res)=>{
  const reso= await resDao.getResponse(req.params.respId);
  const round = await rDao.getRound(reso.round_id);
 
  const data = await catDao.getAllCategoryDataBycatId(round.cat_Id);
  const count = await rDao.countRoundId(round.cat_Id, round.letter);
  const listofRounds= await rDao.getRoundList(round.cat_Id, round.letter);
  const listofUserRounds = await resDao.getRoundsPlayedByUser(req.user.id);
  // const listofuserResp = await resDao.getAllanswersfromRoundandUserid(round_id, req.user.id);
  let allresp = [];
  for(let i=0; i<listofRounds.length; i++){
    let resp = {answers: await resDao.getAllanswerfromRoundid(listofRounds[i].id)//(listofRounds[i].id);
  }
    console.log("id is:", listofRounds[i].id);
    console.log("resp is:", resp.answers);
    let stringofansw =resp.answers
    
    
    let length=stringofansw.length;
    
    if(stringofansw[0].answers!==null){
   

    if(stringofansw[0].answers!==null){
   
    let words = await uti.stringToarray(stringofansw[0].answers);
    for(let j=0; j<words.length; j++){
      allresp.push(words[j]);
      console.log("success");
    }
  }
}
    else if(stringofansw[0].answers===null){
      allresp=allresp;
    }
   
  }
 
  let userResp =[];
 
  let idArr=[];
  for(let i=0; i<listofRounds.length; i++){
    idArr.push(listofRounds[i].id);
  }
  const notplayedbyuser=idArr.filter(r=>!listofUserRounds.includes(r));
  
  const respnotofuser=[];
  for(let i=0; i<notplayedbyuser.length; i++){
    const resp = {answers: await resDao.getAllanswerfromRoundid(notplayedbyuser[i])}//(listofRounds[i].id);
    let stringofansw =resp.answers
    // respnotofuser.push(resp.answers);
    let words = await uti.stringToarray(stringofansw[0].answers);
    for(let j=0; j<words.length; j++){
      respnotofuser.push(words[j]);
    }
    
  }

  
 
let same=[]
for(let i=0; i<listofRounds.length; i++){
  for(let j=0; j<listofUserRounds.length;j++){
    if(listofRounds[i].id == listofUserRounds[j]){
      same.push(listofRounds[i].id);
    }
  }
}




 for(let i = 0; i<same.length; i++){
  const resp= await resDao.getAllanswersfromRoundandUserid(same[i], req.user.id);
  
  let stringofansw =resp;
  console.log(stringofansw);
  console.log(typeof(stringofansw));
 
  if(stringofansw[0]===null){
    userResp=userResp;
  }
  else{
 
  for(let j=0; j<stringofansw.length; j++){
    userResp.push(stringofansw[j]);
  }
}
  
 }
 let userRespstring=userResp.toString();
 
 userResp=uti.stringToarray(userRespstring);

  let score = 0;
 
  const RoundExpiry = uti.TimeExpiry(round.StartTime);
  if(RoundExpiry>=60){
    return res.status(422).json({error: `Round has expired`})
  }
  const anssss= await uti.stringToarray(req.body.answers);
  const ans = uti.removeduplicates(anssss);

  
  try{
    if(Object.keys(req.body).length ===0){
      return res.status(422).json({error: `Empty body request`})
    }
    if(req.body.answers.length===0 || req.body.answers.length < 2){
      return res.status(422).json({error: `Incomplete answer`})
    }
    

    else{
      
      const fl= 0;
     
      
      // console.log(data);
      if(round.difficulty===1 && ans.length<2){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      
      if(round.difficulty===1 && ans.length>=2){
      for(let i=0; i<ans.length; i++){
        if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data===ans[i])===true){
          if(count<=2){
            console.log("I am here");
            score=score + 5;
          }
          
          else if(count>2 && (allresp.some(x=>x==ans[i]))===false){
            console.log("I am here where count >2 clause 1");
            score=score + 10;
          }
          else if(count>2 && (allresp.some(x=>x==ans[i]))===true && (userResp.some(x=>x==ans[i]))===false){
            console.log("I am here where count >2 clause 2");
            score=score + 5;
          }
         
          else if(count>2 && notplayedbyuser===[]){
            console.log("I am here where count >2 clause 3");
            score=score+10
          }
          else if(count>2 && (userResp.some(x=>x==ans[i]))===true && (allresp.some(x=>x==ans[i]))===true){
            console.log("I am here where count >2 clause 3 revised");
            score=score+10
          }
          else if(count>2 && respnotofuser.some(x=>x==ans[i])===true){
            console.log("I am here where count >2 clause 4");
            score=score+5
          }

        }
        else{
          score=score + 0;
        }

      }}
      else if(round.difficulty===2 && ans.length<3){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      if(round.difficulty===2 && ans.length>=3){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data===ans[i])===true){
            if(count<=2){
              console.log("I am here");
              score=score + (5*2);
            }
            
            else if(count>2 && (allresp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 1");
              score=score + (10*2);
            }
            else if(count>2 && (allresp.some(x=>x==ans[i]))===true && (userResp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 2");
              score=score + (5*2);
            }
            
            else if(count>2 && notplayedbyuser===[]){
              console.log("I am here where count >2 clause 3");
              score=score+(10*2);
            }
            else if(count>2 && (userResp.some(x=>x==ans[i]))===true && (allresp.some(x=>x==ans[i]))===true){
              console.log("I am here where count >2 clause 3 revised");
              score=score+(10*2);
            }
            else if(count>2 && respnotofuser.some(x=>x==ans[i])===true){
              console.log("I am here where count >2 clause 4");
              score=score+(5*2);
            }
  
          }
          else{
            score=score + 0;
          }
  
        }}
      else if(round.difficulty===3 && ans.length<4){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      if(round.difficulty===3 && ans.length>=4){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data===ans[i])===true){
            if(count<=2){
              console.log("I am here");
              score=score + (5*3);
            }
           
            else if(count>2 && (allresp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 1");
              score=score + (10*3);
            }
            else if(count>2 && (allresp.some(x=>x==ans[i]))===true && (userResp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 2");
              score=score + (5*3);
            }
            
            else if(count>2 && notplayedbyuser===[]){
              console.log("I am here where count >2 clause 3");
              score=score+(10*3);
            }
            else if(count>2 && (userResp.some(x=>x==ans[i]))===true && (allresp.some(x=>x==ans[i]))===true){
              console.log("I am here where count >2 clause 3 revised");
              score=score+(10*3);
            }
            else if(count>2 && respnotofuser.some(x=>x==ans[i])===true){
              console.log("I am here where count >2 clause 4");
              score=score+(5*3);
            }
  
          }
          else{
            score=score + 0;
          }
  
        }}
      else if(round.difficulty===4 && ans.length<6){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      if(round.difficulty===4 && ans.length>=6){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data===ans[i])===true){
            if(count<=2){
              console.log("I am here");
              score=score + (5*4);
            }
           
            else if(count>2 && (allresp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 1");
              score=score + (10*4);
            }
            else if(count>2 && (allresp.some(x=>x==ans[i]))===true && (userResp.some(x=>x==ans[i]))===false){
              console.log("I am here where count >2 clause 2");
              score=score + (5*4);
            }
           
            else if(count>2 && notplayedbyuser===[]){
              console.log("I am here where count >2 clause 3");
              score=score+(10*4);
            }
            else if(count>2 && (userResp.some(x=>x==ans[i]))===true && (allresp.some(x=>x==ans[i]))===true){
              console.log("I am here where count >2 clause 3 revised");
              score=score+(10*4);
            }
            else if(count>2 && respnotofuser.some(x=>x==ans[i])===true){
              console.log("I am here where count >2 clause 4");
              score=score+(5*4);
            }
  
          }
          else{
            score=score + 0;
          }
  
        }}
    
      console.log("i am hereeee");
      console.log(score);
      
      const anstring=ans.toString();
      
      console.log(anstring);
      const result = await resDao.storeAnswers(req.params.respId, anstring); // still no idea how to retrieve round id from round table
      // if(result[0])
      console.log(result);
      const point= await resDao.storeScore(score, req.params.respId);
      console.log("mein yahan hu");
      console.log(point);
      return res.status(200).json({answers:result, score: point});
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json();
  }

})

app.get('/api/score', isLoggedIn, async(req, res)=>{
  let score_country=0;
  let score_animals=0;
  let score_color=0;
  
  try{
    
   
    const listofUserRounds = await resDao.getRoundsPlayedByUser(req.user.id);
   
    for(let i =0; i<listofUserRounds.length; i++)
    {
    
      let score = await resDao.getScore(req.user.id, listofUserRounds[i]);
      
      let catid= await rDao.getCategoryId(listofUserRounds[i]);
    
      if(score.score!==null){
        if(catid.cat_Id===1){
          score_animals=score_animals+score.score;
        }
        if(catid.cat_Id===2){
          score_country=score_country+score.score;
        }
        if(catid.cat_Id===3){
          score_color=score_color+score.score;
        }
        
      }
      else{
        score_animals=score_animals+0;
        score_country=score_country+0;
        score_color=score_color+0;
    }
    }
   
      let result={
        Animals: score_animals,
        Countries: score_country,
        Colors: score_color
      }
      return res.status(200).json(result);
   

  }
  catch(err){
    console.log(err);
    res.status(501).json();
  }
})

app.get('/api/hallofFame', isLoggedIn, async(req, res)=>{
  const all = await resDao.getAll();
 
  let record=[];

  // console.log(all[0].user_id);
  try{
    // return res.status(200).json(all);
       for(let j=0; j<all.length;j++){
        let score_country=0;
        let score_animals=0;
        let score_color=0;
      let listofUserRounds = await resDao.getRoundsPlayedByUser(all[j].user_id);
      console.log("User id is :",all[j].user_id );
      console.log("list of roundsis :",listofUserRounds);
      for(let i =0; i<listofUserRounds.length; i++){
        let score = await resDao.getScore(all[j].user_id, listofUserRounds[i]);
        console.log("score is:", score.score);
        let catid= await rDao.getCategoryId(listofUserRounds[i]);
        // console.log("cdid is:", catid.cat_Id)
        if(score.score!==null){
                if(catid.cat_Id===1){
                  score_animals=score_animals+score.score;
                }
                else if(catid.cat_Id===2){
                  score_country=score_country+score.score;
                  console.log("score of country:", score_country);
                }
                else if(catid.cat_Id===3){
                  score_color=score_color+score.score;
                }
                
              }
              else{
                      score_animals=score_animals+0;
                      score_country=score_country+0;
                      score_color=score_color+0;
                  }

      }
      let userdetail=await userDao.getUserbyId(all[j].user_id)
      console.log("user is:", userdetail.name);
      let partialres={
        name:userdetail.name,
        Animals: score_animals,
        Countries: score_country,
        Colors: score_color
      }
      record.push(partialres);
      console.log("records are:", record);
}
        
   
    

    let AniWinner="";
    let CountryWinner="";
    let ColorWinner="";
    let maxColor=0;
    let maxCountry=0;
    let maxAnimal=0;
    
    for(let x =0; x<record.length;x++){
      if(record[x].Countries>maxCountry){
        maxCountry=record[x].Countries;
        CountryWinner=record[x].name;
      }
    }

    for(let x =0; x<record.length;x++){
      if(record[x].Animals>maxAnimal){
        maxAnimal=record[x].Animals;
        
        AniWinner=record[x].name;
      }
    }
    
    for(let x =0; x<record.length;x++){
      if(record[x].Colors>maxColor){
        maxColor=record[x].Colors;
        ColorWinner=record[x].name;
      }
    }
   
   
    let hof={
      Category1: "Animals",
      hof1: AniWinner,
      hof1score: maxAnimal,
      Category2: "Countries", 
      hof2: CountryWinner,
      hof2score: maxCountry,
      Category3: "Colors",
      hof3: ColorWinner,
      hof3score: maxColor
    }
    return res.status(200).json(hof);
    
 

  }
  catch(err){
    console.log(err);
    res.status(501).json();
  }
})

app.get('/api/rounds', async(req, res)=>{
  try{
    const all = await rDao.getAllrounds();
    res.status(200).json(all);

   
  }
  catch(err){
    res.status(501).json();
  }
})

// activate the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});