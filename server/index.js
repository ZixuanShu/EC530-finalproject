const mysql = require('mysql')
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.js");
const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"Maxshu12",
    database:"sys"
})

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/Patients', (req, res) => {
    db.query("SELECT * FROM user_data WHERE isdoctor = 'Patient'", (err,result)=>{
        if(err){
            console.log(err)
        }
        res.status(200).json({result})
    })
});

app.get('/all', (req, res) => {
    db.query("SELECT * FROM user_data", (err,result)=>{
        if(err){
            console.log(err)
        }
        res.status(200).json({result})
    })
});

app.put('/update', (req,res)=>{
    const {age, weight, height, bloodpressure, userid} = req.body;
    db.query("UPDATE user_data SET Age = ?, Weight = ?, Height = ?, Blood_pressure= ? WHERE user_id = ? ", [age, weight, height, bloodpressure, userid], (err,result) => {
        if (err){
            console.log(err);
        } else{
            res.send(result)
        }
    })
}
)

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));