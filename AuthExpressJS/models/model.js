import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  utilisateur: {  
      type: String,
      required: true,
      unique: true,
      trim: true  // Pour enlever les espaces inutiles
  },
  motdepasse: {
      type: String,
      required: true
  }
});
  export const Utilisateur = mongoose.model('UsersTest', userSchema);