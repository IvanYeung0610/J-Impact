var socket = io();
var all = document.getElementById("all"); //all button
var pending = document.getElementById("pending"); //pending friend requests button
var friends = document.getElementById("friendslist"); //friends list div
var title = document.getElementById("title"); //friends list label
var friend = document.getElementById("friends");//friends tab
var search = document.getElementById("search"); //search bar in all
var searchFriends = document.getElementById("searchFriends"); //search bar in friends

//all tab is selected by default
all.style.backgroundColor = "gray";
pending.style.backgroundColor = "lightgray";
title.innerHTML = "All";
friend.style.backgroundColor = "lightgray";
search.hidden = false;
searchFriends.hidden = true; 

socket.emit("select_group", "all_friends_page");

//changes background color to indicate which tab is selected
all.addEventListener("click", (e) => {
    all.style.backgroundColor = "gray";
    pending.style.backgroundColor = "lightgray";
    title.innerHTML = "All";
    friend.style.backgroundColor = "lightgray";
    search.hidden = false;
    searchFriends.hidden = true; 

    socket.emit("select_group", "all_friends_page")
}
)

pending.addEventListener("click", (e) => {
    pending.style.backgroundColor = "gray";
    all.style.backgroundColor = "lightgray";
    friend.style.backgroundColor = "lightgray";
    title.innerHTML = "Pending Requests";
    search.hidden = true;
    searchFriends.hidden = true;

    socket.emit("select_group", "pending_requests")
}
)

friend.addEventListener("click", (e) => {
    friend.style.backgroundColor = "gray";
    all.style.backgroundColor = "lightgray";
    pending.style.backgroundColor = "lightgray";
    title.innerHTML = "All Friends";
    search.hidden = true;
    searchFriends.hidden = false;

    socket.emit("select_group", "pending_requests")
}
)

//creates button with friend name/icon
var friendRequest = function (sender, receiver) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "sender: " + sender + "<br>" + "receiver: " + receiver;
    friends.appendChild(newButton);
}

var friendsList = function (friend) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "You are friends with: " + friend;
    friends.appendChild(newButton);
}

var clearFriends = function () {
    document.getElementById("friendslist").innerHTML = "";
}

var loadRequests = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var received = response.requests.received;
            var sent = response.requests.sent;
            for (let i = 0; i < received.length; i++) {
                fr = received[i];
                friendRequest(fr[0], fr[1]);
            }
            for (let i = 0; i < sent.length; i++) {
                fr = sent[i];
                friendRequest(fr[0], fr[1]);
            }
        }
    }
    xhttp.open("POST", "friend-request-ajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();

}

var loadFriends = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var friends = response.requests.friends;
            var username = response.requests.username;
            // console.log(friends);
            for (let i = 0; i < friends.length; i++) {
                console.log(friends[i]);
                if (friends[i][0] == username) {
                    friendsList(friends[i][1]);
                } else {
                    friendsList(friends[i][0]);
                }
            }
        }
    }
    xhttp.open("POST", "friend-list");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}