import mongoose from 'mongoose'
import databaseConfig from '../config/database.config.js'

const setup = function() {
    mongoose.connect(`mongodb://${databaseConfig.DB_HOST}:${databaseConfig.DB_PORT}/${databaseConfig.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Database connected'))
}

export default { setup }