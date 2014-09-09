/**
 *
 * Model User
 * This model defines the schema of the User Domain.
 *
 * This collection is intended to store User Information .
 * */

/*
 * Define the Schema of the collection (MongooseJS schema definition)
 * */
exports.schema = {
    username: String,
    accessToken: String,
    twitterId: String,
    email:{
      emailId:String,
        validationCode:String,
        email_valid:Boolean
    },
    profilePicUrl: String,
    profileData: {
        Birthday: String,
        Gender: String,
        Mobile: Number,
        Address: {
            Hometown: String,
            City: String,
            State: String,
            Country: String,
            pin: Number
        }
    },
    favouriteTweets:[]
};
