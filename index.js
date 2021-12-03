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
var tracks = document.getElementById("tracks");

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
        //Pistetään tarvittavat osoitteet muuttujiin. Haettavan käyttäjän nimi tulee teksti kentästä.
        var url1 = "https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url2 = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=5&extended=1&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url3 = "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=1&user=" + usrInput +"&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url4 = "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=1&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";
        var url5 = "https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=1&user=" + usrInput + "&api_key=4b8572f8c8b9752e97052ee0a2aec552&format=json";

        //Nyt kun URL osoitteet on tallennettu muuttujiin, voimme tyhjentää tekstikentän.
        document.getElementById("usrInput").value = "";
        
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
                var mySecondArray = JSON.parse(this.responseText);
                myFunction2(mySecondArray);
            }
        };
        http2.open("GET", url2, true);
        http2.send();

        //Erillinen XMLHttpRequesti kolmatta URL osoitetta varten.
        var http3 = new XMLHttpRequest();
        http3.onreadystatechange = function() {
            
            if(this.readyState == 1){
                console.log("Getting top artist...");
            }
            if (this.readyState == 4 && this.status == 200) {
                console.log("Top artist has been succesfully acquired!");
                var myThirdArray = JSON.parse(this.responseText);
                myFunction3(myThirdArray);
            }
        };
        http3.open("GET", url3, true);
        http3.send();

        //Erillinen XMLHttpRequesti neljättä URL osoitetta varten.
        var http4 = new XMLHttpRequest();
        http4.onreadystatechange = function() {
            
            if(this.readyState == 1){
                console.log("Getting top album...");
            }
            if (this.readyState == 4 && this.status == 200) {
                console.log("Top album has been succesfully acquired!");
                var myFourthArray = JSON.parse(this.responseText);
                myFunction4(myFourthArray);
            }
        };
        http4.open("GET", url4, true);
        http4.send();
        
        //Erillinen XMLHttpRequesti viidettä URL osoitetta varten.
        var http5 = new XMLHttpRequest();
        http5.onreadystatechange = function() {
            
            if(this.readyState == 1){
                console.log("Getting top artist...");
            }
            if (this.readyState == 4 && this.status == 200) {
                console.log("Top track has been succesfully acquired!");
                var myFifthArray = JSON.parse(this.responseText);
                myFunction5(myFifthArray);
            }
        };
        http5.open("GET", url5, true);
        http5.send();
    }
}

function myFunction(myArray){
    
    //Täällä käsitellään ensimmäisestä pyynnöstä saadut tiedot, ja asetetaan ne oikeisiin paikkoihin sivulla.
    
    console.log(myArray);

    usrimg.src = myArray.user.image[2]["#text"];
    imglink.href = myArray.user.url;
    
    usrname.innerHTML = myArray.user.name;
    realname.innerHTML = "Real name: " + myArray.user.realname;
    country.innerHTML = "Country: " + myArray.user.country;
    playcount.innerHTML = "Total playcount: " + myArray.user.playcount;

    //Tässä vaiheessa voimme piilottaa latausruudun ja esittää info ruutu.
    load.style.display = "none";
    info.style.display = "block";
}

function myFunction2(mySecondArray){
    
    //Täällä käsitellään toisesta pyynnöstä saadut tiedot, ja ne asetetaan myös oikeisiin paikkoihin sivulla.
    
    console.log(mySecondArray);

    //Inforuutu saa taustakseen käyttäjän viimeisimmän kappaleen kuvan.
    document.getElementById("infobg").style.backgroundImage = "url(" + mySecondArray.recenttracks.track[0].image[3]["#text"] +")";
    
    //Pistetään kuvat listaan. Tämän olisi voinut tehdä For loopilla, mutta olin liian laiska siihen.
    document.getElementById("listimg01").src = mySecondArray.recenttracks.track[0].image[1]["#text"];
    document.getElementById("listimg02").src = mySecondArray.recenttracks.track[1].image[1]["#text"];
    document.getElementById("listimg03").src = mySecondArray.recenttracks.track[2].image[1]["#text"];
    document.getElementById("listimg04").src = mySecondArray.recenttracks.track[3].image[1]["#text"];
    document.getElementById("listimg05").src = mySecondArray.recenttracks.track[4].image[1]["#text"];

    //Lisätään artisti ja kappaleen nimi listaan. Tämän olisi voinut tehdä For loopilla, mutta olin liian laiska siihen.
    document.getElementById("listtxt01").lastChild.textContent = mySecondArray.recenttracks.track[0].artist.name + " - " + mySecondArray.recenttracks.track[0].name;
    document.getElementById("listtxt02").lastChild.textContent = mySecondArray.recenttracks.track[1].artist.name + " - " + mySecondArray.recenttracks.track[1].name;
    document.getElementById("listtxt03").lastChild.textContent = mySecondArray.recenttracks.track[2].artist.name + " - " + mySecondArray.recenttracks.track[2].name;
    document.getElementById("listtxt04").lastChild.textContent = mySecondArray.recenttracks.track[3].artist.name + " - " + mySecondArray.recenttracks.track[3].name;
    document.getElementById("listtxt05").lastChild.textContent = mySecondArray.recenttracks.track[4].artist.name + " - " + mySecondArray.recenttracks.track[4].name;

    //Jos käyttäjä on hakuhetkellä kuuntelemassa (siis "scrobblaamassa") jotain, ilmestyy JSON objektiin "nowplaying" osuus. Jos tämä osuus on olemassa, näytetään haetun käyttäjän olevan aktiivisesti kuuntelemassa jotain.
    if(mySecondArray.recenttracks.track[0]["@attr"].nowplaying != "undefined"){
        document.getElementById("status").innerHTML = "<i class=\"fas fa-play\"></i> Now Playing:";
    }
}

function myFunction3(myThirdArray){
    
    //Täällä käsitellään kolmannesta pyynnöstä saadut tiedot, ja ne asetetaan myös oikeisiin paikkoihin sivulla.
    
    console.log(myThirdArray);

    //Pistetään lempiartistin kuva, nimi ja toistojen määrä oikeisiin paikkoihin. Lisätään kuvaan myös linkki artistin Last.FM sivulle.
    document.getElementById("favArtistImg").src = myThirdArray.topartists.artist[0].image[4]["#text"];
    document.getElementById("favlink1").href = myThirdArray.topartists.artist[0].url;
    document.getElementById("favArtistName").innerText = myThirdArray.topartists.artist[0].name;
    document.getElementById("favArtistPlayCount").innerText = "Playcount: " + myThirdArray.topartists.artist[0].playcount;
}

function myFunction4(myFourthArray){
    
    //Täällä käsitellään neljännestä pyynnöstä saadut tiedot, ja ne asetetaan myös oikeisiin paikkoihin sivulla.
    
    console.log(myFourthArray);

    //Pistetään lempialbumin kuva, nimi ja toistojen määrä oikeisiin paikkoihin. Lisätään kuvaan myös linkki albumin Last.FM sivulle.
    document.getElementById("favAlbumImg").src = myFourthArray.topalbums.album[0].image[3]["#text"];
    document.getElementById("favlink2").href = myFourthArray.topalbums.album[0].url;
    document.getElementById("favAlbumName").innerText = myFourthArray.topalbums.album[0].name + " by " + myFourthArray.topalbums.album[0].artist.name;
    document.getElementById("favAlbumPlayCount").innerText = "Playcount: " + myFourthArray.topalbums.album[0].playcount;
}

function myFunction5(myFifthArray){
    
    //Täällä käsitellään viidennestä pyynnöstä saadut tiedot, ja ne asetetaan myös oikeisiin paikkoihin sivulla.
    
    console.log(myFifthArray);

    //Pistetään lempikappaleen kuva, nimi ja toistojen määrä oikeisiin paikkoihin. Lisätään kuvaan myös linkki kappaleen Last.FM sivulle.
    document.getElementById("favTrackImg").src = myFifthArray.toptracks.track[0].image[3]["#text"];
    document.getElementById("favlink3").href = myFifthArray.toptracks.track[0].url;
    document.getElementById("favTrackName").innerText = myFifthArray.toptracks.track[0].name + " by " + myFifthArray.toptracks.track[0].artist.name;
    document.getElementById("favTrackPlayCount").innerText = "Playcount: " + myFifthArray.toptracks.track[0].playcount;
}