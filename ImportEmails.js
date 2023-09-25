const fs = require('fs');
const { MongoClient } = require('mongodb');

// Define the paths to your input .txt file and the output JSON file
const txtFilePath = 'docs/input.txt'; // Replace with the path to your .txt file

// MongoDB connection URI
const mongoUri = 'mongodb+srv://marin:marin@emailsystem.eugp1f1.mongodb.net/?retryWrites=true&w=majority';

// Initialize a MongoClient
const client = new MongoClient(mongoUri);

// Read the contents of the .txt file
fs.readFile(txtFilePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the .txt file:', err);
    return;
  }

  // Split the contents into lines
  const lines = data.split('\n');

  // Initialize an array to store email and password pairs
  const emailPasswordPairs = [];

  // Process each line to extract email and password
  for (const line of lines) {
    const [email, password, recovery] = line.split(':');
    if (email && password) {
      // Convert email to lowercase and push email and password as an object to the array
      emailPasswordPairs.push({ email: email.toLowerCase(), password });
    }
  }

  // Connect to MongoDB
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Get a reference to the database and collection
    const db = client.db('emails');
    const collection = db.collection('emailsystem');

    // Insert the email and password pairs into the collection
    const result = await collection.insertMany(emailPasswordPairs);
    console.log(`Inserted ${result.insertedCount} documents into the collection`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
  }


});
