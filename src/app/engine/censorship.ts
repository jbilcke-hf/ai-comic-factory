

// unfortunately due to abuse by some users, I have to add this NSFW filter
const secretSalt = `${process.env.SECRET_CENSORSHIP_KEY || ""}`

// TODO the censorship is not implement yet actually