import {db} from "../database/database.connection.js";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
    const { name, email, password} = req.body;

    const hash =  bycript.hashSync(password,10)
     
    try{
        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hash])
        res.status(201).send("User created")
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
   
}
export async function signIn(req, res) {
    const {user} = res.locals
    try{
    const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET)

    await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [user.id, token])

    res.status(200).send({token})
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }

}

export async function getAllUsers(req, res) {
    try{
    const users = await db.query(`SELECT * FROM users`)
    res.status(200).send(users)
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
    
}