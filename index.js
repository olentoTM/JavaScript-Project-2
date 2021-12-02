//Haetaan ensin kaikki tarvittavat elementit muuttujiin. Näitä voi sitten hyödyntää missä vain ja kuinka usein haluaa.
var load = document.getElementById("loading");
var error = document.getElementById("error");
var error2 = document.getElementById("error02");
var info = document.getElementById("infobg");
var usrimg = document.getElementById("usrimg");
var usrname = document.getElementById("usrname");
var playcount = document.getElementById("playcount");
var realname = document.getElementById("realname");
var country = document.getElementById("country");
var imglink = document.getElementById("imglink");

//Hakupainiketta painamalla suoritetaan getInfo() funktio.
document.getElementById("button-addon2").addEventListener("click", getInfo);

function getInfo() {
    const http = new XMLHttpRequest();
    var usrInput = document.getElementById("usrInput").value.trim();
    console.log(usrInput);
    if(usrInput == ""){
        alert("Please enter a username first!");
    }
    else {
        usrInput.value = "";
        
        var url1 = "https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url2 = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=5&extended=1&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";

        http.onreadystatechange = function() {
            
            error.style.display = "none";
            error2.style.display = "none";
            info.style.display = "none";
            
            
            if(this.readyState == 1){
                console.log("Connection to server has been established...");
                load.style.display = "block";
                load.style.opacity = "1";
                
            }
            else if(this.readyState == 2){
                console.log("Server has received the request...");
            }
            else if(this.readyState == 3){
                console.log("Server is processing the request...");
            }
            else if(this.readyState == 4 && this.status == 200){
                console.log("The request has been processed and the response is ready.");
                var myArray = JSON.parse(this.responseText);
                myFunction(myArray);
            }
            else if(this.readyState == 4 && this.status == 404){
                console.log("Error 404. The user information cannot be found.");
                load.style.display = "none";
                error.style.display = "block"
            }
            else {
                load.style.display = "none";
                error2.style.display = "block";
            }
        };
        http.open("GET", url1, true);
        http.send();

        var http2 = new XMLHttpRequest();
        http2.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                mySecondArray = JSON.parse(this.responseText);
                myFunction2(mySecondArray);
            }
        };
        http2.open("GET", url2, true);
        http2.send();
    }
}

function myFunction(myArray, mySecondArray){
    load.style.display = "none";
    
    console.log(myArray);

    usrimg.src = myArray.user.image[2]["#text"];
    imglink.href = myArray.user.url;
    
    usrname.innerHTML = myArray.user.name;
    realname.innerHTML = "Real name: " + myArray.user.realname;
    country.innerHTML = "Country: " + myArray.user.country;
    playcount.innerHTML = "Total playcount: " + myArray.user.playcount;

    info.style.display = "block";
}

function myFunction2(mySecondArray){
    console.log(mySecondArray);

    document.getElementById("infobg").style.backgroundImage = "url(" + mySecondArray.recenttracks.track[0].image[3]["#text"] +")";

    
    if(typeof mySecondArray.recenttracks.track[0]["@attr"].nowplaying != "undefined"){
        document.getElementById("test").innerHTML = "THIS PERSON IS LISTENING TO MUSIC RIGHT NOW!"
    }
}