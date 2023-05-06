 require('dotenv').config({path: '.env'});

const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set("strictQuery", false); 
        mongoose.connect("mongodb+srv://hikmatullahcps:o24N2WWAOtIEdAWy@cluster0.cjuwicv.mongodb.net/Copilot?retryWrites=true&w=majority", { useNewUrlParser: true,
        useUnifiedTopology: true,
        }) 
    const db = mongoose.connection
    db.on('error', (error) => console.error("error"))
    db.once('open', () => console.log('Connected to Database'))
    
    app.use(express.json())
    var cors= require("cors") 
    
    const corsOptions = {
          origin: '*',
          allowedHeaders: ['Content-Type'],
      };
    
    app.use(cors(corsOptions));

    const subscribersRouter = require('./routes/Admin')
    const customerApis = require('./routes/customerApis')
    app.use('/', subscribersRouter,)
    app.use('/', customerApis,)
       
    const apiRoutes = require('./routes/api');
    app.use('/api', apiRoutes);
    
    const docsRoutes = require('./routes/docs');
    app.use(docsRoutes);
    app.listen(process.env.PORT || 3000, () => console.log('Server Started'))
