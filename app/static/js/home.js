// Get the form for submitting messages
var messageform = document.getElementById("messageform");
var socket = io();

socket.on('message', function (message) {
    console.log(message);
});

messageform.addEventListener('submit', (e) => {
    // preventDefault stops the page from reloading
    e.preventDefault();
    socket.send(document.getElementById("messageinput").value);
})

var ajaxMessage = function(str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            document.getElementById("messages").innerHTML += response.value + "<br>";
        }
    }
    xhttp.open("POST", "/homeajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var postVars = "messageText=" + str;
    console.log(postVars);
    xhttp.send(postVars);
}


// fetch('/', {
//     Method: 'POST',
//     Headers: {
//         Accept: 'application.json',
//         'Content-Type': 'application/json'
//     },
//     Body: body,
//     Cache: 'default'
// })