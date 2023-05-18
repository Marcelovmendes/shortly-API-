import db from "../database/database.connection.js";

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
export async function sigIn(req, res) {
    const { email, password } = req.body;
    try{
    await db.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [email, password])
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const token = jwt.sign({userId:user.rows[0].id}, process.env.JWT_SECRET)
    res.status(200).send({token})
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }

}