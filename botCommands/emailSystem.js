const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://marin:marin@emailsystem.eugp1f1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);


async function getPasswordByEmail(email) {
    await client.connect();
    const db = client.db("emails");
    const collection = db.collection("emailsystem");
    const user = await collection.findOne({ email });
if (user) {
    return user.password;
} else {
    return null;
}
}

module.exports = { getPasswordByEmail };


    
