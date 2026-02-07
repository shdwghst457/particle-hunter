// Particle Hunter Tokenizer
// Handles particle detection and tokenization

// Optional external tokenizer hook
function tokenizerHook(sentence) {
  return null;
}

// Build unified reserved ranges from all exception sources
function buildReservedRanges(sentence, sentenceExceptions) {
  var reserved = [];
  var used = new Array(sentence.length).fill(false);

  // Add word exceptions (particles within words)
  for (var wi = 0; wi < WORD_EXCEPTIONS.length; wi++) {
    var word = WORD_EXCEPTIONS[wi];
    var idx = 0;
    while (true) {
      var pos = sentence.indexOf(word, idx);
      if (pos === -1) break;
      reserved.push({start: pos, end: pos + word.length});
      for (var k = 0; k < word.length; k++) {
        used[pos + k] = true;
      }
      idx = pos + word.length;
    }
  }

  // Add demonstrative exceptions (この, その, etc.)
  for (var i = 0; i < sentence.length; i++) {
    for (var d = 0; d < DEMO_EXCEPTIONS.length; d++) {
      var demo = DEMO_EXCEPTIONS[d];
      if (sentence.startsWith(demo, i)) {
        reserved.push({start: i, end: i + demo.length});
        for (var k = 0; k < demo.length; k++) {
          used[i + k] = true;
        }
        i += demo.length - 1;
        break;
      }
    }
  }

  // Add sequence exceptions (です, でした)
  for (var j = 0; j < sentence.length; j++) {
    for (var s = 0; s < SEQ_EXCEPTIONS.length; s++) {
      var seq = SEQ_EXCEPTIONS[s];
      if (sentence.startsWith(seq, j)) {
        reserved.push({start: j, end: j + seq.length});
        for (var k2 = 0; k2 < seq.length; k2++) {
          used[j + k2] = true;
        }
        j += seq.length - 1;
        break;
      }
    }
  }

  // Add sentence-specific exceptions
  if (sentenceExceptions) {
    for (var e = 0; e < sentenceExceptions.length; e++) {
      reserved.push(sentenceExceptions[e]);
      for (var p = sentenceExceptions[e].start; p < sentenceExceptions[e].end; p++) {
        used[p] = true;
      }
    }
  }

  return {reserved: reserved, used: used};
}

// Check if a range overlaps with any reserved range
function isRangeReserved(start, end, reserved) {
  for (var k = 0; k < reserved.length; k++) {
    var ex = reserved[k];
    if (Math.max(start, ex.start) < Math.min(end, ex.end)) {
      return true;
    }
  }
  return false;
}

// Get particles in scope for current level
function getParticlesInScope(level) {
  if (level === 1) {
    // Level 1: が, を only (core subject/object markers)
    return ["が", "を"];
  } else if (level === 2) {
    // Level 2: add に, で, へ (target, means, direction)
    return ["が", "を", "に", "で", "へ"];
  } else if (level === 3) {
    // Level 3: add は, と, も, の (topic + connectors)
    return ["が", "を", "に", "で", "へ", "は", "と", "も", "の"];
  } else {
    // Level 4: all particles including multi-char
    return ALL;
  }
}

// Main tokenization function
function annotate(sentence, hardMode, sentenceExceptions, level) {
  // Check for external tokenizer override
  var ext = tokenizerHook(sentence);
  if (Array.isArray(ext)) return ext;

  // Build unified reserved ranges
  var ranges = buildReservedRanges(sentence, sentenceExceptions || []);
  var reserved = ranges.reserved;
  var used = ranges.used;

  // Get particles in scope for current level
  var particlesInScope = getParticlesInScope(level);
  var multiInScope = MULTI.filter(function(p) {
    return particlesInScope.indexOf(p) > -1;
  });
  var singleInScope = SINGLE.filter(function(p) {
    return particlesInScope.indexOf(p) > -1;
  });

  var marks = [];

  // Mark multi-character particles first
  for (var x = 0; x < sentence.length; x++) {
    for (var mi = 0; mi < multiInScope.length; mi++) {
      var multi = multiInScope[mi];
      if (sentence.startsWith(multi, x)) {
        if (isRangeReserved(x, x + multi.length, reserved)) continue;

        var ok = true;
        for (var k = 0; k < multi.length; k++) {
          if (used[x + k]) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;

        for (var k2 = 0; k2 < multi.length; k2++) {
          used[x + k2] = true;
        }
        marks.push({start: x, end: x + multi.length, text: multi});
        x += multi.length - 1;
        break;
      }
    }
  }

  // Mark single-character particles
  for (var y = 0; y < sentence.length; y++) {
    if (used[y]) continue;
    var ch = sentence[y];
    if (singleInScope.indexOf(ch) > -1 && !isRangeReserved(y, y + 1, reserved)) {
      used[y] = true;
      marks.push({start: y, end: y + 1, text: ch});
    }
  }

  // Sort marks by position
  marks.sort(function(a, b) {
    return a.start - b.start;
  });

  // Build token array
  var tokens = [];
  var idx = 0;
  for (var m = 0; m < marks.length; m++) {
    var mark = marks[m];

    // Add non-particle text before this mark
    if (idx < mark.start) {
      var chunk = sentence.slice(idx, mark.start);
      if (hardMode) {
        // Character-level splitting for levels 3-4
        for (var ci = 0; ci < chunk.length; ci++) {
          tokens.push({text: chunk[ci], isParticle: false});
        }
      } else {
        // Grouped tokens for levels 1-2
        tokens.push({text: chunk, isParticle: false});
      }
    }

    // Add the particle
    tokens.push({text: sentence.slice(mark.start, mark.end), isParticle: true});
    idx = mark.end;
  }

  // Add remaining text
  if (idx < sentence.length) {
    var tail = sentence.slice(idx);
    if (hardMode) {
      for (var ti = 0; ti < tail.length; ti++) {
        tokens.push({text: tail[ti], isParticle: false});
      }
    } else {
      tokens.push({text: tail, isParticle: false});
    }
  }

  return tokens;
}

// Group tokens into train cars (consecutive non-particles + their particle)
function groupIntoTrainCars(tokens, sentence) {
  var cars = [];
  var currentCar = {words: [], particle: null, role: null, meaning: ""};

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (token.isParticle) {
      currentCar.particle = token.text;
      currentCar.role = GLOSS[token.text] || "particle";

      // Check for は reveals
      var carText = currentCar.words.join("") + token.text;
      if (WA_REVEALS[carText]) {
        currentCar.waReveal = WA_REVEALS[carText];
      }

      cars.push(currentCar);
      currentCar = {words: [], particle: null, role: null, meaning: ""};
    } else {
      currentCar.words.push(token.text);
    }
  }

  // Handle remaining words (the engine - no particle)
  if (currentCar.words.length > 0) {
    currentCar.role = "engine (verb/adjective)";
    currentCar.isEngine = true;
    cars.push(currentCar);
  }

  // Look up meanings for each car
  for (var c = 0; c < cars.length; c++) {
    var car = cars[c];
    var text = car.words.join("");
    if (VOCAB[text]) {
      car.meaning = VOCAB[text];
    } else {
      // Try to find meaning by looking up individual words
      var meanings = [];
      for (var w = 0; w < car.words.length; w++) {
        if (VOCAB[car.words[w]]) {
          meanings.push(VOCAB[car.words[w]]);
        }
      }
      if (meanings.length > 0) {
        car.meaning = meanings.join(" + ");
      }
    }
  }

  return cars;
}
