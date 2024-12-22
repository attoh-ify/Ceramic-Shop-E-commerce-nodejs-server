const crypto = require('crypto');

const generateTransactionRef = () => {
    // Generate a UUID-like random string using crypto
    const randomPart = crypto.randomBytes(8).toString('hex'); // 16 characters
    // Get a timestamp in milliseconds
    const timestampPart = Date.now().toString(); // 13 characters
    // Combine the random part with the timestamp
    const transactionRef = `TX-${timestampPart}-${randomPart}`;
    return transactionRef; // Example: "TX-1697935734000-1f4d3c9e5b7a8c13"
};