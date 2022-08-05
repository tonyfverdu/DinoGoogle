//////////      VARIABLES       /////////////////////////////
let spielErgebnis               = 0;
let textErdgebnis;
let wrapper;
let figurDino;

let erdBoden;
let endspiel;

////        GAME LOOP           ////////////////////////////
let zeit                        = '';
let deltaZeit                   = 0;

let velSzenerie                 = 1280/3;
let gameVel                     = 1;

////        Position von erdBoden   /////////////////////////
let erdBodenX                   = 0;
let erdBodenY                   = 22;

////        Position von Figur      /////////////////////////
let velY                        = 0;
let figurPosX                   = 42;
let figurPosY                   = erdBodenY;

////        Figur springend?      ///////////////////////
let stehend                     = false;
let springend                   = false;
let impuls                      = 950;              //  <<==  Initial impuls (velY) of Figur in Y-Aches

////        Wolken im Himmel        ////////////////////
let zeitbisWolke                = 0.5;
const zeitWolkeMin              = 0.7;
const zeitWolkeMax              = 2.0;
const maxWolkeY                 = 420;
const minWolkeY                 = 230;
const arrayWolken               = [];
let velWolke                    = 0.5;

let schwerkraft                 = 2200;

//
let zeitBisHindernis            = 2;
let zeitHinderniseMin           = 0.5;
let zeitHindernisMax            = 2.5;
let hindernisPosY               = 16;
const hindernisse               = [];

//////////      FUNCTIONEN        /////////////////////////////

//////////////////////  BEWEGUNG VON BODEN UND FIGUR        ///////////////////////////

// 1.-  ////        bewegenErdboden()       <<==    Bewegung vom Boden (nur erdBodenX) 
function bewegenErdboden() {
    erdBodenX                   += rechnenUmzug();
    erdBoden.style.left         = -(erdBodenX % wrapper.clientWidth) + "px";
}

function rechnenUmzug() {
    return velSzenerie * deltaZeit * gameVel;  //  <<==  Berechnung der Verschiebung der X-Achse des Wrapper-Szenarios (space = vel * time)
}


// 2.-  ////        bewegenFigur ()         <<==  Bewegung vor Figur in PositionY.       
function bewegenFigur() {
    figurPosY                   += velY * deltaZeit;

    if(figurPosY <= erdBodenY){
        landen();
    }
    figurDino.style.bottom      = figurPosY + "px";
}

////    landen()                            <<==  Landen von Figur
function landen() {
    figurPosY                   = erdBodenY;
    velY                        = 0;
    if(springend){
        figurDino.classList.add("dinoCorriendo");
    }
    springend                   = false;
}

//  3.-  ////       springen()              <<==  Springen vom Figur (nur Y-Aches)
function springen() {
    if(figurPosY === erdBodenY){
        springend               = true;
        velY                    = impuls;
        figurDino.classList.remove("dinoCorriendo");
    }
}


////////////////////////////////////////////////////////////////////////////////////
//  4.-  Wolken im Himmel

function entscheidungWolkenSchaffen() {             //  <<==||      Zufällige Entscheidung, Wolken am Himmel zu erzeugen
    zeitbisWolke                        -= deltaZeit;
    if(zeitbisWolke <= 0) {
        wolkeSchaffen();
    }
}

function wolkeSchaffen() {                          //  <<==||      Wolkenbildung
    const elementDiv_Wolke                  = document.createElement("div");

    elementDiv_Wolke.classList.add("wolken");
    elementDiv_Wolke.posX                   = wrapper.clientWidth;
    elementDiv_Wolke.style.left             = wrapper.clientWidth + "px";
    elementDiv_Wolke.style.bottom           = Math.random() * ((maxWolkeY - minWolkeY)  + minWolkeY) + "px";
    wrapper.appendChild(elementDiv_Wolke);
    
    arrayWolken.push(elementDiv_Wolke);
    zeitbisWolke                            = zeitWolkeMin + Math.random() * (zeitWolkeMax - zeitWolkeMin) / velWolke;
}

function bewegenWolken() {
    for (let i = arrayWolken.length - 1; i >= 0; i--) {
        if(arrayWolken[i].posX < -arrayWolken[i].clientWidth) {
            arrayWolken[i].parentNode.removeChild(arrayWolken[i]);
            arrayWolken.splice(i, 1);
        } else {
            arrayWolken[i].posX             -= rechnenUmzug() * velWolke;
            arrayWolken[i].style.left = arrayWolken[i].posX + "px";
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////
//      5.-  Hindernisse von Spilen
function entscheidungHindernisseSchaffen(){         //  <<==||  Entscheidung, Hindernisse für die Figur zu schaffen (Kaktus)
    zeitBisHindernis                    -= deltaZeit;
    if(zeitBisHindernis <= 0) {
        hindernisseSchaffen();
    }
}

function hindernisseSchaffen() {                    //  <<==||  Hindernisse schaffen
    const hindernis                     = document.createElement("div");
    
    hindernis.classList.add("cactus1");
    if(Math.random() > 0.5) hindernis.classList.add("cactus2");

    hindernis.posX              = wrapper.clientWidth;
    hindernis.style.left        = wrapper.clientWidth + "px";
    wrapper.appendChild(hindernis);
    hindernisse.push(hindernis);

    zeitBisHindernis          =  Math.random() * ( (zeitHindernisMax - zeitHinderniseMin) + zeitHinderniseMin ) / gameVel;
}

function bewegenHindernisse() {
    for (let i = hindernisse.length - 1; i >= 0; i--) {
        if(hindernisse[i].posX < -hindernisse[i].clientWidth) {
            hindernisse[i].parentNode.removeChild(hindernisse[i]);
            hindernisse.splice(i, 1);
            punkteSammeln();
        }else{
            hindernisse[i].posX                 -= rechnenUmzug();
            hindernisse[i].style.left            = hindernisse[i].posX + "px";
        }
    }
}

function punkteSammeln() {
    spielErgebnis++;

    if(spielErgebnis === 5){
        gameVel               = 1.1;
        wrapper.classList.add("mediodia");
    }else if(spielErgebnis === 10) {
        gameVel               = 1.3;
        wrapper.classList.add("tarde");
    } else if(spielErgebnis === 20) {
        gameVel               = 1.5;
        wrapper.classList.add("noche");
    }
    erdBoden.style.animationDuration = (3/gameVel) + "s";
    document.querySelector(".score").textContent             = spielErgebnis + " Punkte";
    // alert(texterdgebnis); 
}

function kollisionsErkennung() {
        for (let i = 0; i < hindernisse.length; i++) {
            if(hindernisse[i].posX > figurPosX + figurDino.clientWidth)  {
                break; //al estar en orden, no puede chocar con más
            }else{
                if(IsCollision(figurDino, hindernisse[i], 10, 30, 15, 20)) {
                   gameOver();
                }
            }
        }
} 

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    let aRect                       = a.getBoundingClientRect();
    let bRect                       = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////      GAME LOOP           /////////////////////////////////////////////////////////
//  1.-   document is ready, or not?                     
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 10);  //  <<==  inmediatly init
} else {
    document.addEventListener("DOMContentLoaded", anfangsProgram);   //  <<==  Warte bitte, bis die Content von document is load
}

//  2.-   anfangen, beginnen und loop 
function anfangsProgram() {
    zeit                        = new Date();  //  <<==||  Zum Beispiel
    beginn();
    loop();
}
function beginn() {                                                 //   <<==  Ini elements-HTML of game and ein listener-event of key
    endspiel                    = document.querySelector(".gameOver");
    erdBoden                    = document.querySelector(".erdBoden");

    wrapper                     = document.querySelector(".containerDino");
    textErdgebnis               = document.querySelector(".score");
    textErdgebnis.textContent   = spielErgebnis + " Punkt";
    figurDino                   = document.querySelector(".dino");

    document.addEventListener("keydown", (ev) => {
        if(ev.keyCode === 32) {
            springen();
        }
    });
}
function loop() {
    deltaZeit                   = (new Date () - zeit) / 1000;
    zeit                        = new Date();
    update();
    requestAnimationFrame(loop);
}

//  3.-   update the velY von Figur ( velY                                -= schwerkraft * deltaZeit; )
function update() {
    if(! stehend) {
        bewegenErdboden();
        bewegenFigur();
        entscheidungHindernisseSchaffen();
        entscheidungWolkenSchaffen();
        bewegenHindernisse();
        bewegenWolken();
        kollisionsErkennung();
    } else {
        return;
    }
    velY                                -= schwerkraft * deltaZeit;
}

////        Ende von Spielen             //////////////////////////////////////////////////////
function gameOver() {
    zerbrechen();                                           //  <<==||  Ende die Bewegung vom Boden und nue Stehen vor Figur (zerbrechen)
    erdBoden.style.animationPlayState       = "paused";
    endspiel.style.display                  = "block";
}

function zerbrechen() {                                     //  <<==||  neue Stehen vor Figur (dino-estrellado) und stehend = true
    figurDino.classList.remove("dino-corriendo");
    figurDino.classList.add("dino-estrellado");
    stehend                                      = true;
}