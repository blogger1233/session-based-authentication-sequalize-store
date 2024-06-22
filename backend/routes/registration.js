const express = require("express");
const router = express.Router();
const { connect } = require("./database");
const { v5: uuidv5 } = require("uuid");
const { v4: uuidv4 } = require("uuid")
const { transporter } = require("./mail")
require("dotenv").config();

router.use(express.json());

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function validatePassword(password) {
    // Check if password is a string
    if (typeof password !== 'string') {
        return false;
    }

    return password.length >= 5;
}

function check_matching(password, confirm_password) {
    return confirm_password === password;
}

router.post("/", (req, res) => {
    const { name, age, email, password, confirm_password } = req.body;
    if (!validateEmail(email)) {
        return res.status(404).json({ error: "Invalid email" });
    }

    if (!validatePassword(password)) {
        return res.status(404).json({ error: "Invalid password" });
    }

    if (!check_matching(password, confirm_password)) {
        return res.status(404).json({ error: "Passwords do not match" });
    }

    const user_id = uuidv5(email, process.env.NAME_SPACE);

    connect()
        .then((success) => {
            const connection = success.connection;

            // Check if name exists
            connection.query({
                sql: "SELECT * FROM USER WHERE name = ?",
                timeout: 40000,
                values: [name]
            }, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Oops! Something went wrong 1" });
                }
                if (results.length > 0) {
                    return res.status(404).json({ error: "Username already exists" });
                }

                // Check if email exists
                connection.query({
                    sql: "SELECT * FROM CREDENTIALS WHERE email = ?",
                    timeout: 40000,
                    values: [email]
                }, (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: "Oops! Something went wrong 2" });
                    }
                    if (results.length > 0) {
                        return res.status(404).json({ error: "Email already exists" });
                    }

                    // Insert new user
                    connection.query({
                        sql: "INSERT INTO USER(user_id, age, name) VALUES (?, ?, ?)",
                        timeout: 40000,
                        values: [user_id, age, name]
                    }, (err) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: "Oops! Something went wrong 3" });
                        }

                        connection.query({
                            sql: "INSERT INTO CREDENTIALS VALUES (?, ?, ? , ?)",
                            timeout: 40000,
                            values: [user_id, password, email, false]
                        }, (err) => {
                            if (err) {
                                return res.status(500).json({ error: "Oops! Something went wrong 4" });
                            }

                            return res.status(200).json({ message: "User registered successfully" });
                        });
                    });
                });
            });
        }, (error) => {
            return res.status(404).json({ error: "Error while connecting to the database" });
        });
});

router.post("/sendmail", async function (req,res) {
    var { email } = req.body;
    if(!validateEmail(email)){
        return res.status(404).json({error:"Invalid email"})
    }
    connect()
    .then((success) => {
            const connection = success.connection;
            //check email registered
            connection.query({
                sql:"SELECT * FROM CREDENTIALS where email=?",
                timeout:40000,
                values:[email]
            }
            ,function(err,result){
                if(err){
                   return res.status(404).json({error:"oops something went wrong 4"})
                }
                else{
                   if(result.length>0){
                    var user_id = result[0]['user_id']
                    if(!result[0].VERIFIED){
                        connection.query({
                            sql:"SELECT * FROM SENT_MAIL WHERE user_id=? ORDER BY sent_time DESC",
                            timeout:40000,
                            values:[result[0]["user_id"]]
                        },
                    function(err,result){
                        
                        if(err){
                            return res.status(400),json({error:"Oops something went wrong 5"})
                        }
                        else{
                            if(result.length>0){
                                    const time = result[0].sent_time
                                    
                                    if(new Date()-time>=120000){
                                        const code = Math.floor(Math.random()*(999999-100000))+100000;
                                        const id = uuidv4()
                                      connection.query({
                                                sql:"INSERT INTO SENT_MAIL VALUES(?,?,?,?)",
                                                timeout:40000,
                                                values:[id,user_id,new Date(),code]
                                        },function(err,result){
                                            if(err){
                                                console.log(err)
                                                return res.status(500).json({error:"Oops something went wrong 6"})
                                            }
                                            else{
                                                transporter.sendMail({
                                                    from: "Streaming view <444dhruv@gmail.com>",
                                                    to: email,
                                                    subject: "Email verification",
                                                    html: `<span>please verify your email otp:<b>${code}</b></span>`
                                                }).then((info) => {
                                                    return res.status(200).json({ message: "email sent success!", info: info});
                                                })
                                                
                                            }
                                        })
                                    }
                                    else{
                                        res.status(200).json({message:"wait"})
                                    }
                            }
                            else{
                               
                                const code = Math.floor(Math.random()*(999999-100000))+100000;
                                const id = uuidv4()

                                connection.query({
                                        sql:"INSERT INTO SENT_MAIL VALUES(?,?,?,?)",
                                        timeout:40000,
                                        values:[id,user_id,new Date(),code]
                                },function(err,result){
                                    if(err){
                                        console.log(err)
                                        return res.status(500).json({error:"Oops something went wrong 6"})
                                    }
                                    else{
                                        transporter.sendMail({
                                            from: "Streaming view <444dhruv@gmail.com>",
                                            to: email,
                                            subject: "Email verification",
                                            html: `<span>please verify your email otp:<b>${code}</b></span>`
                                        }).then((info) => {
                                            return res.status(200).json({ message: "email sent success!", info: info });
                                        })
                                        
                                    }
                                })
                            }
                        }
                    })  
                    }
                   }    
                   else{
                    return res.status(404).json({error:"404 FORBIDDEN"})
                   }
                }
            })
            
        },
            (error) => {
                return res.status(404).json({ error: "Error while connecting to the database" });
            })
})

router.post("/mailverify",(req,res)=>{
    const email = req.body.email;
    const code = req.body.code;
    console.log(email,code)
    connect()
    .then((success)=>{
        const connection = success.connection;
        connection.query({
            sql:"SELECT * FROM CREDENTIALS WHERE email=?",
            timeout:40000,
            values:[email]
        },
        function(error,result){
            if(error){
                return res.status(500).json({error:'Oops something went wrong 7'})
            }
            if(result.length>0){
                const user_id = result[0].user_id;
                connection.query({
                    sql:"SELECT * FROM SENT_MAIL where user_id=? ORDER BY sent_time desc",
                    timeout:40000,
                    values:[user_id]
                }
                ,function(err,result){
                    if(err){
                        return res.status(500).json({error:'Oops something went wrong 8'})
                    }
                    else{
                        const {OTP} = result[0];
                        console.log(OTP)
                        if(OTP==code){
                            connection.query({
                                sql:"UPDATE CREDENTIALS set VERIFIED=true "
                            },function(error,result){
                                if(error){
                                    return res.status(500).json({error:'Oops something went wrong 8'})
                                }
                                else{
                                    return res.status(200).json({message:"user registered successfully"})
                                }
                            })
                        }else{
                            return res.status(404).json({error:"incorrect OTP"})
                        }
                    }
                }    
            )
            }
            else{
                return res.status(404).json({error:"FORBIDDEN 404"})
            }
        })
    })
})

module.exports = router;
