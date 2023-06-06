// Get the form for submitting messages
var socket = io();
var messageform = document.getElementById("messageform");
var nav_friends_link = document.getElementById("nav_friends_link")

socket.on('message', function (message) {
    console.log(message);
});

// sets the users's current room to "all_friends_page" then sends them to the /friends route
nav_friends_link.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit("select_group", "all_friends_page")
    //  SENDS THE USER TO THE /friends page
    window.location.replace("/friends");
})

messageform.addEventListener('submit', (e) => {
    // preventDefault stops the page from reloading
    e.preventDefault();
    socket.send(document.getElementById("messageinput").value);
})

//notes for future redesign: we don't need to wait for the request to be completed before showing the message?
var ajaxMessage = function (str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            document.getElementById("messages").innerHTML += response.user + ": " + response.value + "<br>";
        }
    }
    xhttp.open("POST", "/homeajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var postVars = "messageText=" + str;
    console.log(postVars);
    xhttp.send(postVars);
    var textField = document.getElementById("messageinput");
    textField.value = "";
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