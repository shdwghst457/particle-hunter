// Particle Hunter UI
// Handles rendering, user interactions, and UI updates

// Current round state
var currentTokens = [];
var currentSentence = null;
var picked = new Set();
var roundScored = false;

// Show error message
function showErr(msg) {
  var el = document.getElementById("err");
  el.textContent = "Script error: " + msg;
  el.className = "show";
}

// Update level pill
function updatePill() {
  var levelName = getLevelName(state.level);
  document.getElementById("modePill").textContent = "Level " + state.level + ": " + levelName;
}

// Render notes list
function renderNotes(items) {
  var block = document.getElementById("notesBlock");
  var list = document.getElementById("notesList");
  list.innerHTML = "";

  if (!items.length) {
    block.style.display = "none";
    return;
  }

  for (var i = 0; i < items.length; i++) {
    var li = document.createElement("li");
    li.textContent = items[i];
    list.appendChild(li);
  }
  block.style.display = "block";
}

// Build unlocked notes
function buildUnlockedNotes() {
  var keys = [];
  for (var k in state.perGlossSeen) {
    if (state.perGlossSeen[k]) keys.push(k);
  }

  var order = MULTI.concat(SINGLE);
  keys.sort(function(a, b) {
    return order.indexOf(a) - order.indexOf(b);
  });

  var out = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    out.push(key + " = " + (GLOSS[key] || "particle"));
  }
  return out;
}

// Render my notes
function renderMyNotes() {
  var list = document.getElementById("myNotesList");
  list.innerHTML = "";
  var all = buildUnlockedNotes();

  if (!all.length) {
    var li = document.createElement("li");
    li.textContent = "No particles unlocked yet. Complete rounds to learn!";
    list.appendChild(li);
    return;
  }

  for (var i = 0; i < all.length; i++) {
    var li2 = document.createElement("li");
    li2.textContent = all[i];
    list.appendChild(li2);
  }
}

// Reset next button styling
function resetNextBtn() {
  var n = document.getElementById("nextBtn");
  n.classList.remove("next-success");
  n.classList.remove("next-warn");
}

// Clear accuracy pills
function clearAccPills() {
  var pills = document.querySelectorAll("#stats .pill");
  for (var i = 0; i < pills.length; i++) {
    var txt = (pills[i].textContent || "").trim();
    if (txt.indexOf("Acc ") === 0 || txt.indexOf("Streak") === 0) {
      pills[i].remove();
    }
  }
}

// Sync UI state
function syncUI() {
  document.body.classList.toggle("noHover", !state.hover);
  document.getElementById("revealBtn").disabled = state.strict;
  document.getElementById("hoverHints").checked = !!state.hover;
  document.getElementById("strictMode").checked = !!state.strict;
  document.getElementById("showCounts").checked = !!state.showCounts;
  document.getElementById("persistNotes").checked = !!state.persistNotes;

  updatePill();
  document.getElementById("debugCard").style.display = "block";
  document.getElementById("settingsCard").style.display = "block";
  document.getElementById("debugState").textContent = state.debugMode ? "ON" : "OFF";

  document.getElementById("myNotesBlock").style.display = state.myNotesOpen ? "block" : "none";
  document.getElementById("toggleMyNotesBtn").textContent = state.myNotesOpen ? "Hide my notes" : "Show my notes";

  // Update debug info
  var dbg = document.getElementById("debugArea");
  if (state.showCounts) {
    var count = currentTokens.filter(function(t) { return t.isParticle; }).length;
    var unlocked = getUnlockedParticles().join(", ");
    dbg.textContent = "v1.0.0 | Level " + state.level + " | Particles in scope: " + unlocked + "\nCurrent sentence particles: " + count + " | Streak: " + state.perfectStreak + "/5";
  } else {
    dbg.textContent = "v1.0.0 | Level " + state.level + " (" + getLevelName(state.level) + ")";
  }
}

// Render sentence
function renderSentence(force) {
  if (typeof force === "undefined") force = false;

  clearAccPills();
  var bd = document.getElementById("breakdownBox");
  if (bd) bd.style.display = "none";
  var meaningBox = document.getElementById("meaningBox");
  if (meaningBox) meaningBox.classList.remove("show");

  // Get sentence
  if (!force) {
    currentSentence = nextSentence();
  } else {
    currentSentence = getCurrentSentence();
  }

  if (!currentSentence) {
    document.getElementById("sentence").textContent = "(no sentences)";
    return;
  }

  var sentence = currentSentence.text;
  var hardMode = state.level >= 3;

  // Tokenize
  currentTokens = annotate(sentence, hardMode, currentSentence.exceptions || [], state.level);
  picked.clear();
  roundScored = false;

  // Render tokens
  var container = document.getElementById("sentence");
  container.innerHTML = "";

  for (var i = 0; i < currentTokens.length; i++) {
    (function(idx) {
      var token = currentTokens[idx];
      var span = document.createElement("span");
      span.className = "token";
      span.textContent = token.text;

      span.addEventListener("pointerdown", function() {
        if (roundScored) return;
        if (span.classList.contains("good") || span.classList.contains("bad") || span.classList.contains("miss")) return;

        if (picked.has(idx)) {
          picked.delete(idx);
          span.classList.remove("picked");
        } else {
          picked.add(idx);
          span.classList.add("picked");
        }
      });

      container.appendChild(span);
    })(i);
  }

  // Reset UI
  document.getElementById("checkBtn").disabled = false;
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("showBreakdownBtn").disabled = true;
  resetNextBtn();
  document.getElementById("cargoBanner").classList.remove("show");

  syncUI();
}

// Show sentence meaning
function showMeaning() {
  var meaningBox = document.getElementById("meaningBox");
  if (!currentSentence) return;

  var meaning = MEANINGS[currentSentence.text];
  if (meaning) {
    meaningBox.textContent = meaning;
    meaningBox.classList.add("show");
  }
}

// Score current round
function performScore() {
  if (roundScored) return;
  roundScored = true;

  var result = scoreRound(currentTokens, picked);
  var spans = document.querySelectorAll("#sentence .token");

  // Update token colors
  for (var i = 0; i < currentTokens.length; i++) {
    var token = currentTokens[i];
    var isPicked = picked.has(i);

    if (token.isParticle && isPicked) {
      spans[i].classList.add("good");
    } else if (!token.isParticle && isPicked) {
      spans[i].classList.add("bad");
    } else if (token.isParticle && !isPicked) {
      spans[i].classList.add("miss");
    }
  }

  // Show cargo banner if missed particles
  if (result.fn > 0 && !state.cargoShown) {
    document.getElementById("cargoBanner").classList.add("show");
    state.cargoShown = true;
  }

  // Show meaning
  showMeaning();

  // Show new glosses
  if (state.persistNotes) {
    renderNotes(state.glossLog);
  } else {
    renderNotes(result.newGlosses);
  }

  if (state.myNotesOpen) {
    renderMyNotes();
  }

  // Update stats
  var statsDiv = document.getElementById("stats");
  var accPill = document.createElement("span");
  accPill.className = "pill";
  accPill.textContent = "Acc " + result.accuracy.toFixed(1) + "%";
  statsDiv.appendChild(accPill);

  var streakPill = document.createElement("span");
  streakPill.className = "pill";
  streakPill.textContent = "Streak: " + state.perfectStreak + "/5";
  statsDiv.appendChild(streakPill);

  // Show level up message if applicable
  if (result.leveledUp) {
    var banner = document.getElementById("levelBanner");
    banner.textContent = "🎉 Level " + state.level + " unlocked: " + getLevelName(state.level) + "!";
    banner.classList.add("show");
    setTimeout(function() {
      banner.classList.remove("show");
    }, 5000);
  }

  // Enable buttons
  document.getElementById("checkBtn").disabled = true;
  document.getElementById("nextBtn").disabled = false;
  document.getElementById("showBreakdownBtn").disabled = false;

  resetNextBtn();
  if (result.isPerfect) {
    document.getElementById("nextBtn").classList.add("next-success");
  } else {
    document.getElementById("nextBtn").classList.add("next-warn");
  }

  save();
  syncUI();
}

// Reveal answer
function revealAnswer() {
  if (roundScored) return;
  roundScored = true;

  var spans = document.querySelectorAll("#sentence .token");
  for (var i = 0; i < currentTokens.length; i++) {
    if (currentTokens[i].isParticle) {
      spans[i].classList.add("miss");
    }
  }

  showMeaning();

  document.getElementById("checkBtn").disabled = true;
  document.getElementById("nextBtn").disabled = false;
  resetNextBtn();
  document.getElementById("nextBtn").classList.add("next-warn");
}

// Reset round
function resetRound() {
  picked.clear();
  roundScored = false;

  var nodes = document.querySelectorAll("#sentence .token");
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove("picked", "good", "bad", "miss");
  }

  document.getElementById("cargoBanner").classList.remove("show");
  var bd = document.getElementById("breakdownBox");
  if (bd) bd.style.display = "none";
  var meaningBox = document.getElementById("meaningBox");
  if (meaningBox) meaningBox.classList.remove("show");
  resetNextBtn();
  document.getElementById("showBreakdownBtn").disabled = true;
  document.getElementById("checkBtn").disabled = false;
  document.getElementById("nextBtn").disabled = true;
}

// Show breakdown with grouped train cars
function showBreakdown() {
  var box = document.getElementById("breakdownBox");
  var content = document.getElementById("breakdownContent");

  if (box.style.display === "block") {
    box.style.display = "none";
    return;
  }

  if (!currentSentence) return;

  // Group tokens into train cars
  var cars = groupIntoTrainCars(currentTokens, currentSentence.text);

  var html = "";
  for (var i = 0; i < cars.length; i++) {
    var car = cars[i];
    var carText = car.words.join("");
    var particleText = car.particle ? car.particle : "";
    var fullText = carText + particleText;

    var carClass = car.isEngine ? "train-car engine" : "train-car";

    html += '<div class="' + carClass + '">';
    html += '<div class="train-car-text">' + fullText + '</div>';
    html += '<div class="train-car-role">' + car.role + '</div>';

    if (car.meaning) {
      html += '<div class="train-car-meaning">' + car.meaning + '</div>';
    }

    // Show は reveal if applicable
    if (car.waReveal) {
      html += '<div class="hidden-particle">💡 ' + carText + 'は hides ' + carText + car.waReveal.hidden + ' (' + car.waReveal.explanation + ')</div>';
    }

    html += '</div>';
  }

  content.innerHTML = html;
  box.style.display = "block";
}

// Copy debug snapshot
function copyDebugSnapshot() {
  var payload = {
    version: "v1.0.0",
    sentence: currentSentence ? currentSentence.text : null,
    settings: state,
    tokens: currentTokens.map(function(t) {
      return {t: t.text, p: t.isParticle};
    }),
    picked: Array.from(picked),
    glossLog: state.glossLog
  };

  var text = JSON.stringify(payload, null, 2);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      document.getElementById("debugArea").textContent = "Copied debug snapshot!";
      setTimeout(syncUI, 2000);
    }).catch(function() {
      document.getElementById("debugArea").textContent = "Copy failed. Here it is:\n" + text;
    });
  } else {
    document.getElementById("debugArea").textContent = "Clipboard not available. Here it is:\n" + text;
  }
}

// Bind settings
function bindSettings() {
  ["hoverHints", "strictMode", "showCounts", "persistNotes"].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;

    var stateKey = id.replace("Hints", "").replace("Mode", "");
    if (id === "hoverHints") stateKey = "hover";
    if (id === "strictMode") stateKey = "strict";

    el.addEventListener("change", function(e) {
      state[stateKey] = !!e.target.checked;
      save();
      syncUI();
    });
  });
}

// Bind controls
function bindControls() {
  document.getElementById("checkBtn").onclick = performScore;
  document.getElementById("nextBtn").onclick = function() {
    renderSentence(false);
  };
  document.getElementById("revealBtn").onclick = revealAnswer;
  document.getElementById("resetBtn").onclick = resetRound;
  document.getElementById("showBreakdownBtn").onclick = showBreakdown;

  document.getElementById("toggleParticlesBtn").onclick = function() {
    var card = document.getElementById("particleListCard");
    card.style.display = card.style.display === "none" ? "block" : "none";
  };

  document.getElementById("toggleMyNotesBtn").onclick = function() {
    state.myNotesOpen = !state.myNotesOpen;
    save();
    if (state.myNotesOpen) renderMyNotes();
    syncUI();
  };

  document.getElementById("factoryBtn").addEventListener("click", factoryReset);
  document.getElementById("copyDebugBtn").addEventListener("click", copyDebugSnapshot);

  document.getElementById("toggleDebugBtn").onclick = function() {
    state.debugMode = !state.debugMode;
    save();
    syncUI();
  };

  // Keyboard shortcuts
  document.addEventListener("keydown", function(e) {
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea") return;

    var k = (e.key || "").toLowerCase();

    if (k === " ") {
      e.preventDefault();
      if (!document.getElementById("checkBtn").disabled) {
        performScore();
      } else if (!document.getElementById("nextBtn").disabled) {
        renderSentence(false);
      }
      return;
    }

    if (k === "c" && !document.getElementById("checkBtn").disabled) {
      performScore();
    }

    if (k === "n" && !document.getElementById("nextBtn").disabled) {
      renderSentence(false);
    }
  });

  // Start button
  document.getElementById("startBtn").onclick = function() {
    state.introSeen = true;
    save();
    document.getElementById("introCard").style.display = "none";
    renderSentence(true);
  };
}

// Initialize UI
function initUI() {
  document.getElementById("gameCard").style.display = "block";
  document.getElementById("settingsCard").style.display = "block";
  document.getElementById("debugCard").style.display = "block";

  if (state.introSeen) {
    document.getElementById("introCard").style.display = "none";
  }

  bindSettings();
  bindControls();
  syncUI();

  if (state.introSeen) {
    renderSentence(true);
  }
}

// Boot
function boot() {
  try {
    initGame();
    initUI();
  } catch (e) {
    console.error(e);
    showErr(e.message || String(e));
  }
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
