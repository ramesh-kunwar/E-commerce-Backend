import mongoose from "mongoose";
import app from "./app"

import config from "./config/index";



// to connect to a database 
// create a method
// run a method


//js IIFE
// (async ()=> {})()
// connecting to database 
(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB CONNECTED ");


        // app.on() is an express event
        app.on("error", (err) => {
            console.log("ERROR ", err);
            throw err;
        })

        const onListening = () => {
            console.log(`Listening at PORT ${config.PORT}`);
        }

        // Listening to a PORT
        app.listen(config.PORT, onListening)

    } catch (error) {
        console.log("ERROR ", error);
        throw error;
    }
})()