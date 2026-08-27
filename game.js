/* =========================================================
ROOM 17 — GAME.JS
Version 2.0 — FIXED
========================================================= */

/* ================= STATE ================= */

const defaultState = {
coins: 150,
playerX: 34,

hasKey: false,
hasBattery: false,
hasScanner: false,
hasLamp: false,

terminalRead: false,
crateOpened: false,
generatorFixed: false,
doorOpened: false,

chapter: 1,
sound: true
};

let saved = localStorage.getItem("room17save");

let state;

try {

state = saved
? Object.assign({}, defaultState, JSON.parse(saved))
: Object.assign({}, defaultState);

} catch (error) {

state = Object.assign({}, defaultState);
localStorage.removeItem("room17save");

}

/* ================= SAVE ================= */

function save(){

localStorage.setItem(
"room17save",
JSON.stringify(state)
);

updateUI();
}

/* ================= SCREEN ================= */

function showScreen(id){

document
.querySelectorAll(".screen")
.forEach(function(screen){

screen.classList.remove("active");  

});

const target =
document.getElementById(id);

if(target){

target.classList.add("active");

}

}

/* ================= MENU ================= */

function backMenu(){

closeDialog();
showScreen("menu");

}

function openPanel(id){

if(id === "shop"){

renderShop();

}

if(id === "inventory"){

renderInventory();

}

showScreen(id);

}

/* ================= NEW GAME ================= */

function newGame(){

state =
Object.assign({}, defaultState);

save();

showScreen("game");

showDialog(

"النظام",  

"تم تشغيل بروتوكول الاستيقاظ. لا توجد بيانات عن الطاقم. مصدر الإشارة: الغرفة 17.",  

[  

  {  
    text: "ابدأ التحقيق",  

    action: function(){  

      closeDialog();  

    }  

  }  

]

);

}

/* ================= CONTINUE ================= */

function continueGame(){

showScreen("game");

updateUI();

}

/* ================= RESET ================= */

function resetGame(){

const answer =
confirm(
"هل تريد حذف تقدم اللعبة بالكامل؟"
);

if(!answer){

return;

}

localStorage.removeItem(
"room17save"
);

state =
Object.assign({}, defaultState);

updateUI();

toast("تم حذف الحفظ");

}

/* ================= UI ================= */

function updateUI(){

const coins =
document.getElementById("coins");

const shopCoins =
document.getElementById("shopCoins");

const player =
document.getElementById("player");

if(coins){

coins.textContent =  
  state.coins;

}

if(shopCoins){

shopCoins.textContent =  
  state.coins;

}

if(player){

player.style.left =  
  state.playerX + "%";

}

let quest =
"اكتشف الغرفة";

if(!state.terminalRead){

quest =  
  "افحص الحاسوب";

}

else if(!state.crateOpened){

quest =  
  "ابحث في الصندوق";

}

else if(!state.hasKey){

quest =  
  "اكتشف طريقة فتح الباب";

}

else if(!state.generatorFixed){

quest =  
  "أصلح مولد الطاقة";

}

else{

quest =  
  "اخرج من الغرفة 17";

}

const questElement =
document.getElementById("quest");

if(questElement){

questElement.textContent =  
  quest;

}

const terminal =
document.getElementById(
"terminalText"
);

if(terminal && state.terminalRead){

terminal.innerHTML =  
  "SYSTEM 17<br><br>" +  
  "POWER: " +  
  (state.generatorFixed ? "100" : "71") +  
  "%<br>" +  
  "DOOR: " +  
  (state.doorOpened ? "OPEN" : "LOCKED") +  
  "<br><br>" +  
  (  
    state.generatorFixed  
    ? "SIGNAL: DETECTED"  
    : "USER: UNKNOWN"  
  );

}

const soundState =
document.getElementById(
"soundState"
);

if(soundState){

soundState.textContent =  
  state.sound  
  ? "تشغيل"  
  : "إيقاف";

}

}

/* ================= TOAST ================= */

function toast(text){

const t =
document.getElementById(
"toast"
);

if(!t){

return;

}

t.textContent =
text;

t.classList.add("show");

clearTimeout(
window.toastTimer
);

window.toastTimer =
setTimeout(
function(){

t.classList.remove(  
      "show"  
    );  

  },  
  2400  
);

}

/* ================= MOVEMENT ================= */

function move(dir){

const game =
document.getElementById("game");

if(
!game ||
!game.classList.contains("active")
){

return;

}

state.playerX +=
dir * 4;

state.playerX =
Math.max(
2,
Math.min(
88,
state.playerX
)
);

const player =
document.getElementById(
"player"
);

if(player){

player.style.left =  
  state.playerX + "%";

}

if(state.sound){

beep(  
  150 + Math.random() * 80,  
  0.04  
);

}

}

/* ================= INTERACTION ================= */

function interact(){

const x =
state.playerX;

/* ================= DOOR ================= */

if(x < 25){

if(state.doorOpened){  

  finishGame();  

  return;  

}  


if(!state.hasKey){  

  showDialog(  

    "الباب",  

    "الباب محكم الإغلاق. لا توجد لوحة أرقام... فقط منفذ صغير أسفل المقبض.",  

    [  

      {  
        text: "الابتعاد",  

        action: function(){  

          closeDialog();  

        }  

      }  

    ]  

  );  

  return;  

}  


if(!state.generatorFixed){  

  showDialog(  

    "الباب",  

    "تم التعرف على المفتاح، لكن نظام الطاقة غير مستقر. الباب يحتاج إلى طاقة كاملة.",  

    [  

      {  
        text: "حسنًا",  

        action: function(){  

          closeDialog();  

        }  

      }  

    ]  

  );  

  return;  

}  


state.doorOpened =  
  true;  


save();  


showDialog(  

  "الباب",  

  "صدر صوت معدني ثقيل... الباب بدأ يفتح ببطء.",  

  [  

    {  
      text: "افتح الباب",  

      action: function(){  

        closeDialog();  

        finishGame();  

      }  

    }  

  ]  

);  

return;

}

/* ================= TERMINAL ================= */

if(x > 67){

if(!state.terminalRead){  

  state.terminalRead =  
    true;  


  save();  


  showDialog(  

    "الحاسوب",  

    "SYSTEM 17 يستجيب. هناك ملف واحد فقط متاح. الاسم: INCIDENT_17.",  

    [  

      {  
        text: "فتح الملف",  

        action: function(){  

          showDialog(  

            "INCIDENT_17",  

            "قبل 19 يومًا، اختفى الطاقم بالكامل. آخر تسجيل صوتي يحتوي على جملة واحدة: لا توقظ الغرفة.",  

            [  

              {  
                text: "متابعة",  

                action: function(){  

                  showDialog(  

                    "الحاسوب",  

                    "تم اكتشاف إشارة ضعيفة من مكان ما تحت المحطة. المصدر: المستوى السفلي.",  

                    [  

                      {  
                        text: "إغلاق",  

                        action: function(){  

                          closeDialog();  

                        }  

                      }  

                    ]  

                  );  

                }  

              }  

            ]  

          );  

        }  

      }  

    ]  

  );  

  return;  

}  


showDialog(  

  "الحاسوب",  

  state.generatorFixed  

    ? "POWER: 100%. SIGNAL: DETECTED. هناك شيء ما يرسل الإشارة من أسفل المحطة."  

    : "النظام يعمل، لكن الطاقة غير كافية. ربما يجب البحث عن مصدر طاقة آخر.",  

  [  

    {  
      text: "إغلاق",  

      action: function(){  

        closeDialog();  

      }  

    }  

  ]  

);  

return;

}

/* ================= CRATE ================= */

if(x >= 35 && x <= 60){

if(!state.crateOpened){  

  state.crateOpened =  
    true;  


  state.hasKey =  
    true;  


  state.coins +=  
    50;  


  save();  


  showDialog(  

    "الصندوق",  

    "وجدت بطاقة وصول معدنية ومجموعة عملات قديمة. البطاقة تحمل الرقم 17.",  

    [  

      {  
        text: "أخذ الأشياء",  

        action: function(){  

          toast(  
            "حصلت على بطاقة الوصول +50 🪙"  
          );  

          closeDialog();  

        }  

      }  

    ]  

  );  

  return;  

}  


showDialog(  

  "الصندوق",  

  "الصندوق فارغ الآن.",  

  [  

    {  
      text: "إغلاق",  

      action: function(){  

        closeDialog();  

      }  

    }  

  ]  

);  

return;

}

/* ================= GENERATOR ================= */

if(x >= 48 && x <= 67){

if(!state.crateOpened){  

  showDialog(  

    "مولد الطاقة",  

    "المولد متوقف. ربما توجد أداة أو بطاقة في مكان قريب يمكنها تشغيله.",  

    [  

      {  
        text: "إغلاق",  

        action: function(){  

          closeDialog();  

        }  

      }  

    ]  

  );  

  return;  

}  


if(!state.generatorFixed){  

  state.generatorFixed =  
    true;  


  state.coins +=  
    100;  


  save();  


  showDialog(  

    "مولد الطاقة",  

    "تم توصيل بطاقة الوصول. المولد عاد للعمل... لكن لحظة تشغيله كشفت شيئًا غريبًا.",  

    [  

      {  
        text: "ماذا حدث؟",  

        action: function(){  

          showDialog(  

            "النظام",  

            "تم اكتشاف نبض كهربائي قادم من المستوى السفلي. الإشارة ليست من المحطة.",  

            [  

              {  
                text: "إغلاق",  

                action: function(){  

                  closeDialog();  

                }  

              }  

            ]  

          );  

        }  

      }  

    ]  

  );  

  return;  

}  


showDialog(  

  "مولد الطاقة",  

  "المولد يعمل بكفاءة كاملة. POWER: 100%.",  

  [  

    {  
      text: "إغلاق",  

      action: function(){  

        closeDialog();  

      }  

    }  

  ]  

);  

return;

}

/* ================= NOTHING ================= */

showDialog(

"النظام",  

"لا يوجد شيء مهم هنا الآن.",  

[  

  {  
    text: "إغلاق",  

    action: function(){  

      closeDialog();  

    }  

  }  

]

);

}

/* ================= DIALOG ================= */

function showDialog(
speaker,
text,
choices
){

const overlay =
document.getElementById(
"dialogOverlay"
);

const speakerElement =
document.getElementById(
"speaker"
);

const textElement =
document.getElementById(
"dialogText"
);

const choicesElement =
document.getElementById(
"dialogChoices"
);

if(
!overlay ||
!speakerElement ||
!textElement ||
!choicesElement
){

return;

}

speakerElement.textContent =
speaker;

textElement.textContent =
text;

choicesElement.innerHTML =
"";

if(
!choices ||
choices.length === 0
){

choices = [  

  {  
    text: "إغلاق",  

    action: function(){  

      closeDialog();  

    }  

  }  

];

}

choices.forEach(
function(choice){

const button =  
    document.createElement(  
      "button"  
    );  


  button.type =  
    "button";  


  button.textContent =  
    choice.text;  


  button.addEventListener(  
    "click",  
    function(){  

      if(  
        typeof choice.action ===  
        "function"  
      ){  

        choice.action();  

      }  

    }  
  );  


  choicesElement.appendChild(  
    button  
  );  

}

);

overlay.style.display =
"block";

}

function closeDialog(){

const overlay =
document.getElementById(
"dialogOverlay"
);

if(overlay){

overlay.style.display =  
  "none";

}

}

/* ================= SHOP ================= */

const shopItems = [

{
id: "battery",

name: "🔋 بطارية",  

description:  
  "بطارية احتياطية قد تكون مفيدة في أجزاء أخرى من المحطة.",  

price: 75

},

{
id: "scanner",

name: "📡 ماسح إشارات",  

description:  
  "يكشف الإشارات الإلكترونية القريبة.",  

price: 120

},

{
id: "lamp",

name: "🔦 مصباح",  

description:  
  "مصباح صغير مناسب للأماكن المظلمة.",  

price: 60

}

];

function renderShop(){

const container =
document.getElementById(
"shopCards"
);

if(!container){

return;

}

container.innerHTML =
"";

shopItems.forEach(
function(item){

const card =  
    document.createElement(  
      "div"  
    );  


  card.className =  
    "card";  


  const title =  
    document.createElement(  
      "h3"  
    );  


  title.textContent =  
    item.name;  


  const description =  
    document.createElement(  
      "p"  
    );  


  description.textContent =  
    item.description;  


  const button =  
    document.createElement(  
      "button"  
    );  


  button.type =  
    "button";  


  const key =  
    "has" +  
    item.id.charAt(0).toUpperCase() +  
    item.id.slice(1);  


  const owned =  
    state[key];  


  if(owned){  

    button.textContent =  
      "تم الشراء ✓";  


    button.disabled =  
      true;  

  }  

  else{  

    button.textContent =  
      "شراء — " +  
      item.price +  
      " 🪙";  


    button.addEventListener(  
      "click",  
      function(){  

        buyItem(item);  

      }  
    );  

  }  


  card.appendChild(  
    title  
  );  


  card.appendChild(  
    description  
  );  


  card.appendChild(  
    button  
  );  


  container.appendChild(  
    card  
  );  

}

);

}

function buyItem(item){

const key =
"has" +
item.id.charAt(0).toUpperCase() +
item.id.slice(1);

if(state[key]){

toast(  
  "لديك هذا العنصر بالفعل"  
);  

return;

}

if(state.coins < item.price){

toast(  
  "لا تملك عملات كافية"  
);  

return;

}

state.coins -=
item.price;

state[key] =
true;

save();

renderShop();

toast(
"تم شراء " +
item.name
);

}

/* ================= INVENTORY ================= */

function renderInventory(){

const container =
document.getElementById(
"inventoryCards"
);

if(!container){

return;

}

container.innerHTML =
"";

const items = [

{  
  name: "🪪 بطاقة الوصول",  

  owned: state.hasKey,  

  description:  
    "بطاقة تحمل الرقم 17."  
},  

{  
  name: "🔋 بطارية",  

  owned: state.hasBattery,  

  description:  
    "بطارية احتياطية."  
},  

{  
  name: "📡 ماسح إشارات",  

  owned: state.hasScanner,  

  description:  
    "يمكنه التقاط الإشارات الإلكترونية."  
},  

{  
  name: "🔦 مصباح",  

  owned: state.hasLamp,  

  description:  
    "مصباح صغير."  
}

];

items.forEach(
function(item){

const card =  
    document.createElement(  
      "div"  
    );  


  card.className =  
    "card " +  
    (  
      item.owned  
      ? ""  
      : "locked"  
    );  


  const title =  
    document.createElement(  
      "h3"  
    );  


  title.textContent =  
    item.owned  
    ? item.name  
    : "🔒 غير موجود";  


  const description =  
    document.createElement(  
      "p"  
    );  


  description.textContent =  
    item.owned  
    ? item.description  
    : "لم تحصل على هذا العنصر بعد.";  


  card.appendChild(  
    title  
  );  


  card.appendChild(  
    description  
  );  


  container.appendChild(  
    card  
  );  

}

);

if(
state.terminalRead ||
state.crateOpened ||
state.generatorFixed
){

const progress =  
  document.createElement(  
    "div"  
  );  


progress.className =  
  "card";  


progress.innerHTML =  
  "<h3>📋 الحالة</h3>" +  
  "<p>" +  
  "قراءة الحاسوب: " +  
  (  
    state.terminalRead  
    ? "✓"  
    : "—"  
  ) +  
  "<br>" +  
  "فتح الصندوق: " +  
  (  
    state.crateOpened  
    ? "✓"  
    : "—"  
  ) +  
  "<br>" +  
  "إصلاح المولد: " +  
  (  
    state.generatorFixed  
    ? "✓"  
    : "—"  
  ) +  
  "</p>";  


container.appendChild(  
  progress  
);

}

}

/* ================= FINISH ================= */

function finishGame(){

state.chapter =
2;

save();

showDialog(

"الغرفة 17",  

"انفتح الباب... لكن ما رأيته خلفه لم يكن ممرًا. كان هناك ضوء أبيض قوي، وصوت يقول: لقد تأخرت.",  

[  

  {  
    text: "متابعة",  

    action: function(){  

      closeDialog();  

      toast(  
        "الفصل الثاني قادم..."  
      );  

    }  

  }  

]

);

}

/* ================= PAUSE ================= */

function pauseGame(){

showDialog(

"إيقاف مؤقت",  

"اللعبة متوقفة مؤقتًا. يمكنك العودة إلى القائمة أو متابعة التحقيق.",  

[  

  {  
    text: "متابعة",  

    action: function(){  

      closeDialog();  

    }  

  },  

  {  
    text: "القائمة الرئيسية",  

    action: function(){  

      closeDialog();  

      showScreen("menu");  

    }  

  }  

]

);

}

/* ================= SOUND ================= */

let audioContext =
null;

function beep(
frequency,
duration
){

if(!state.sound){

return;

}

try{

if(!audioContext){  

  audioContext =  
    new (  
      window.AudioContext ||  
      window.webkitAudioContext  
    )();  

}  


const oscillator =  
  audioContext.createOscillator();  


const gain =  
  audioContext.createGain();  


oscillator.frequency.value =  
  frequency;  


oscillator.type =  
  "sine";  


gain.gain.setValueAtTime(  
  0.025,  
  audioContext.currentTime  
);  


gain.gain.exponentialRampToValueAtTime(  
  0.001,  
  audioContext.currentTime +  
  duration  
);  


oscillator.connect(  
  gain  
);  


gain.connect(  
  audioContext.destination  
);  


oscillator.start();  


oscillator.stop(  
  audioContext.currentTime +  
  duration  
);

}

catch(error){

/* الصوت اختياري */

}

}

/* ================= EVENTS ================= */

/* START */

document
.getElementById("startBtn")
.addEventListener(
"click",
newGame
);

/* STORY */

document
.getElementById("storyBtn")
.addEventListener(
"click",
function(){

showScreen("story");  

}

);

/* SHOP */

document
.getElementById("shopBtn")
.addEventListener(
"click",
function(){

openPanel("shop");  

}

);

/* INVENTORY */

document
.getElementById("inventoryBtn")
.addEventListener(
"click",
function(){

openPanel("inventory");  

}

);

/* MAP */

document
.getElementById("mapBtn")
.addEventListener(
"click",
function(){

showScreen("map");  

}

);

/* SETTINGS */

document
.getElementById("settingsBtn")
.addEventListener(
"click",
function(){

showScreen("settings");  

}

);

/* CONTINUE */

document
.getElementById("continueBtn")
.addEventListener(
"click",
continueGame
);

/* BACK BUTTONS */

document
.querySelectorAll("[data-back]")
.forEach(
function(button){

button.addEventListener(  
    "click",  
    backMenu  
  );  

}

);

/* SOUND */

document
.getElementById("soundBtn")
.addEventListener(
"click",
function(){

state.sound =  
    !state.sound;  


  save();  


  beep(  
    500,  
    0.08  
  );  

}

);

/* RESET */

document
.getElementById(
   .addEventListener(
    "click",
    resetGame
  );


/* PAUSE */

document
  .getElementById("pauseBtn")
  .addEventListener(
    "click",
    pauseGame
  );


/* INTERACT */

document
  .getElementById("interactBtn")
  .addEventListener(
    "click",
    interact
  );


/* LEFT */

document
  .getElementById("leftBtn")
  .addEventListener(
    "click",
    function(){
      move(-1);
    }
  );


/* RIGHT */

document
  .getElementById("rightBtn")
  .addEventListener(
    "click",
    function(){
      move(1);
    }
  );


/* ================= KEYBOARD ================= */

document.addEventListener(
  "keydown",
  function(event){

    if(
      event.key === "ArrowLeft" ||
      event.key === "a"
    ){

      move(-1);

    }


    if(
      event.key === "ArrowRight" ||
      event.key === "d"
    ){

      move(1);

    }


    if(
      event.key === " " ||
      event.key === "Enter"
    ){

      const game =
        document.getElementById("game");

      if(
        game &&
        game.classList.contains("active")
      ){

        interact();

      }

    }


    if(event.key === "Escape"){

      closeDialog();

    }

  }
);


/* ================= TOUCH / HOLD ================= */

function holdButton(
  button,
  direction
){

  let interval = null;


  function start(event){

    if(event){

      event.preventDefault();

    }


    move(direction);


    clearInterval(interval);


    interval =
      setInterval(
        function(){

          move(direction);

        },
        140
      );

  }


  function stop(event){

    if(event){

      event.preventDefault();

    }


    clearInterval(interval);

    interval = null;

  }


  button.addEventListener(
    "pointerdown",
    start
  );


  button.addEventListener(
    "pointerup",
    stop
  );


  button.addEventListener(
    "pointercancel",
    stop
  );


  button.addEventListener(
    "pointerleave",
    stop
  );

}


/* ================= HOLD CONTROLS ================= */

const leftButton =
  document.getElementById("leftBtn");

const rightButton =
  document.getElementById("rightBtn");


if(leftButton){

  holdButton(
    leftButton,
    -1
  );

}


if(rightButton){

  holdButton(
    rightButton,
    1
  );

}


/* ================= INITIALIZE ================= */

updateUI();

showScreen("menu");
