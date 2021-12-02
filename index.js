//Haetaan ensin kaikki tarvittavat elementit muuttujiin. Näitä voi sitten hyödyntää missä vain ja kuinka usein haluaa.
var load = document.getElementById("loading");
var error = document.getElementById("error");
var error2 = document.getElementById("error02");
var error3 = document.getElementById("error03");
var info = document.getElementById("infobg");
var usrimg = document.getElementById("usrimg");
var usrname = document.getElementById("usrname");
var playcount = document.getElementById("playcount");
var realname = document.getElementById("realname");
var country = document.getElementById("country");
var imglink = document.getElementById("imglink");

//Hakupainiketta painamalla suoritetaan getInfo() funktio.
document.getElementById("button-addon2").addEventListener("click", getInfo);

//Sovelluksen käytön helpottamista varten olen lisäänyt funktion, jonka avulla haun voi myös suorittaa vain painamalla Enter painiketta.
document.getElementById("usrInput").addEventListener("keypress", function(e) {
    if(e.key == "Enter"){
        getInfo();
    }
});

function getInfo() {
    var usrInput = document.getElementById("usrInput").value.trim();
    console.log(usrInput);
    if(usrInput == ""){
        alert("Please enter a username first!");
    }
    else {
        usrInput.value = "";
        
        //Pistetään tarvittavat osoitteet muuttujiin. Haettavan käyttäjän nimi tulee teksti kentästä.
        var url1 = "https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url2 = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=5&extended=1&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        
        //Tehdään niin monta HMLHttpRequestia, kuin osoitteita on. Tämän olisi varmaan voinut tehdä tehokkaammin vähemmällä koodilla, mutta minua juuri nyt kiinnostaa vain se, että koodi toimii.
        
        const http = new XMLHttpRequest();

        http.onreadystatechange = function() {

            //Jos mikään seuraavista elementeistä on jo näkyvissä, se pilotetaan uudestaan.
            error.style.display = "none";
            error2.style.display = "none";
            error3.style.display = "none";
            info.style.display = "none";
            
            
            if(this.readyState == 1){
                console.log("Getting user data...");
                //Tekemäni latausruutu tulee näkyviin tässä vaiheessa.
                load.style.display = "block";
                load.style.opacity = "1";
                
            }
            else if(this.readyState == 4 && this.status == 200){
                console.log("User data has been successfully acquired!");
                var myArray = JSON.parse(this.responseText);
                myFunction(myArray);
            }
            else if(this.readyState == 4 && this.status == 404){
                //Tämä viesti (404) tulee yleensä, jos annettua käyttäjänimeä ei ole olemassa. Tästä ilmoitetaan käyttäjälle näytämällä virhe viesti.
                console.log("Error 404. The user information cannot be found.");
                load.style.display = "none";
                error.style.display = "block";
            }
            else if(this.readyState == 4 && this.status == 503){
                //Last.FM antaa 503 viestin jos sen palvelua ei ole saatavilla. Päätin huomioida tämän ja näyttää tässä tapauksessa toisen virheviestin.
                console.log("Error 503. The service is temporarily unavailable.");
                load.style.display = "none";
                error3.style.display = "block";
            }
            else {
                //Jos jokin muu odottamaton asia nyt menee pieleen, näytetään tämä kolmas virheviesti.
                load.style.display = "none";
                error2.style.display = "block";
            }
        };
        http.open("GET", url1, true);
        http.send();

        //Erillinen XMLHttpRequesti toista URL osoitetta varten.
        var http2 = new XMLHttpRequest();
        http2.onreadystatechange = function() {
            
            if(this.readyState == 1){
                console.log("Getting recent tracks...");
            }
            if (this.readyState == 4 && this.status == 200) {
                console.log("Recent tracks have been succesfully acquired!");
                mySecondArray = JSON.parse(this.responseText);
                myFunction2(mySecondArray);
            }
        };
        http2.open("GET", url2, true);
        http2.send();
    }
}

function myFunction(myArray){
    
    //Täällä käsitellään ensimmäisestä pyynnöstä saadut tiedot, ja asetetaan ne oikeisiin paikkoihin sivulla.

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
    
    //Täällä käsitellään toisesta pyynnöstä saadut tiedot, ja ne asetetaan myös oikeisiin paikkoihin sivulla.
    
    console.log(mySecondArray);

    document.getElementById("infobg").style.backgroundImage = "url(" + mySecondArray.recenttracks.track[0].image[3]["#text"] +")";
    
    //Pistetään kuvat listaan.
    document.getElementById("listimg01").src = mySecondArray.recenttracks.track[0].image[3]["#text"];
    document.getElementById("listimg02").src = mySecondArray.recenttracks.track[1].image[3]["#text"];
    document.getElementById("listimg03").src = mySecondArray.recenttracks.track[2].image[3]["#text"];
    document.getElementById("listimg04").src = mySecondArray.recenttracks.track[3].image[3]["#text"];
    document.getElementById("listimg05").src = mySecondArray.recenttracks.track[4].image[3]["#text"];

    document.getElementById("listtxt01").lastChild.textContent = mySecondArray.recenttracks.track[0].artist.name + " - " + mySecondArray.recenttracks.track[0].name;
    document.getElementById("listtxt02").lastChild.textContent = mySecondArray.recenttracks.track[1].artist.name + " - " + mySecondArray.recenttracks.track[1].name;
    document.getElementById("listtxt03").lastChild.textContent = mySecondArray.recenttracks.track[2].artist.name + " - " + mySecondArray.recenttracks.track[2].name;
    document.getElementById("listtxt04").lastChild.textContent = mySecondArray.recenttracks.track[3].artist.name + " - " + mySecondArray.recenttracks.track[3].name;
    document.getElementById("listtxt05").lastChild.textContent = mySecondArray.recenttracks.track[4].artist.name + " - " + mySecondArray.recenttracks.track[4].name;

    //Jos käyttäjä on hakuhetkellä kuuntelemassa (siis "scrobblaamassa") jotain, ilmestyy JSON objektiin "nowplaying" osuus. Jos tämä osuus on olemassa, näytetään haetun käyttäjän olevan aktiivisesti kuuntelemassa jotain.
    if(typeof mySecondArray.recenttracks.track[0]["@attr"].nowplaying != "undefined"){
        document.getElementById("status").innerHTML = "<i class=\"fas fa-play\"></i> Now Playing:";
    }
}