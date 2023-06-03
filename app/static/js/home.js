// Get the form for submitting messages
var messageform = document.getElementById("messageform")
var socket = io()

socket.on('message', function (message) {
    console.log(message)
});

messageform.addEventListener('submit', (e) => {
    // preventDefault stops the page from reloading
    e.preventDefault()
    socket.send(document.getElementById("messageinput").value)
})




// fetch('/', {
//     Method: 'POST',
//     Headers: {
//         Accept: 'application.json',
//         'Content-Type': 'application/json'
//     },
//     Body: body,
//     Cache: 'default'
// })