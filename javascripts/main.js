function getDefaultSave() {
  return {
    coins: new Decimal(0),
    prestiges: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
    bestPrestigeTier: -1,
    tick: new Decimal(0),
    log: "",
    tps: 1
  }
}
var data = getDefaultSave()

var prestigeNames = ["Nanoprestige","Microprestige","Miniprestige","Small Prestige","Partial Prestige","Full Prestige","Multiprestige","Hyperprestige","Ultraprestige","Final Prestige"]

var auto = true
var speedy = false

function getGain() {
  var gain = new Decimal(1);
  data.prestiges.forEach(function(el) {
    gain = gain.times(new Decimal(1).plus(el));
  })
  return gain;
}

function getRequirement(id) {
  if (id === 0) {
    return Decimal.floor(Decimal.pow(1.5, data.prestiges[0]).times(10));
  } else {
    return Decimal.pow(id + 1, data.prestiges[id].plus(1))
  }
}

function canActivatePrestige(id) {
  if (id === 0) {
    return (data.coins.sub(getRequirement(0)).gte(0));
  } else {
    return data.prestiges[id - 1].sub(getRequirement(id)).gte(0);
  }
}

function activatePrestige(id) {
  let prestiged = false
  let milestone = false
  if (canActivatePrestige(id)) {
    prestiged = true
    data.coins = new Decimal(0);
    for (var i = 0; i < id; i++) {
      data.prestiges[i] = new Decimal(0);
    }
    data.prestiges[id] = data.prestiges[id].plus(1);
    if (id>data.bestPrestigeTier) {
      data.bestPrestigeTier = id
      milestone = true
    }
  }
  if (!auto) draw();
  return [prestiged,milestone];
}

function pushLog(text) {
  let log = document.getElementById("log")
  let lines = log.innerHTML.split("\n")
  lines.push(text)
  if (lines.length > 50) lines = lines.slice(-50)
  data.log = lines.join("\n")
  let scroll = log.scrollHeight - log.clientHeight <= log.scrollTop + 1
  draw()
  if (scroll) log.scrollTop = log.scrollHeight
}

function tick() {
  if (speedy) {
    let gain = getGain()
    let ticksToSkip = Decimal.max(1,Decimal.ceil(getRequirement(0).minus(data.coins).div(gain)))
    data.coins = data.coins.plus(gain.times(ticksToSkip))
    data.tick = data.tick.plus(ticksToSkip)
  }
  else {
    data.coins = data.coins.plus(getGain());
    data.tick = data.tick.plus(1)
  }
  if (auto) {
    for (i = 9; i >= 0; i--) {
      let result = activatePrestige(i)
      if (result[0]) {
        if (result[1]) {
          pushLog(`Reached ${prestigeNames[i]} for the first time at tick ${formatValue(data.tick)}`)
          if (i>1) pushLog(`Will not log ${prestigeNames[i-2]}s from now on`)
        }
        else if (data.bestPrestigeTier-i<2) pushLog(`Did a ${prestigeNames[i]} at tick ${formatValue(data.tick)}`)
        i = 10
      }
    }
  }
  draw()
  setTimeout(tick,1000/data.tps);
}

function draw() {
  document.getElementById("coins").innerHTML = formatValue(data.coins);
  document.getElementById("gain").innerHTML = formatValue(getGain());
  document.getElementById("tick").innerHTML = formatValue(data.tick)
  document.getElementById("auto").innerHTML = `Auto play: ${auto?"On":"Off"}`
  document.getElementById("speedy").innerHTML = speedy?"Nevermind stop it.":"Fuck it just reach nanoprestige for me ASAP."
  document.getElementById("log").innerHTML = data.log
  data.prestiges.forEach(function(el, i) {
    document.getElementById("tier" + (i + 1) + "cost").innerHTML = formatValue(getRequirement(i));
    document.getElementById("tier" + (i + 1) + "a").innerHTML = formatValue(el);
    document.getElementById("tier" + (i + 1) + "mul").innerHTML = "x" + formatValue(el.plus(1));
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

function changeTPS() {
  let changeTo = prompt("Change ticks per second to?")
  if (!isNaN(changeTo)) data.tps = changeTo
  else alert("I don't think there is a number in that...")
}

// From geometry idle, what a piece of art
function stringToSave(newSave, base) {
	var keySet = Object.keys(base);
	for (var i = 0; i < keySet.length; i++){
		if(!newSave.hasOwnProperty(keySet[i])) {
			newSave[keySet[i]] = base[keySet[i]];
		}
		else {
			if(base[keySet[i]] instanceof Decimal) {
				newSave[keySet[i]] = new Decimal(newSave[keySet[i]]);
			}
			else if(Object.keys(newSave[keySet[i]]).length > 1) {
				newSave[keySet[i]] = stringToSave(newSave[keySet[i]], base[keySet[i]]);
			}
		}
	}
	return newSave;
}

window.addEventListener("load", function() {
  if (localStorage.SHITPOST) {
    if (confirm("Load the save?")) data = stringToSave(JSON.parse(localStorage.SHITPOST),getDefaultSave())
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
  setInterval(save,10000)
  console.log("interval loaded")
  tick()
})