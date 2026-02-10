
const app = require('./config/app');
const{sequelize}=require('./models/index')
const port = process.env.PORT;

(async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        sequelize.sync({alter:true});

        app.listen(port,()=>{
        console.log(`Server is listening on port ${port}...`)
        })

    } catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
    }

})()
