This is basically a simplified reimplementation of JavaScript’s built-in Promise, showing how .then() and .catch() might work internally.
You’ve probably seen something like this before:

fetch('/user/1')
  .then((user) => { 
    /* Do something with user after the API returns */ 
  })

The block of code in the .then() waits until it receives the response from the server before it executes anything. This is called a Promise. But don’t let the fancy name or the fact that there is asynchronous code intimidate you — a Promise is just a plain old JavaScript object with special methods that allow you to execute code synchronously (it will do things in order even though there is a delay).

typeof new Promise((resolve, reject) => {}) === 'object' // true

A Promise is just an object. To be able to wait on the server and execute the code in the .then() chain after the response, you MUST return a Promise object. This is not something functions get out of the box. Behind the scenes, the fetch function is doing something like this.

const fetch = function(url) {
  return new Promise((resolve, reject) => {
    request((error, apiResponse) => {
      if (error) {
        reject(error)
      }
      resolve(apiResponse)
    })
  })
}

The fetch() function makes an http request to the server, but the client doesn’t know when the server will send back the results. So JavaScript begins executing other unrelated code while waiting on the server to return with the response. Once the client receives the response, it initiates the execution of the code in the .then() statements by calling resolve(apiResponse).
