import mongoose from "mongoose"

export default async function MongoConnexion () {
   await mongoose.connect(process.env.MONGODB_URI)
   console.log('Connecté à MongoDB')
  
}
