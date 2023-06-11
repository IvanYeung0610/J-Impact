var socket = io();
var explore = document.getElementById("explore"); //all button
var pending = document.getElementById("pending"); //pending friend requests button
var friends = document.getElementById("friendslist"); //friends list div
var title = document.getElementById("title"); //friends list label
var friend = document.getElementById("friends");//friends tab
var search = document.getElementById("search"); //search bar in all


// var searchFriends = document.getElementById("searchFriends"); //search bar in friends

//all tab is selected by default
explore.style.backgroundColor = "lightgray";
pending.style.backgroundColor = "lightgray";
title.innerHTML = "All Friends";
friend.style.backgroundColor = "gray";
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
var friendRequest = function (sender, direction, id) {

    var newCard = document.createElement("div");
    newCard.id = id;
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

    if (direction == "incoming") {
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
        accept.addEventListener("click", function () {
            //reason why i used this function syntax is so i could pass in sender
            // console.log(sender);
            socket.emit("accepted_request", sender);
            document.getElementById(id).remove();
        });
        deny.addEventListener("click", function () {
            // console.log(sender);
            socket.emit("rejected_request", sender);
            document.getElementById(id).remove();
        });
    }
    else if (direction == "outgoing") {
        //deny here is actually cancel, but it kinda works like deny
        cardText.innerHTML = "Friend request to " + sender;//replace sender with person you are sending to
        var buttondiv = document.createElement("div");
        //buttondiv.className = "btn-group";
        //buttondiv.style = "margin: auto";
        var deny = document.createElement("button");
        deny.type = "button";
        deny.classList.add("btn");
        deny.innerHTML = "&#10006; Cancel";
        buttondiv.appendChild(deny);
        cardText.appendChild(buttondiv);
        deny.addEventListener("click", function () {
            socket.emit("request_canceled", sender);
            document.getElementById(id).remove();
        });
    }
}

//eventlisteners for profile
var profileButton = function () {
    setTimeout(function () {
        var memlist = document.getElementsByName("friend");
        for (let x = 0; x < memlist.length; x++) {
            //console.log(memlist[x].innerHTML.split(">")[1])//gets username of friend
            memlist[x].addEventListener('click', (e) => {
                e.preventDefault()
                window.location.href = '/profile/' + memlist[x].innerHTML.split(">")[1];
            })
        }
    }, 300); // Delay of .3 second
}

//eventlisteners for profile in explore
var profileButtonExplore = function () {
    setTimeout(function () {
        var memlist = document.getElementsByName("randos");
        console.log(memlist)
        for (let x = 0; x < memlist.length; x++) {
            //console.log(memlist[x].parentNode.parentNode.innerHTML.split(">")[1].split("<")[0]) //gets username of friend
            memlist[x].addEventListener('click', (e) => {
                e.preventDefault()
                window.location.href = '/profile/' + memlist[x].parentNode.parentNode.innerHTML.split(">")[1].split("<")[0];

            })
        }
    }, 300); // Delay of .3 second
}

//eventlisteners for send friend request
//also no longer needed
var sendRequestListener = function () {
    setTimeout(function () {
        var friendrequest = document.getElementsByName("sendrequest")//send friend request button
        for (let x = 0; x < friendrequest.length; x++) {
            //console.log(friendrequest[x].parentNode.parentNode.innerHTML.split(">")[1].split("<")[0])//gets username of friend
            friendrequest[x].addEventListener('click', (e) => {
                e.preventDefault();
                console.log(x);
                console.log(document.getElementById(x));
                var receiver = friendrequest[x].parentNode.parentNode.innerHTML.split(">")[1].split("<")[0]; //person you send the request to
                socket.emit("send_request", receiver);
                document.getElementById(x).remove();
            })
        }
    }, 300); // Delay of .3 second
}

var friendsList = function (friend, pfp) {
    var newButton = document.createElement("button");
    var img = document.createElement("img");
    img.src = pfp
    //console.log(pfp)
    img.style.height = "30px";
    img.style.width = "30px";
    img.style.marginRight = "10px";
    newButton.appendChild(img);
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.classList.add("btn-outline-dark");
    newButton.classList.add("custom-button");
    newButton.style = "background-color: #DEF2F1; width:32vh; text-align: left; margin-bottom: 20px; margin-left: 40px;";
    newButton.setAttribute('name', 'friend');
    newButton.innerHTML += friend;
    friends.appendChild(newButton);
}

var randos = function (rando, pfp, id) {
    var newCard = document.createElement("div");
    newCard.id = id;
    newCard.className = "card";
    newCard.style = "margin-left: 18px; margin-right: 10px; width: 18%; margin-bottom: 10px"
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";
    //cardBody.setAttribute('name', 'randos');
    //cardBody.style = "text-align: center;";
    newCard.appendChild(cardBody);
    var cardText = document.createElement("div");
    cardText.className = "card-text";
    //cardText.style = "justify-content: center";
    cardBody.appendChild(cardText);
    friends.style = "display: flex; flex-wrap: wrap; margin: auto";
    friends.appendChild(newCard);
    var img = document.createElement("img");
    img.src = pfp
    //console.log(pfp)
    img.style.height = "30px";
    img.style.width = "30px";
    img.style.marginRight = "10px";
    cardText.append(img);
    cardText.innerHTML += rando;

    //friend request button + view profile
    var newDiv = document.createElement("div");
    var sendRequest = document.createElement("button");
    sendRequest.type = "button";
    //sendRequest.style = "margin-left: 50px; padding: 3px; font-size: .7rem"
    sendRequest.setAttribute('name', 'sendrequest');
    sendRequest.classList.add("btn");
    sendRequest.classList.add("btn-success");
    sendRequest.classList.add("btn-sm");
    sendRequest.innerHTML = "Send Friend Request";
    sendRequest.addEventListener("click", function (e) {
        var receiver = this.parentNode.parentNode.innerHTML.split(">")[1].split("<")[0];
        e.preventDefault();
        var x = this.parentNode.parentNode.parentNode.parentNode.id;
        socket.emit("send_request", receiver)
        document.getElementById(x).remove();
    });
    var profile = document.createElement("button");
    profile.type = "button";
    profile.setAttribute('name', 'randos');
    profile.classList.add("btn");
    profile.classList.add("btn-info");
    profile.classList.add("btn-sm");
    profile.style = "margin-left: 7px";
    profile.innerHTML = 'View Profile';
    profile.addEventListener("click", profileButtonExplore());
    newDiv.style = "margin-top: 10px";
    newDiv.appendChild(sendRequest);
    newDiv.appendChild(profile);
    cardText.appendChild(newDiv);
}

var clearFriends = function () {
    document.getElementById("friendslist").innerHTML = "";
}

var loadFriends = function () {
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
            var pfp = response.requests.pfp;
            console.log(pfp);
            for (let i = 0; i < f.length; i++) {
                if (f[i][0] == username) {
                    friendsList(f[i][1], pfp[i]);
                } else {
                    friendsList(f[i][0], pfp[i]);
                }
            }
            profileButton();
        }
    }
    xhttp.open("POST", "friend-list");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

//this is for pending requests
var loadRequests = function () {
    document.getElementById("pending").setAttribute("selected", true);
    document.getElementById("friends").removeAttribute("selected", true);
    document.getElementById("explore").removeAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText); var received = response.requests.received;
            var sent = response.requests.sent;
            var received = response.requests.received;
            // console.log(response);
            for (var i = 0; i < received.length; i++) {
                fr = received[i];
                friendRequest(fr[0], "incoming", i);
            }
            for (let j = 0; j < sent.length; j++) {
                fr = sent[j];
                friendRequest(fr[1], "outgoing", j + i);
            }
        }
    }
    xhttp.open("POST", "friend-request-ajax");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

var loadExplore = function (str) {
    document.getElementById("explore").setAttribute("selected", true);
    document.getElementById("friends").removeAttribute("selected", true);
    document.getElementById("pending").removeAttribute("selected", true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            clearFriends();
            var response = JSON.parse(xhttp.responseText);
            var r = response.randos;
            var pfp = response.pfp;
            for (let i = 0; i < r.length; i++) {
                randos(r[i], pfp[i], i);
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

var searchBar = function (str) {
    //if all button is selected, search bar does something
    //if the pending request button is selected, search bar does other thing
    // console.log(str);
    if (document.getElementById("friends").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                // console.log(response);
                f = response.friends;
                pfp = response.pfp
                //console.log(pfp);
                for (let i = 0; i < f.length; i++) {
                    friendsList(f[i][0], pfp[i]);
                }
                profileButton();
            }
        }
        xhttp.open("POST", "search-friends");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var postVars = "searchTerm=" + str;
        // console.log(str);
        xhttp.send(postVars);
    } else if (document.getElementById("pending").getAttribute("selected")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
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
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                clearFriends();
                var response = JSON.parse(xhttp.responseText);
                console.log(response);
                r = response.randos;
                pfp = response.pfp;
                // console.log(r);
                for (let i = 0; i < r.length; i++) {
                    randos(r[i], pfp[i]);
                }
                profileButton();
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


loadFriends();//load friends on reload
var friendButton = document.getElementById("friend"); //buttons in friends
//console.log(friendButton)
profileButton();