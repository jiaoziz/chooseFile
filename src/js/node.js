// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const port = 3000;
app.set
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'), { once: true });

ac.abort();

console.log(ac.signal.aborted);  // 打印 true

