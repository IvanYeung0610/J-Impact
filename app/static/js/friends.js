var socket = io();
var explore = document.getElementById("explore"); //all button
var pending = document.getElementById("pending"); //pending friend requests button
var friends = document.getElementById("friendslist"); //friends list div
var title = document.getElementById("title"); //friends list label
var friend = document.getElementById("friends");//friends tab
var search = document.getElementById("search"); //search bar in all
// var searchFriends = document.getElementById("searchFriends"); //search bar in friends

//all tab is selected by default
explore.style.backgroundColor = "gray";
pending.style.backgroundColor = "lightgray";
title.innerHTML = "All";
friend.style.backgroundColor = "lightgray";
search.hidden = false;
// searchFriends.hidden = true; 

socket.emit("select_group", "all_friends_page");

//changes background color to indicate which tab is selected
explore.addEventListener("click", (e) => {
    explore.style.backgroundColor = "gray";
    pending.style.backgroundColor = "lightgray";
    title.innerHTML = "All";
    friend.style.backgroundColor = "lightgray";
    search.hidden = false;
    // searchFriends.hidden = true; 

    socket.emit("select_group", "all_friends_page")
}
)

pending.addEventListener("click", (e) => {
    pending.style.backgroundColor = "gray";
    explore.style.backgroundColor = "lightgray";
    friend.style.backgroundColor = "lightgray";
    title.innerHTML = "Pending Requests";
    search.hidden = false;
    // searchFriends.hidden = true;

    socket.emit("select_group", "pending_requests")
}
)

friend.addEventListener("click", (e) => {
    friend.style.backgroundColor = "gray";
    explore.style.backgroundColor = "lightgray";
    pending.style.backgroundColor = "lightgray";
    title.innerHTML = "All Friends";
    search.hidden = false;
    // searchFriends.hidden = false;

    socket.emit("select_group", "pending_requests")
}
)

//creates button with friend name/icon
var friendRequest = function (sender, direction) {

    var newCard = document.createElement("div");
    newCard.className = "card";
    newCard.style = "margin-left: 18px; margin-right: 10px; width: 18%; margin-bottom: 10px"
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.style = "text-align: center;";
    newCard.appendChild(cardBody);
    var cardText = document.createElement("div");
    cardText.className = "card-text";
    cardText.style = "justify-content: center";
    cardBody.appendChild(cardText);
    friends.style = "display: flex; flex-wrap: wrap; margin: auto";
    friends.appendChild(newCard);

    if (direction == "incoming"){
        cardText.innerHTML = "Friend request from " + sender;
        var buttondiv = document.createElement("div");
        var accept = document.createElement("button");
        accept.type = "button";
        accept.classList.add("btn");
        accept.innerHTML = "\u2705 Accept";
        buttondiv.appendChild(accept);
        var deny = document.createElement("button");
        deny.type = "button";
        deny.classList.add("btn");
        deny.innerHTML = "&#10006; Deny";
        buttondiv.appendChild(deny);
        cardText.appendChild(buttondiv);
    }
    else if (direction == "outgoing"){
        cardText.innerHTML = "Friend request to " + sender;//replace sender with person you are sending to
        var buttondiv = document.createElement("div");
        buttondiv.className = "btn-group";
        //buttondiv.style = "margin: auto";
        var accept = document.createElement("button");
        accept.type = "button";
        accept.classList.add("btn");
        accept.innerHTML = "\u2705 Accept";
        buttondiv.appendChild(accept);
        var deny = document.createElement("button");
        deny.type = "button";
        deny.classList.add("btn");
        deny.innerHTML = "&#10006; Deny";
        buttondiv.appendChild(deny);
        cardText.appendChild(buttondiv);
    }
    //cardText.innerHTML = "\u2705 &#10006;";
    // var newButton = document.createElement("button");
    // newButton.type = "button";
    // newButton.classList.add("btn");
    // newButton.style = "background-color: gray; width:32vh; text-align: left;";
    // newButton.innerHTML = "sender: " + sender + "<br>" + direction;
    // friends.appendChild(newButton);
}

var friendsList = function (friend) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "You are friends with: " + friend;
    friends.appendChild(newButton);
}

var randos = function(rando) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "Would you like to be friends with " + rando + "?";
    friends.appendChild(newButton);
}

var clearFriends = function () {
    document.getElementById("friendslist").innerHTML = "";
}

var loadFriends = function() {
    document.getElementById("friends").setAttribute("selected", true);
    document.getElementById("pending").removeAttribute("selected", true);
    document.getElementById("explore").removeAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var f = response.requests.friends;
            var username = response.requests.username;
            // console.log(f);
            for (let i = 0; i < f.length; i++) {
                //console.log(friends[i]);
                if (f[i][0] == username) {
                    friendsList(f[i][1]);
                } else {
                    friendsList(f[i][0]);
                }
            }
        }
    }
    xhttp.open("POST", "friend-list");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

//this is for pending requests
var loadRequests = function() {
    document.getElementById("pending").setAttribute("selected", true);
    document.getElementById("friends").removeAttribute("selected", true);
    document.getElementById("explore").removeAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var received = response.requests.received;
            var sent = response.requests.sent;
            console.log(received);
            for (let i = 0; i < received.length; i++) {
                fr = received[i];
                friendRequest(fr[0], "incoming");
            }
            for (let i = 0; i < sent.length; i++) {
                fr = sent[i];
                friendRequest(fr[1], "outgoing");
            }
        }
    }
    xhttp.open("POST", "friend-request-ajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

var loadExplore = function(str) {
    document.getElementById("explore").setAttribute("selected", true);
    document.getElementById("friends").removeAttribute("selected", true);
    document.getElementById("pending").removeAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var r = response.randos;
            // console.log(r);
            for (let i = 0; i < r.length; i++) {
                randos(r[i][0]);
            }
        }
    }
    xhttp.open("POST", "load-explore-ajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var postVars = "search=";
    if (str == undefined) {
        postVars += "";
    } else {
        postVars = "search=" + str;
    }
    // console.log(str);
    xhttp.send(postVars);
}

var searchBar = function(str) {
    //if all button is selected, search bar does something
    //if the pending request button is selected, search bar does other thing
    // console.log(str);
    if (document.getElementById("friends").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                // console.log(response);
                f = response.friends;
                // console.log(f);
                for (let i = 0; i < f.length; i++) {
                    friendsList(f[i][0]);
                }
            }
        }
        xhttp.open("POST", "search-friends");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var postVars = "searchTerm=" + str;
        // console.log(str);
        xhttp.send(postVars);
    } else if (document.getElementById("pending").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                // console.log(response);
                f = response.freqs;
                // console.log(f);
                for (let i = 0; i < f.length; i++) {
                    friendRequest(f[i][0], f[i][3]);
                }
            }
        }
        xhttp.open("POST", "search-friend-requests");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        postVars = "searchTerm=" + str;
        // console.log(str);
        xhttp.send(postVars);
    } else if (document.getElementById("explore").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                var r = response.randos;
                // console.log(r);
                for (let i = 0; i < r.length; i++) {
                    randos(r[i][0]);
                }
            }
        }
        xhttp.open("POST", "explore-search-ajax");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var postVars = "search=";
        if (str == undefined || str == "") {
            //probably don't need to add an empty string
            postVars += "";
        } else {
            // console.log("search term exists");
            var postVars = "search=" + str;
        }
        // console.log(postVars);
        xhttp.send(postVars);
    }
}