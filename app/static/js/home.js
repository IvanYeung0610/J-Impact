// Get the form for submitting messages
var socket = io();
var messageform = document.getElementById("messageform");
var nav_friends_link = document.getElementById("nav_friends_link")
var all_group_buttons = document.getElementsByName("group_button")
var messages = document.getElementById("messages")
var toast = document.getElementById("message_toast")
const message_toast = bootstrap.Toast.getOrCreateInstance(toast)
var emoji_dropdown = document.getElementById("emoji_dropdown_button")


var memberlist = []

emoji_dropdown.addEventListener('click', (e) => {
    e.preventDefault()
})

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
            if (responseData["member_names"].length > 2) {
                document.getElementById("dropdown-menu-add").style.visibility = "visible";
                document.getElementById("dropdown-button-add").style.visibility = "visible";
            } else {
                document.getElementById("dropdown-menu-add").style.visibility = "hidden";
                document.getElementById("dropdown-button-add").style.visibility = "hidden";
            }
            messages.innerHTML = ""
            document.getElementById("member_tab").innerHTML = "";
            for (let i = 0; i < responseData['username'].length; i++) {
                console.log("first response data: ", responseData);
                message = document.createElement("div");
                label = document.createElement("div");//div with pfp, username, time
                label.style = "display: flex";
                img = document.createElement("img");
                img.src = responseData["pfp"][i];
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
            for (let i = 0; i < responseData["member_names"].length; i++) {
                //console.log(responseData["member_names"][i]);
                member = document.getElementById("member_tab");
                newButton = document.createElement("div");
                newButton.type = "button";
                newButton.classList.add("btn");
                newButton.style = "width: 30vh; text-align: left";
                newButton.setAttribute('name', 'memlist');
                label = document.createElement("div");//div with pfp, username
                label.style = "display: flex";
                img = document.createElement("img");
                img.src = responseData["member_pfps"][i];
                img.style.height = "30px";
                img.style.width = "30px";
                member.style = "margin-bottom: 20px";

                label.appendChild(img);
                label.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;' + responseData["member_names"][i];
                memberlist.push(responseData["member_names"][i])
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

var toggleDropdownCreate = function () {
var toggleDropdownCreate = function () {
    var dropdownMenu = document.getElementById('dropdown-menu-create');
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.maxHeight = '400px';
        dropdownMenu.style.overflowY = 'auto';
        dropdownMenu.style.marginLeft = '10px';
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.maxHeight = '400px';
        dropdownMenu.style.overflowY = 'auto';
        dropdownMenu.style.marginLeft = '10px';
    } else {
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.display = 'none';
    }
}
}

var chatList = document.getElementsByName("group_button");
for (let i = 0; i < chatList.length; i++) {
    chatList[i].addEventListener("click", function () {
        var chats = document.getElementsByName("group_button");
        for (let i = 0; i < chats.length; i++) {
            chats[i].removeAttribute("selected");
        }
        this.setAttribute("selected", "");
    })
}

var createDropdownAdd = function (element) {
    addFriendsCheckboxes = document.getElementById("friends-checkboxes-add");
    addFriendsCheckboxes.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response);
            var addable = response.addable;
            for (let i = 0; i < addable.length; i++) {
                let formCheck = document.createElement("div");
                formCheck.classList.add("form-check");
                let formInput = document.createElement("input");
                formInput.classList.add("form-check-input");
                formInput.type = "checkbox";
                formInput.id = addable[i];
                formInput.name = "addCheckbox";
                formInput.addEventListener("change", function () {
                    if (this.checked) {
                        this.setAttribute("checked", "");
                    } else {
                        this.removeAttribute("checked");
                    }
                })
                var formLabel = document.createElement("label");
                formLabel.classList.add("form-check-label");
                formLabel.for = "flexCheckDefault";
                var pfp = document.createElement("img");
                pfp.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
                pfp.classList.add("rounded-circle");
                pfp.style.width = "30px";
                pfp.style.height = "30px";
                pfp.style.marginRight = "3px";
                formLabel.appendChild(pfp);
                formLabel.innerHTML += addable[i];
                formCheck.appendChild(formInput);
                formCheck.appendChild(formLabel);
                addFriendsCheckboxes.appendChild(formCheck);
                // console.log(addFriendsCheckboxes);
            }
        }
    }
    xhr.open("POST", "addUserDropdown");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var groupID = element.getAttribute("id");
    var postVars = "groupID=" + groupID;
    xhr.send(postVars);
}

var toggleDropdownAdd = function () {
    var dropdownMenu = document.getElementById('dropdown-menu-add');
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.maxHeight = '400px';
        dropdownMenu.style.maxWidth = '300px';
        dropdownMenu.style.overflowY = 'auto';
        dropdownMenu.style.marginLeft = '47%';
        dropdownMenu.style.marginTop = '3%';
        //dropdownMenu.style.justifyContent = 'end';
    } else {
        dropdownMenu.style.display = 'none';
    }
}

var createGroup = function () {
    var groupName = document.getElementById('group-name').value;
    // Perform further actions with the group name
    for (let i = 0; i < people.length; i++) {
        if (people[i].checked) {
            usersAdded.push(people[i].id);
        }
    }
    if (usersAdded.length > 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                console.log(response);
                refreshPage();
            }
        }
        xhttp.open("POST", "add-users-to-group-ajax");
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        var group_buttons = document.getElementsByName("group_button");
        console.log(group_buttons);
        var groupID = 0;
        for (let i = 0; i < group_buttons.length; i++) {
            console.log(group_buttons[i].getAttribute("selected", "true"));
            if (group_buttons[i].getAttribute("selected", "true") == "") {
                groupID = group_buttons[i].id;
            }
        }

        var postVars = JSON.stringify({ "selected": usersAdded, "group_id": groupID });
        console.log(postVars);
        xhttp.send(postVars);
    } else {
        console.log("select at least 2 people, dummy");
    }
}

//test refresh page so that changes load
var refreshPage = function() {
    window.location.reload();
} 

var clear_ping = function (group_id) {
    ping_bubble = document.getElementById("ping_bubble" + group_id)
    ping_bubble.innerHTML = 0
    if (ping_bubble.style.visibility == "visible") {
        ping_bubble.style.visibility = "hidden"
    }
}
//eventlisteners for profile
var profileButton = function () {
    console.log(memberlist)
    setTimeout(function () {
        var memlist = document.getElementsByName("memlist");
        console.log(memlist)
        for (let x = 0; x < memlist.length; x++) {
            memlist[x].addEventListener('click', (e) => {
                e.preventDefault()
                window.location.href = '/profile/' + memberlist[x];
            })
        }
    }, 300); // Delay of .3 second
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
// console.log(all_group_buttons)
for (let x = 0; x < all_group_buttons.length; x++) {
    all_group_buttons[x].addEventListener('click', (e) => {
        socket.emit("select_group", all_group_buttons[x].id)
        selected_group.style.backgroundColor = "#DEF2F1"
        all_group_buttons[x].style.backgroundColor = "red"
        selected_group = all_group_buttons[x]
        //messages.innerHTML = "";
        memberlist = [];
        getMessage(x);
        profileButton();
        clear_ping(all_group_buttons[x].id);
    })
}

var memlist = document.getElementsByName("memlist");

for (let x = 0; x < memlist.length; x++) {
    memlist[x].addEventListener('click', (e) => {
        console.log(memberlist)
    })
}



var createGroupBar = function (str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            selectedUsers = response.users;
            document.getElementById("friends-checkboxes-create").innerHTML = "";
            var dropdownMenu = document.getElementById('friends-checkboxes-create');
            for (let i = 0; i < selectedUsers.length; i++) {
                select = document.createElement("div");
                select.classList.add("form-check");
                checkbox = document.createElement("input");
                checkbox.classList.add("form-check-input");
                checkbox.type = "checkbox";
                checkbox.id = selectedUsers[i][0];
                checkbox.name = "createCheckbox";
                checkbox.addEventListener("change", function () {
                    if (this.checked) {
                        this.setAttribute("checked", "");
                    } else {
                        this.removeAttribute("checked");
                    }
                })
                formLabel = document.createElement("label");
                formLabel.classList.add("form-check-label");
                formLabel.setAttribute("for", "flexCheckDefault");

                pfp = document.createElement("img");
                //the cloudinary image is massive, but this would work
                // pfp.src = selectedUsers[i][1];
                pfp.classList.add("rounded-circle");
                pfp.setAttribute("width", "30px");
                pfp.setAttribute("height", "30px");
                pfp.style = "margin-right: 3px;";
                pfp.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
                formLabel.appendChild(pfp);
                formLabel.innerHTML += selectedUsers[i][0];
                select.appendChild(checkbox);
                select.appendChild(formLabel);
                dropdownMenu.appendChild(select);
            }
        }
    }
    xhttp.open("POST", "create-group-search");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    postVars = "searchTerm=" + str;
    console.log(postVars);
    xhttp.send(postVars);
}

var setChecked = function (element) {
    if (element.checked) {
        element.setAttribute("checked", "checked");
    } else {
        element.removeAttribute("checked");
    }
    console.log(element);
}

var createGroup = function () {
    var people = document.getElementsByName("createCheckbox");
    var selected = [];
    // Perform further actions with the group name
    for (let i = 0; i < people.length; i++) {
        if (people[i].getAttribute("checked")) {
            selected.push(people[i].id);
        }
    }
    console.log(selected);
    if (selected.length >= 2 && document.getElementById("group-name").value != "") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                console.log(response);
                //not really sure what to put here
                img = document.createElement("img");
                img.src = image;
                img.setAttribute("width", "30px");
                img.setAttribute("height", "30px");
                img.style.marginRight = "3px";
                button = document.createElement("button");
                button.id = response.group_id;
                button.type = "button"
                button.classList.add("btn");
                button.name = "group_button";
                button.style.backgroundColor = "#DEF2F1";
                button.style.width = "100%";
                button.style.textAlight = "left";
                button.appendChild(img, name);
            }
        }
        xhttp.open("POST", "creating-group-ajax");
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        var name = document.getElementById("group-name").value;
        var image = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
        var postVars = JSON.stringify({ "selected": selected, "name": name, "image": image });
        console.log(postVars);
        xhttp.send(postVars);
    } else {
        console.log("select at least 2 people, dummy");
    }
}

//only reason why this is different is to account for removing members?
//also accesses different place
var addUserToGroupSearch = function (str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            selectedUsers = response.users;
            console.log(selectedUsers);
            document.getElementById("friends-checkboxes-add").innerHTML = "";
            var dropdownMenu = document.getElementById('friends-checkboxes-add');
            for (let i = 0; i < selectedUsers.length; i++) {
                select = document.createElement("div");
                select.classList.add("form-check");
                checkbox = document.createElement("input");
                checkbox.classList.add("form-check-input");
                checkbox.type = "checkbox";
                checkbox.id = selectedUsers[i][0];
                checkbox.addEventListener("change", function () {
                    if (this.checked) {
                        this.setAttribute("checked", "");
                    } else {
                        this.removeAttribute("checked");
                    }
                })
                formLabel = document.createElement("label");
                formLabel.classList.add("form-check-label");
                formLabel.setAttribute("for", "flexCheckDefault");
                pfp = document.createElement("img");
                //the cloudinary image is massive, but this would work
                // pfp.src = selectedUsers[i][1];
                pfp.classList.add("rounded-circle");
                pfp.setAttribute("width", "30px");
                pfp.setAttribute("height", "30px");
                pfp.style = "margin-right: 3px;";
                pfp.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg";
                formLabel.appendChild(pfp);
                formLabel.innerHTML += selectedUsers[i][0];
                select.appendChild(checkbox);
                select.appendChild(formLabel);
                dropdownMenu.appendChild(select);
                console.log(dropdownMenu);
            }
        }
    }
    xhttp.open("POST", "add-user-group-search");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    postVars = "searchTerm=" + str;
    xhttp.send(postVars);
}

// info is: [sender, message]
socket.on('message', function (info) {
    //console.log(info);
    message = document.createElement("div");
    label = document.createElement("div");//div with pfp, username, time
    label.style = "display: flex";
    img = document.createElement("img");
    img.src = info[3];
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
/*
var profile = function(x){
    console.log(memberlist[x])
    fetch('/profile', {
        method: 'POST',
        body: "username=" + memberlist[x],
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
        console.log(responseData)
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
    });
}
*/
profileButton();