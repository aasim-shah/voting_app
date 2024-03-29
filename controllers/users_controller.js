import userModel from "../models/userModel.js";
import contestModel from "../models/contestModel.js";
import  Jwt  from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import { name } from "ejs";

class users {
    home(req ,res) {
        res.send('users homepage')
    }
   
    async  login_post(req ,res) {
        const Token = await req.user.Authuser()
        res.cookie('jwt_Token' , Token )
        console.log(req.user)
         res.redirect('/user/dashboard')
    }
    async  login_get(req ,res) {
      res.render('login')
    }

    async  google_login(req ,res) {
        const user = await userModel.findOne({ google_id : req.user.id})
        console.log(req.user)
        if(user){
            const token = Jwt.sign({google_id : req.user.id} , 'mysupersecret')
            res.cookie('jwt_Token' , token )
             res.redirect('/user/dashboard')
        }else{
            const token = Jwt.sign({google_id : req.user.id} , 'mysupersecret')
            
    console.log(token)
            const d= new userModel({
                google_id : req.user.id,
                tokens : [{token : token}]
            })
            const user_added = await d.save()
            res.redirect('/user/login')
        }

      }
  

    async  dashboard_get(req ,res) {
        
      res.render('home')
    }


    
    async  admin_get(req ,res) {
        console.log(req.user)
        res.render('adminhome')
    }
      
    async  admin_search(req ,res) {
        const username = req.body.search;
        console.log(username)
     const searched = await   userModel.findOne({$text: {$search: `${username}`}});
        res.send(searched)
    }

  
    async  voted_get(req ,res) {
        const id = '61cb582bb1072c20773a540c'
        const check_voted = await userModel.findOne({google_id : req.user.google_id})
        const user_vote = check_voted.voted;
        console.log(user_vote)
      const votes = await contestModel.findById(id)
        const n = Number(votes.votes)
        if(user_vote){
           res.send('you Already voted')
        }else{
            const new_votes = await contestModel.findByIdAndUpdate(id , {votes : n+1})
            const user = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {
                voted : true
            })
            res.send('voted successfully')
        }
        }
  

    async participate_get(req ,res) {
        res.render('participate')
    }

  async participate_post (req, res)  {
    const user  = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {
        name : req.body.name,
        username : req.body.username,
        image : req.file.path,
        isParticipant : true
    })
     if(user){
         res.send('particapted successfully')
     }
    };
    async  logout(req ,res) {
        res.clearCookie('jwt_Token')
        res.redirect('/user/login')
    }
    
}


export default users