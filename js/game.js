// Particle Hunter Game Logic
// Handles game state, scoring, progression, and sentence selection

// State persistence key
var KEY = "phSettingsV1";
var STATE_VERSION = 1;

// Game state
var state = {
  version: STATE_VERSION,

  // User preferences (survive factory reset)
  hover: false,
  strict: false,
  showCounts: true,
  persistNotes: false,
  debugMode: true,

  // Session progress
  level: 1,
  perfectStreak: 0,
  sentenceBank: [],
  currentIndex: 0,

  // Learning analytics
  particleMisses: {}, // Track misses per particle
  perGlossSeen: {},
  glossLog: [],

  // UI state
  cargoShown: false,
  introSeen: false,
  myNotesOpen: false,

  _storageDisabled: false
};

// Save state to localStorage
function save() {
  if (state._storageDisabled) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    state._storageDisabled = true;
  }
}

// Load state from localStorage with migration
function load() {
  try {
    var s = localStorage.getItem(KEY);
    if (s) {
      var loaded = JSON.parse(s);

      // Check version and migrate if needed
      if (!loaded.version || loaded.version < STATE_VERSION) {
        // Migration: reset progress but keep preferences
        var prefs = {
          hover: loaded.hover || false,
          strict: loaded.strict || false,
          showCounts: loaded.showCounts !== false,
          persistNotes: loaded.persistNotes || false,
          debugMode: loaded.debugMode !== false
        };
        Object.assign(state, prefs);
        state.version = STATE_VERSION;
        save();
      } else {
        Object.assign(state, loaded);
      }
    }
  } catch (e) {
    console.error("Failed to load state:", e);
  }
}

// Factory reset
function factoryReset() {
  if (!confirm("Factory Reset? This will erase all progress but keep your preferences.")) return;

  // Save preferences
  var prefs = {
    hover: state.hover,
    strict: state.strict,
    showCounts: state.showCounts,
    persistNotes: state.persistNotes,
    debugMode: state.debugMode
  };

  try {
    localStorage.removeItem(KEY);
  } catch (e) {}

  // Reload with preferences
  location.reload();
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  var shuffled = array.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// Get weighted shuffle based on particle misses
function weightedShuffle(bank) {
  if (Object.keys(state.particleMisses).length === 0) {
    return shuffleArray(bank);
  }

  // Calculate weights for each sentence based on particles it contains
  var weighted = [];
  for (var i = 0; i < bank.length; i++) {
    var item = bank[i];
    var weight = 1;

    // Tokenize to find particles
    var testTokens = annotate(item.text, false, item.exceptions || [], state.level);
    for (var t = 0; t < testTokens.length; t++) {
      if (testTokens[t].isParticle) {
        var particle = testTokens[t].text;
        var misses = state.particleMisses[particle] || 0;
        // Add weight based on miss count (more misses = higher weight)
        weight += misses * 0.5;
      }
    }

    weighted.push({item: item, weight: weight});
  }

  // Sort by weight (descending) and add some randomness
  weighted.sort(function(a, b) {
    return (b.weight + Math.random() * 2) - (a.weight + Math.random() * 2);
  });

  return weighted.map(function(w) { return w.item; });
}

// Get sentence bank for current level
function getCurrentBank() {
  var base = [];
  if (state.level === 1) {
    base = CORE.concat(LEVEL1_EXT);
  } else if (state.level === 2) {
    base = CORE.concat(LEVEL1_EXT).concat(TRAPS).concat(LEVEL2_EXT);
  } else if (state.level === 3) {
    base = LEVEL3_EXT;
  } else if (state.level === 4) {
    base = LEVEL3_EXT.concat(TRAPS).concat(LEVEL4_EXT);
  }
  return base;
}

// Initialize or refresh sentence bank
function refreshBank() {
  var bank = getCurrentBank();
  state.sentenceBank = weightedShuffle(bank);
  state.currentIndex = 0;
}

// Get current sentence
function getCurrentSentence() {
  if (state.sentenceBank.length === 0) {
    refreshBank();
  }
  return state.sentenceBank[state.currentIndex];
}

// Move to next sentence
function nextSentence() {
  state.currentIndex++;
  if (state.currentIndex >= state.sentenceBank.length) {
    refreshBank();
  }
  return getCurrentSentence();
}

// Track particle miss
function trackParticleMiss(particle) {
  if (!state.particleMisses[particle]) {
    state.particleMisses[particle] = 0;
  }
  state.particleMisses[particle]++;
}

// Decay particle miss counts (so old mistakes fade)
function decayMissCounts() {
  for (var p in state.particleMisses) {
    if (state.particleMisses[p] > 0) {
      state.particleMisses[p] = Math.max(0, state.particleMisses[p] - 0.1);
    }
  }
}

// Level up logic
function checkLevelUp(isPerfect) {
  if (isPerfect) {
    state.perfectStreak++;
    if (state.perfectStreak >= 5 && state.level < 4) {
      state.level++;
      state.perfectStreak = 0;
      refreshBank(); // Get new bank for new level
      decayMissCounts(); // Decay miss counts on level up
      return true; // Level up occurred
    }
  } else {
    state.perfectStreak = 0;
  }
  return false; // No level up
}

// Score a round
function scoreRound(tokens, picked) {
  var tp = 0, fp = 0, fn = 0;
  var newGlosses = [];
  var missedParticles = [];

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var isPicked = picked.has(i);

    if (token.isParticle && isPicked) {
      // True positive
      tp++;

      // Track newly seen particle
      if (!state.perGlossSeen[token.text]) {
        var gloss = GLOSS[token.text] || "particle";
        newGlosses.push(token.text + " = " + gloss);
        state.perGlossSeen[token.text] = true;
      }
    } else if (!token.isParticle && isPicked) {
      // False positive
      fp++;
    } else if (token.isParticle && !isPicked) {
      // False negative (missed particle)
      fn++;
      missedParticles.push(token.text);

      // Track miss
      trackParticleMiss(token.text);

      // Still add to glossary
      if (!state.perGlossSeen[token.text]) {
        var gloss = GLOSS[token.text] || "particle";
        newGlosses.push(token.text + " = " + gloss);
        state.perGlossSeen[token.text] = true;
      }
    }
  }

  var trueParticles = tokens.filter(function(t) { return t.isParticle; }).length;
  var acc = trueParticles === 0
    ? (picked.size === 0 ? 100 : 0)
    : (tp / (tp + fp + fn || 1)) * 100;

  var isPerfect = fp === 0 && fn === 0;

  // Update glossary
  if (state.persistNotes) {
    for (var g = 0; g < newGlosses.length; g++) {
      if (state.glossLog.indexOf(newGlosses[g]) === -1) {
        state.glossLog.push(newGlosses[g]);
      }
    }
  }

  // Check for level up
  var leveledUp = checkLevelUp(isPerfect);

  return {
    tp: tp,
    fp: fp,
    fn: fn,
    accuracy: acc,
    isPerfect: isPerfect,
    newGlosses: newGlosses,
    missedParticles: missedParticles,
    leveledUp: leveledUp
  };
}

// Get level name
function getLevelName(level) {
  var names = ["", "Beginner", "Intermediate", "Advanced", "Expert"];
  return names[level] || "Unknown";
}

// Get particles unlocked at current level
function getUnlockedParticles() {
  return getParticlesInScope(state.level);
}

// Initialize game on boot
function initGame() {
  load();
  if (state.sentenceBank.length === 0) {
    refreshBank();
  }
}
