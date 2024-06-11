const mysql = require("mysql");

const connection = mysql.createPool({
    'connectionLimit':100,
    'host':'localhost',
    'user':'root',
    'password':'',
    'database':'VIDEO_STREAMING'
})

function connect(){
    return new Promise((resolve,reject)=>{
        connection.getConnection(function(err,connection){
            if(err){
                reject({
                 status:false,
                 error:err.stack
                })
             }
             else{
                 resolve({
                     status:true,
                     connection:connection
                    })
             }
        })
    })
}
module.exports={connect}