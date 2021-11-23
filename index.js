function getInfo() {
    const http = new XMLHttpRequest();
    var usrInput = document.getElementById("usrInput").value.trim();
    console.log(usrInput);
    var url01 = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json"

    http.onreadystatechange = function() {
        if(this.readyState == 1){
            console.log("Connection to server has been established...")
        }
        if(this.readyState == 2){
            console.log("Server has received the request...");
        }
        if(this.readyState == 3){
            console.log("Server is processing the request...");
        }
        if(this.readyState == 4 && this.status == 200){
            console.log("The request has been processed and the response is ready.")
            var myArray = JSON.parse(this.responseText);
            myFunction(myArray);
        }
    };
    http.open("GET", url01, true);
    http.send();
}

function myFunction(myArray){
    console.log(myArray);
}