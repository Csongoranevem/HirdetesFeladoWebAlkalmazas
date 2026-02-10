require('dotenv').config();

module.exports={
    host:process.env.DBHOST,
    port:process.env.DBPORT,
    user:process.env.DBUSER,
    pass:process.env.DBPASS,
    database:process.env.DBNAME,
    dialect:'mysql',
    logging:console.log
}