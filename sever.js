import express from 'express'
import ejs from 'ejs'
import userRoute from './routes/user_route.js'
import  userModel from './models/userModel.js';
import apps from './controllers/appController.js'
import db from './db/db.js'
const app = express()
const port = process.env.port || 8000
app.use('/user' , userRoute)
app.set('view engine' , 'ejs')
app.use(express.json())
const home = new apps()
app.get('/' , home.home)
app.get('/:username' , home.username_get)

app.listen(port , ()=> {
    console.log('server is running on 8000')
})