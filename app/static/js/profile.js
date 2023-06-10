var mutual = document.getElementById("mutual"); //mutual list div

/*
var mutualList = (i) => {
    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("btn");
    newButton.style = "background-color: gray; width: 80vh; text-align: left; margin-bottom: 2%;";
    newButton.innerHTML = "friend";
    mutual.appendChild(newButton);
}

for (let i = 0; i<20; i++){
    mutualList(i);
}
*/

var profileButton = function(){
    setTimeout(function() {
        var memlist = document.getElementsByName("friend");
        for (let x = 0; x < memlist.length; x++){
            //console.log(memlist[x].innerHTML.split(">")[1].trim())//gets username of friend
            memlist[x].addEventListener('click', (e) =>{
                e.preventDefault()
                window.location.href = '/profile/' + memlist[x].innerHTML.split(">")[1].trim();
            })
        }
    }, 300); // Delay of .3 second
}

profileButton();