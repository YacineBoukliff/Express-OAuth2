import mongoose from "mongoose"

const DiscordSchema = new mongoose.Schema({
  username: {  
      type: String,
      required: true,
      unique: true,
      trim: true  // Pour enlever les espaces inutiles
  },
  discordId: {
      type: String,
      required: true,
      unique : true
  }
});
  export const DiscordUser = mongoose.model('DiscordUser', DiscordSchema);