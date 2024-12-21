// // Using built-in fetch (Node.js 18+)
// const axios = require('axios'); // Use this for older Node.js versions

// const fetchExternalData = async () => {
//     try {
//         const response = await fetch('https://api.example.com/data', {
//             method: 'GET', // or 'POST', 'PUT', etc.
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer YOUR_TOKEN', // Add if required
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.error('Error fetching data:', error.message);
//     }
// };

// fetchExternalData();
