const axios = require('axios');
const fs = require('fs');

const formData = new FormData();
formData.append('image', fs.createReadStream('example.jpeg')); // Replace 'example.jpeg' with your image file path

axios.post('https://vectorizer.ai/api/v1/vectorize', formData, {
  auth: {
    username: 'xyz123',
    password: '[secret]'
  },
  responseType: 'arraybuffer' // Set response type to arraybuffer for binary data
})
.then(response => {
  // Save result
  fs.writeFileSync("result.svg", Buffer.from(response.data, 'binary'));
})
.catch(error => {
  console.error('Request failed:', error);
});
