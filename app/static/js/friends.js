var all = document.getElementById("all"); //all button
var pending = document.getElementById("pending"); //pending friend requests button
var friends = document.getElementById("friendslist"); //friends list div
var title = document.getElementById("title"); //friends list label

all.style.backgroundColor = "gray"; //all tab is selected by default

//changes background color to indicate which tab is selected
all.addEventListener("click", (e) => {
    all.style.backgroundColor = "gray";
    pending.style.backgroundColor = "lightgray";
    title.innerHTML = "All Friends";
}
)

pending.addEventListener("click", (e) => {
    pending.style.backgroundColor = "gray";
    all.style.backgroundColor = "lightgray";
    title.innerHTML = "Pending Requests"
}
)

//creates button with friend name/icon
var friendRequest = function(sender, receiver) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "sender: " + sender + "<br>" + "receiver: " + receiver;
    friends.appendChild(newButton);
}

var friendsList = function(friend) {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width:32vh; text-align: left;";
    newButton.innerHTML = "You are friends with: " + friend;
    friends.appendChild(newButton);
}

var clearFriends = function() {
    document.getElementById("friendslist").innerHTML = "";
}

var loadRequests = function() {
    document.getElementById("all").removeAttribute("selected", true);
    document.getElementById("pending").setAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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

var loadFriends = function() {
    document.getElementById("pending").removeAttribute("selected", true);
    document.getElementById("all").setAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var f = response.requests.friends;
            var username = response.requests.username;
            console.log(f);
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

var search = function(str) {
    //if all button is selected, search bar does something
    //if the pending request button is selected, search bar does other thing
    // console.log(str);
    document.getElementById("pending").getAttribute("selected");
    if (document.getElementById("all").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                // console.log(response);
                f = response.friends;
                console.log(f);
                for (let i = 0; i < f.length; i++) {
                    friendsList(f[i][0]);
                }
            }
        }
        xhttp.open("POST", "search-friends");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var postVars = "searchTerm=" + str;
        xhttp.send(postVars);
    } else if (document.getElementById("pending").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                // console.log(response);
                f = response.freqs;
                console.log(f);
                for (let i = 0; i < f.length; i++) {
                    friendRequest(f[i][0], f[i][1]);
                }
            }
        }
        xhttp.open("POST", "search-friend-requests");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        postVars = "searchTerm=" + str;
        xhttp.send(postVars);
    }
}