fetch('http://localhost:3000/api/user/profile', {
  headers: {
    'Authorization': 'Bearer test-token' // The token doesn't matter, we just want to see if it responds fast with 401 or hangs
  }
}).then(res => res.json()).then(console.log).catch(console.error);
