var data = {
  coins: 0,
  prestiges: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bestPrestigeTier: -1,
  tick: 0,
  log: "",
};

var prestigeNames = ["Nanoprestige","Microprestige","Miniprestige","Small Prestige","Partial Prestige","Full Prestige","Multiprestige","Hyperprestige","Ultraprestige","Final Prestige"]

var auto = true
var speedy = false

function getGain() {
  var gain = 1;
  data.prestiges.forEach(function(el) {
    gain *= 1 + el;
  })
  return gain;
}

function getRequirement(id) {
  if (id === 0) {
    return Math.floor(Math.pow(1.5, data.prestiges[0]) * 10);
  } else {
    return Math.pow(id + 1, data.prestiges[id] + 1)
  }
}

function canActivatePrestige(id) {
  if (id === 0) {
    return (data.coins >= getRequirement(0));
  } else {
    return (data.prestiges[id - 1] >= getRequirement(id));
  }
}

function activatePrestige(id) {
  let prestiged = false
  let milestone = false
  if (canActivatePrestige(id)) {
    prestiged = true
    data.coins = 0;
    for (var i = 0; i < id; i++) {
      data.prestiges[i] = 0;
    }
    data.prestiges[id]++;
    if (id>data.bestPrestigeTier) {
      data.bestPrestigeTier = id
      milestone = true
    }
  }
  draw();
  return [prestiged,milestone];
}

function pushLog(text) {
  let log = document.getElementById("log")
  let scroll = log.scrollHeight - log.clientHeight <= log.scrollTop + 1
  data.log += text + "\n"
  draw()
  if (scroll) log.scrollTop = log.scrollHeight
}

function tick() {
  if (speedy) {
    let gain = getGain()
    let ticksToSkip = Math.ceil((getRequirement(0)-data.coins)/gain)
    data.coins += gain*ticksToSkip
    data.tick += ticksToSkip
  }
  else {
    data.coins += getGain();
    data.tick++
  }
  if (auto) {
    for (i = 10; i >= 0; i--) {
      let result = activatePrestige(i)
      if (result[0]) {
        if (result[1]) pushLog(`Reached ${prestigeNames[i]} for the first time at tick ${data.tick.toString()}`)
        else pushLog(`Did a ${prestigeNames[i]} at tick ${data.tick.toString()}`)
        i = 10
      }
    }
  }
  setTimeout(tick,1000);
}

function draw() {
  document.getElementById("coins").innerHTML = data.coins;
  document.getElementById("gain").innerHTML = getGain();
  document.getElementById("tick").innerHTML = data.tick.toString()
  document.getElementById("auto").innerHTML = `Auto play: ${auto?"On":"Off"}`
  document.getElementById("speedy").innerHTML = speedy?"Nevermind stop it.":"Fuck it just reach the end for me ASAP."
  document.getElementById("log").innerHTML = data.log
  data.prestiges.forEach(function(el, i) {
    document.getElementById("tier" + (i + 1) + "cost").innerHTML = getRequirement(i);
    document.getElementById("tier" + (i + 1) + "a").innerHTML = el;
    document.getElementById("tier" + (i + 1) + "mul").innerHTML = "x" + (el + 1);
    if (canActivatePrestige(i)) {
      document.getElementById("tier" + (i + 1) + "btn").disabled = false;
    } else {
      document.getElementById("tier" + (i + 1) + "btn").disabled = true;
    }
  })
}

function save() {
  localStorage.SHITPOST = JSON.stringify(data);
}

window.addEventListener("load", function() {
  if (localStorage.SHITPOST) {
    if (confirm("Load the save?")) data = JSON.parse(localStorage.SHITPOST)
  }
  save()
  draw();
  log.scrollTop = log.scrollHeight
  for (var i = 0; i < 10; i++) {
    document.getElementById("tier" + (i + 1) + "btn")
      .addEventListener(
        "click",
        (function(n) {
          return (function() {
            activatePrestige(n);
          })
        }(i))
      );
  }
  setInterval(draw,100)
  setTimeout(tick,1000);
  setInterval(save,10000)
  console.log("interval loaded")
})