var socket = io();
var edit = document.getElementById("edit");//edit button
var bio = document.getElementById("bio")//about me section
var editarea = document.getElementById("editarea")//where the textarea will appear
var uploadform = document.getElementById("upload_profile_form")
var pfp = document.getElementById("pfp")

uploadform.addEventListener('submit', (e) => {
    e.preventDefault()

    // getting array buffer data from image file
    const image_file = document.getElementById("file").files[0]
    console.log(image_file)
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        socket.emit('updated_profile_picture', event.target.result);
        // window.location.replace("/settings");
    });
    reader.readAsArrayBuffer(image_file);
})

socket.on('successfully_updated', (e) => {
    pfp.src = e
})

//edit bio function
var editBio = () => {
    var current = bio.innerHTML; //current bio
    bio.hidden = true;
    var textarea = document.createElement("textarea"); //input where you edit bio
    textarea.cols = 65;
    textarea.rows = 10;
    textarea.style = "resize: none";
    textarea.value = current; //have the textarea generate with current bio
    editarea.appendChild(textarea);
    edit.hidden = true;

    //creates submit button
    var submit = document.createElement("button");
    submit.classList.add("btn");
    submit.id = "submit";
    submit.innerHTML = "Submit";
    submit.style = "background-color: green";
    editarea.appendChild(submit);

    //cancel button
    var cancel = document.createElement("button");
    cancel.classList.add("btn");
    cancel.id = "cancel";
    cancel.innerHTML = "Cancel";
    cancel.style = "background-color: red; margin-left: 10px";
    editarea.appendChild(cancel);

    submit.addEventListener("click", (e) => {
        bio.innerHTML = textarea.value;
        editarea.removeChild(textarea);
        editarea.removeChild(submit); //don't put the parameter in quotes
        editarea.removeChild(cancel);
        edit.hidden = false;
        bio.hidden = false;

        //ajax request to update db with new desc
        fetch('/desc-ajax', {
            method: 'POST',
            body: "desc=" + textarea.value,
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
           
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error('Error:', error);
        });
    }
    )

    cancel.addEventListener("click", (e) => {
        editarea.removeChild(textarea);
        editarea.removeChild(submit); //don't put the parameter in quotes
        editarea.removeChild(cancel);
        edit.hidden = false;
        bio.hidden = false;
    }
    )
}

edit.addEventListener("click", editBio);