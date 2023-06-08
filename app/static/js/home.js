// Get the form for submitting messages
var socket = io();
var messageform = document.getElementById("messageform");
var nav_friends_link = document.getElementById("nav_friends_link")
var all_group_buttons = document.getElementsByName("group_button")
var messages = document.getElementById("messages")
var toast = document.getElementById("message_toast")
const message_toast = bootstrap.Toast.getOrCreateInstance(toast)

var memberlist = []

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
            // console.log(responseData)
            document.getElementById("chat_name").innerHTML = responseData["title"];
            messages.innerHTML = ""
            document.getElementById("member_tab").innerHTML = "";
            for (let i = 0; i < responseData['username'].length; i++) {
                // console.log(responseData);
                message = document.createElement("div");
                label = document.createElement("div");//div with pfp, username, time
                label.style = "display: flex";
                img = document.createElement("img");
                img.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
                img.className = "rounded-circle";
                img.style.height = "30px";
                img.style.width = "30px";
                message.innerHTML = responseData['message'][i];
                message.style = "margin-bottom: 20px";

                label.appendChild(img);
                label.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;' + "<b>" + responseData['username'][i] + "</b>" + '&nbsp;&nbsp;&nbsp;&nbsp;' + responseData['time'][i];
                messages.appendChild(label);
                messages.appendChild(message);
                messages.scrollTop = messages.scrollHeight;
            }
            for (let i = 0; i < responseData["group_id"].length; i++) {
                // console.log(responseData["group_id"][i]);
                member = document.getElementById("member_tab");
                newButton = document.createElement("div");
                newButton.type = "button";
                newButton.classList.add("btn");
                newButton.style = "width: 30vh; text-align: left";
                newButton.setAttribute('name', 'memlist');
                label = document.createElement("div");//div with pfp, username
                label.style = "display: flex";
                img = document.createElement("img");
                img.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
                img.className = "rounded-circle";
                img.style.height = "30px";
                img.style.width = "30px";
                member.style = "margin-bottom: 20px";

                label.appendChild(img);
                label.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;' + responseData["group_id"][i];
                memberlist.push(responseData["group_id"][i])
                label.style = "margin-bottom: 5px";
                newButton.appendChild(label);
                member.appendChild(newButton);
                // console.log(member);
                member.scrollTop = member.scrollHeight;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error('Error:', error);
        });
}

var clear_ping = function (group_id) {
    ping_bubble = document.getElementById("ping_bubble" + group_id)
    ping_bubble.innerHTML = 0
    if (ping_bubble.style.visibility == "visible") {
        ping_bubble.style.visibility = "hidden"
    }
}

// We need a default group
if (all_group_buttons.length != 0) {
    selected_group = all_group_buttons[0]
    all_group_buttons[0].style.backgroundColor = "red"
    socket.emit("select_group", all_group_buttons[0].id)
    getMessage(0);
}

// Changes color of group buttons when clicked 
// And sets the room of the user to that group in Websockets
console.log(all_group_buttons)
for (let x = 0; x < all_group_buttons.length; x++) {
    all_group_buttons[x].addEventListener('click', (e) => {
        socket.emit("select_group", all_group_buttons[x].id)
        selected_group.style.backgroundColor = "#DEF2F1"
        all_group_buttons[x].style.backgroundColor = "red"
        selected_group = all_group_buttons[x]
        //messages.innerHTML = "";
        getMessage(x);
        clear_ping(all_group_buttons[x].id);
    })
}

var memlist = document.getElementsByName("memlist");

for (let x = 0; x < memlist.length; x++) {
    memlist[x].addEventListener('click', (e) => {
        console.log(memberlist)
    })
}


// info is: [sender, message]
socket.on('message', function (info) {
    //console.log(info);
    message = document.createElement("div");
    label = document.createElement("div");//div with pfp, username, time
    label.style = "display: flex";
    img = document.createElement("img");
    img.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
    img.className = "rounded-circle";
    img.style.height = "30px";
    img.style.width = "30px";
    message.innerHTML = info[1];
    message.style = "margin-bottom: 20px";

    label.appendChild(img);
    label.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;' + "<b>" + info[0] + "</b>" + '&nbsp;&nbsp;&nbsp;&nbsp;' + info[2];
    messages.appendChild(label);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    //document.getElementById("messages").innerHTML += info[0] + ": " + info[1] + "<br>";
});

// info: [group_id, user, message, string_time, group_image]
socket.on('ping', function (info) {
    ping_bubble = document.getElementById("ping_bubble" + info[0])
    ping_number = ping_bubble.innerHTML
    if (ping_number == 0) {
        ping_bubble.style.visibility = "visible"
    }
    ping_bubble.innerHTML = parseInt(ping_bubble.innerHTML) + 1
    // show toast
    document.getElementById("toast_name").innerHTML = info[1]
    document.getElementById("toast-message").innerHTML = info[2]
    document.getElementById("toast-time").innerHTML = info[3]
    document.getElementById("toast_pfp").innerHTML = info[4]
    message_toast.show()
});

socket.on('clicked_group', function (info) {
    console.log(info);
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
    //messages.scrollTop = messages.scrollHeight;
})

//notes for future redesign: we don't need to wait for the request to be completed before showing the message?
var ajaxMessage = function (str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        // console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            // console.log(response);
        }
    }
    xhttp.open("POST", "/homeajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var postVars = "messageText=" + str + "&group_id=" + selected_group.id;
    // console.log(postVars);
    xhttp.send(postVars);
    var textField = document.getElementById("messageinput");
    // EMITTING HERE:
    socket.emit("message", textField.value);
    textField.value = "";
}
