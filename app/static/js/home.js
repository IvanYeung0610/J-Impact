// Get the form for submitting messages
var socket = io();
var messageform = document.getElementById("messageform");
var nav_friends_link = document.getElementById("nav_friends_link")
var all_group_buttons = document.getElementsByName("group_button")

// We need a default group
if (all_group_buttons.length != 0) {
    selected_group = all_group_buttons[0]
    all_group_buttons[0].style.backgroundColor = "red"
    socket.emit("select_group", all_group_buttons[0].id)
}

//get messages from db
var getMessage = function (x) {
    // console.log(typeof JSON.stringify(all_group_buttons[x].id))
    // console.log(typeof JSON.stringify(all_group_buttons[x].id))
    fetch('/messagesajax', {
        method: 'POST',
        body: "group_id=" + all_group_buttons[x].id,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Set the content type to indicate a plain text string
            'Accept': 'application/json' // Set the Accept header to indicate acceptance of JSON response
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(responseData => {
            // Handle the response from the Flask route
            console.log(JSON.stringify(responseData));
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error('Error:', error);
        });
}

// Changes color of group buttons when clicked 
// And sets the room of the user to that group in Websockets
for (let x = 0; x < all_group_buttons.length; x++) {
    all_group_buttons[x].addEventListener('click', (e) => {
        socket.emit("select_group", all_group_buttons[x].id)
        selected_group.style.backgroundColor = "#DEF2F1"
        all_group_buttons[x].style.backgroundColor = "red"
        selected_group = all_group_buttons[x]
        //messages.innerHTML = "";
        getMessage(x);
    })
}


// info is: [sender, message]
socket.on('message', function (info) {
    //console.log(info);
    document.getElementById("messages").innerHTML += info[0] + ": " + info[1] + "<br>";
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
    var textField = document.getElementById("messageinput");
    socket.emit("message", textField.value);
    textField.value = "";
})

//notes for future redesign: we don't need to wait for the request to be completed before showing the message?
// var ajaxMessage = function (str) {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         // console.log(this.readyState);
//         if (this.readyState == 4 && this.status == 200) {
//             var response = JSON.parse(xhttp.responseText);
//             // COMMENT THIS OUT FOR NOW CAUSE IT'S GONNA PUT IT ON THERE TWICE
//             // document.getElementById("messages").innerHTML += response.user + ": " + response.value + "<br>";
//         }
//     }
//     xhttp.open("POST", "/homeajax");
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     var postVars = "messageText=" + str + "&group_id=" + selected_group.id;
//     // console.log(postVars);
//     xhttp.send(postVars);
//     var textField = document.getElementById("messageinput");
//     // EMITTING HERE:
//     socket.emit("message", textField.value);
//     textField.value = "";
// }