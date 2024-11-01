import mongoose from "mongoose"

const DiscordSchema = new mongoose.Schema({
  utilisateur: {  
      type: String,
      required: true,
      unique: true,
      trim: true  // Pour enlever les espaces inutiles
  },
  discordId: {
      type: String,
      required: true,
      unique : true
  },
  email: {
    type: String,
    required: true,
    unique : true
}
});
  export const DiscordUser = mongoose.model('DiscordUser', DiscordSchema);