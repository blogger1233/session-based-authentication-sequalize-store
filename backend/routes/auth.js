const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { connect } = require("./database"); // Assuming you have a database connection function

const router = express.Router();
router.use(express.json());

// Set up Sequelize instance
const sequelize = new Sequelize('VIDEO_STREAMING', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define a session store using Sequelize
const session_store = new SequelizeStore({
    db: sequelize,
});

// Read private key for session secret
const myKey = fs.readFileSync(path.join(__dirname, "./private_key.pem"), "utf-8");

// Configure session middleware
router.use(session({
    secret: myKey,
    resave: false,
    saveUninitialized: false,
    store: session_store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// Sync the session store
session_store.sync();

// Email validation function
function check(user) {
    const email_pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email_pattern.test(user);
}

// Login route
router.post("/", (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    const is_email = check(user);

    if (is_email) {
        connect()
            .then((success) => {
                const connection = success.connection;
                connection.query({
                    sql: "SELECT * FROM CREDENTIALS WHERE email=?",
                    timeout: 40000,
                    values: [user]
                }, function (error, result) {
                    if (error) {
                        return res.status(400).json({ error: "something went wrong 24" });
                    } else {
                        if (result.length > 0) {
                            if (result[0].password === password) {
                                req.session.userId = result[0].user_id;
                               return res.status(200).json({ message: "login successful", session_id: req.sessionID });
                            } else {
                                return res.status(400).json({ error: "incorrect password" });
                            }
                        } else {
                            return res.status(400).json({ error: "email does not exists" });
                        }
                    }
                });
            })
            .catch((err) => {
                console.error('Database connection failed:', err);
                return res.status(500).json({ error: "Database connection failed" });
            });
    } else {
        connect()
        .then((success)=>{
            const connection = success.connection;

            connection.query({
                sql:"SELECT * FROM USER WHERE name=?",
                values:[user]
            },function(error,result){
                if(error){
                    return res.status(500).json({error:'Error while retreving user data'})
                }
                else{
                    if(result.length>0){
                        const user_id = result[0].user_id;
                        connection.query({
                            sql:"SELECT * FROM CREDENTIALS where user_id=?",
                            values:[user_id]
                        },function(error,result){
                            if(error){
                                return res.status(500).json({error:'Error while retreving user data'})
                            }
                            else{
                                if(result.length>0){
                                    if(result[0].password===password){
                                        req.session.userId = result[0].user_id;
                                        return res.status(200).json({ message: "login successful", session_id: req.sessionID });
                                    }
                                }
                            }
                        })
                    }
                    else{
                        return res.status(404).json({error:"username does not exists"})
                    }
                }
            })
        })
    }
});

module.exports = router;
