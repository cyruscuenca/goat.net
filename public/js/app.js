
var AccurateTimer = require('accurate-timer-js').AccurateTimer;
var locationBarContents = document.getElementById("locationBarContents");
locationBarContents.innerHTML = '<span id="locationBarName">Home</span>';
document.getElementById("userBox").cursor = 'pointer';
var activeColor = "#5499c7";
var disabledColor = "#d6dbdf";

var element = function(id) {
    return document.getElementById(id);
}

var elements = function(className) {
    return document.getElementsByClassName(className);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function checkTimer(queue) {
    if(element('queueTimer') != null) {
        element('queueTimer').parentNode.removeChild(element('queueTimer'));
    }
    element('locationBarContents').insertAdjacentHTML('beforeend', '<div id=\"queueTimer\" data-count=\"0\" class=\"\">IN QUEUE 00:00</div>');
    element("queueTimer").removeAttribute("class");
    element("queueTimer").className = queue+' noSelect';
    var timer = new AccurateTimer(function tick() {
        count = element("queueTimer").dataset.count;
        count++
        element("queueTimer").dataset.count = count;
        var timeString = new Date(1000 * count).toISOString().substr(11, 8);
        element("queueTimer").textContent = "IN QUEUE "+timeString.substring(3);
        console.log('tick'+count);
    }, 1000);
    timer.start();
}

function truncate(string){
    if (string.length > 14)
       return string.substring(0, 14)+'...';
    else
       return string;
 };
 
// Does not trigger any switches. Only sets collor to disabled.
element('friendsGlyph').style.fill = disabledColor;
element('friendsTab').style.color = disabledColor;
element('teamsGlyph').style.fill = disabledColor;
element('teamsTab').style.color = disabledColor;
element('homeGlyph').style.fill = disabledColor;
element('homeTab').style.color = disabledColor;

function changeWindow(pageContent, name, audio) {
    if(audio){
        var audio = new Audio('public/audio/click.wav');
        audio.play();
    }
    element('locationBarName').innerHTML = name;
    element('pageContent').innerHTML = pageContent;
}

element('searchBtn').onclick = function() {
    element('searchBoxCont').style.display = "block";
    var audio = new Audio('public/audio/click.wav');
    audio.play();
    element('searchBoxCont').onclick = function() {
        element('searchBoxCont').style.display = "none";
        element('searchBox').style.display = "none";
    };
    element('searchBox').style.display = "block";
};

element('friendsTab').onclick = function() {
    changeWindow("<table class=\"animated fadeIn\" id=\"friendsList\"><tr><th>Name</th><th>Uplay</th><th>Status</th></tr><tr><td>Jebbbbbbbbbbbb</td><td>Jeb.-</td><td>Online</td></tr><tr><td>PyroS</td><td>PyroS</td><td>In Game</td></tr></table>", "Friends", 1);
    element('friendsGlyph').style.fill = activeColor;
    element('friendsTab').style.color = activeColor;
    element('teamsGlyph').style.fill = disabledColor;
    element('teamsTab').style.color = disabledColor;
    element('homeGlyph').style.fill = disabledColor;
    element('homeTab').style.color = disabledColor;
};

element('teamsTab').onclick = function() {
    changeWindow("<table class=\"animated fadeIn\" id=\"friendsList\"><tr><th>Name</th><th>Uplay</th><th>Status</th></tr><tr><td>Cloud9</td><td>Jeb.-</td><td>Online</td></tr><tr><td>DarkZero</td><td>PyroS</td><td>In Game</td></tr></table>", "Teams", 1);
    element('friendsGlyph').style.fill = disabledColor;
    element('friendsTab').style.color = disabledColor;
    element('teamsGlyph').style.fill = activeColor;
    element('teamsTab').style.color = activeColor;
    element('homeGlyph').style.fill = disabledColor;
    element('homeTab').style.color = disabledColor;
};

element('homeTab').onclick = function() {
    changeWindow("<div id=\"homeProfileBox\"><div id=\"homeProfileBoxContent\" class=\"animated fadeIn\"><div id=\"profileImage\" class=\"animated fadeInLeft\"></div><h1 class=\"animated fadeInLeft\">"+/*truncate(username)+*/"</h1><h2 class=\"animated fadeInLeft\">Uplay | <span>Jeb.-</span></h2><div id=\"rank\" class=\"animated fadeInLeft\"><img src=\"public/img/icons/silver_1.png\"></div></div></div><div class=\"homeGrid animated fadeIn\"><div id=\"homeMatches\">MATCHES</div><div class=\"homeStats\"><div class=\"noSelect\" id=\"playBtn\">PLAY</div><div>STATS</div></div></div>", "Home", 1);
    element('playBtn').onclick = function() {
        changeWindow("<div class=\"animated fadeIn\" id=\"modes\"><div class=\"mode\" id=\"quickPlayCard\"><div style=\"background: linear-gradient(rgba(52, 73, 94, 0.5), rgba(52, 73, 94, .75)),url(public/img/operators_standing.jpg); background-position: center; background-size: cover;\"></div><h1>QUICKPLAY</h1><p>Pro League rules. Choose your own teams. No SR gains or losses.</p></div><div id=\"rankedCard\" class=\"mode\"><div style=\"background: linear-gradient(rgba(52, 73, 94, 0.5), rgba(52, 73, 94, .75)),url(public/img/ash_smasher.jpg); background-position: center; background-size: cover;\"></div><h1>RANKED</h1><p>Pro League rules. Map & operator bans. Teams chosen by the matchmaker.</p></div></div>", "Select Gamemode", 1);
        element('quickPlayCard').onclick = function(){
           changeWindow("<div id=\"queueInfo\" class=\"animated fadeInDown\"><div><h1>RANKED</h1><h1><i class=\"em em-flag-um\"></i></h1></div><div><h1><img src=\"public/img/icons/silver_1.png\"></h1><h1>1455 SR</h1></div></div><div id=\"queueBtns\" class=\"animated fadeInDown\"><div class=\"btn btnSmall btnOrange\">LEAVE QUEUE</div><div class=\"btn btnSmall btnBrown\">SELECT ROLE</div></div><img class=\"animated fadeIn\" id=\"queueLoading\" src=\"public/img/icons/loading.svg\">", "Quickplay");
           var audio = new Audio('public/audio/confirm.wav');
           audio.play();
           checkTimer("teamQueue");
        };
        element('rankedCard').onclick = function(){
            changeWindow("<div id=\"queueInfo\" class=\"animated fadeInDown\"><div><h1>RANKED</h1><h1><i class=\"em em-flag-um\"></i></h1></div><div><h1><img src=\"public/img/icons/silver_1.png\"></h1><h1>1455 SR</h1></div></div><div id=\"queueBtns\" class=\"animated fadeInDown\"><div class=\"btn btnSmall btnOrange\">LEAVE QUEUE</div><div class=\"btn btnSmall btnBrown\">SELECT ROLE</div></div><img class=\"animated fadeIn\" id=\"queueLoading\" src=\"public/img/icons/loading.svg\">", "Quick Play"); 
            var audio = new Audio('public/audio/confirm.wav');
            audio.play()
            checkTimer("soloQueue");
         };
    };
    element('friendsGlyph').style.fill = disabledColor;
    element('friendsTab').style.color = disabledColor;
    element('teamsGlyph').style.fill = disabledColor;
    element('teamsTab').style.color = disabledColor;
    element('homeGlyph').style.fill = activeColor;
    element('homeTab').style.color = activeColor;
};

// Messaging functionality(Jquery)

$(function(){
    var socket = io.connect('http://localhost:3000');
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chatLog = $('#chatLog');

    $messageForm.keypress(function(event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                socket.emit('send message', $message.val());
                $message.val('');                        
            }
    });

    socket.on('new message', function(data){
        $chatLog.append('<div class="logMessage">'+data.msg+'</div>');
    })
})