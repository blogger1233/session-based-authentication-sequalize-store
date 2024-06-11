const express = require("express");
const router = express.Router();
const { connect } = require("./database");
const { v5: uuidv5 } = require("uuid");
require("dotenv").config();
router.use(express.json())
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
                        sql: "INSERT INTO USER(user_id,age,name) VALUE (?, ?, 2002-09-21)",
                        timeout: 40000,
                        values: [user_id, age, name]
                    }, (err) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: "Oops! Something went wrong 3" });
                        }

                        connection.query({
                            sql: "INSERT INTO CREDENTIALS VALUES (?, ?, ?)",
                            timeout: 40000,
                            values: [user_id, password, email]
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

module.exports = router;
