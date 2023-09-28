const fs = require('fs');
const path = require('path');

// Define the folder path where your .txt files are located
const folderPath = '/Users/marin/Documents/GitHub/tdiscordbot/EmailsDatabase/emails';

// Define the output file where the combined content will be saved
const outputFile = './combined_emails.txt';

// Initialize a Set to store unique and non-empty file contents
const uniqueNonEmptyContents = new Set();

// Read all files in the folder
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  // Filter only .txt files
  const txtFiles = files.filter((file) => path.extname(file).toLowerCase() === '.txt');

  // Loop through each .txt file and append its content to uniqueNonEmptyContents
  txtFiles.forEach((txtFile) => {
    const filePath = path.join(folderPath, txtFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const nonEmptyLines = fileContent.split('\n').filter((line) => line.trim() !== '');
    uniqueNonEmptyContents.add(nonEmptyLines.join('\n'));
  });

  // Write the unique combined and non-empty content to the output file
  const combinedContent = Array.from(uniqueNonEmptyContents).join('\n');
  fs.writeFile(outputFile, combinedContent, (err) => {
    if (err) {
      console.error('Error writing to output file:', err);
    } else {
      console.log('Combination complete. Unique and non-empty content saved to', outputFile);
    }
  });
});
