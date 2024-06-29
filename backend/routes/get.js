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
        maxAge: 1000 * 60 * 60 * 24 // Session expires in 1 day (milliseconds)
    }
}));

// Sync the session store with the database
session_store.sync();

// Route to verify session ID
router.post("/", function(req, res) {
    const session_id = req.headers.authorization.split(' ')[1];
    
    // Check if session ID exists in the database
    session_store.get(session_id, (err, session) => {
        if (err || !session || !session.userId) {
            return res.status(401).json({ error: "Unauthorized user" });
        }
        
        // Session ID is valid, continue with your logic
        return res.status(200).json({ message: session.userId });
    });
});

module.exports = router;
