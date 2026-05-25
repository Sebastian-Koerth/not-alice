// ===== Name Pool =====
const NAMES = [
  "Alice", "Amy", "Anna", "Aria", "Ava",
  "Bella", "Beth", "Bianca", "Blair", "Brooke",
  "Cara", "Chloe", "Clara", "Claire", "Cora",
  "Dana", "Dawn", "Diana", "Dora",
  "Elena", "Ella", "Emily", "Emma", "Eva",
  "Faith", "Fiona", "Flora", "Frances",
  "Gabi", "Gemma", "Grace", "Greta",
  "Hannah", "Hazel", "Helen", "Holly",
  "Ida", "Iris", "Isabel",
  "Jana", "Jane", "Jess", "Jill", "Joan", "Joy", "Julia",
  "Kate", "Kay", "Kim", "Kyra",
  "Laura", "Lea", "Leah", "Lena", "Lilly", "Lisa", "Lora", "Luna",
  "Mara", "Marie", "Maya", "Mia", "Mila", "Molly",
  "Nadia", "Nadine", "Nina", "Nora",
  "Olivia", "Opal",
  "Paige", "Paula", "Pearl", "Petra",
  "Quinn",
  "Rachel", "Rebecca", "Rita", "Rosa", "Ruby",
  "Sadie", "Sara", "Sebastian", "Selma", "Silvia", "Sofia", "Stella", "Sue",
  "Tara", "Tess", "Thea", "Tim", "Tina",
  "Uma",
  "Vera", "Victoria", "Viola", "Vivian",
  "Wendy",
  "Xena",
  "Yara", "Yvonne",
  "Zara", "Zoe",
  // Additional names
  "Abby", "Ada", "Adele", "Agnes", "Aisha",
  "Bea", "Bernadette", "Bonnie", "Brenda",
  "Carmen", "Caroline", "Cassie", "Cecile", "Celeste", "Charlotte",
  "Deborah", "Denise", "Diane",
  "Edith", "Eleanor", "Elise", "Elizabeth", "Elsa",
  "Felicia", "Francesca", "Frieda",
  "Gloria", "Gwen",
  "Harriet", "Heidi", "Helga",
  "Ingrid", "Irene",
  "Jackie", "Jacqueline", "Jamie", "Jean", "Jennifer", "Jessica", "Josie", "June",
  "Karen", "Katherine", "Katja", "Kira", "Klara",
  "Lara", "Lauren", "Leonora", "Lilith", "Linda", "Lotte", "Louise",
  "Madeline", "Maggie", "Margaret", "Maria", "Matilda", "Miriam",
  "Naomi", "Natalia", "Natasha", "Nicole",
  "Pam", "Pamela", "Patricia", "Penelope", "Phoebe", "Priya",
  "Regina", "Rena", "Renata", "Roberta", "Rosie", "Ruth",
  "Sabrina", "Sally", "Sandra", "Sanne", "Sharon", "Sheila", "Simone", "Susan",
  "Tamara", "Tatiana", "Teresa", "Theresa", "Tracy",
  "Ursula",
  "Valentina", "Valerie", "Vanessa", "Veronica",
  "Wilma",
  "Yasmin",
  "Zelda"
];

// ===== Hint Definitions =====
// Each hint: { text, test(name) → true means name SURVIVES (matches the secret) }
// We generate hints that are true for the secret; any candidate for which test() returns false is eliminated.

function vowelCount(name) {
  return (name.match(/[aeiou]/gi) || []).length;
}

function hasDoubleLetter(name) {
  return /(.)\1/i.test(name);
}

function buildHintTemplates(secret) {
  const s = secret.toUpperCase();
  const templates = [];

  // --- Letter-based ---
  for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!s.startsWith(ch)) {
      templates.push({
        type: 'starts-with',
        text: `The name does not start with "${ch}"`,
        test: n => !n.toUpperCase().startsWith(ch)
      });
    }
    if (s.startsWith(ch)) {
      templates.push({
        type: 'starts-with',
        text: `The name starts with "${ch}"`,
        test: n => n.toUpperCase().startsWith(ch)
      });
    }
    if (!s.endsWith(ch)) {
      templates.push({
        type: 'ends-with',
        text: `The name does not end with "${ch}"`,
        test: n => !n.toUpperCase().endsWith(ch)
      });
    }
    if (s.endsWith(ch)) {
      templates.push({
        type: 'ends-with',
        text: `The name ends with "${ch}"`,
        test: n => n.toUpperCase().endsWith(ch)
      });
    }
    if (!s.includes(ch)) {
      templates.push({
        type: 'contains',
        text: `The name contains no "${ch}"`,
        test: n => !n.toUpperCase().includes(ch)
      });
    }
    if (s.includes(ch)) {
      templates.push({
        type: 'contains',
        text: `The name contains the letter "${ch}"`,
        test: n => n.toUpperCase().includes(ch)
      });
    }
  }

  // --- Length-based ---
  const len = secret.length;
  templates.push({
    type: 'length',
    text: `The name has exactly ${len} letter${len !== 1 ? 's' : ''}`,
    test: n => n.length === len
  });
  if (len > 3) {
    templates.push({
      type: 'length',
      text: `The name has more than ${len - 1} letter${len - 1 !== 1 ? 's' : ''}`,
      test: n => n.length > len - 1
    });
  }
  templates.push({
    type: 'length',
    text: `The name has fewer than ${len + 1} letter${len + 1 !== 1 ? 's' : ''}`,
    test: n => n.length < len + 1
  });
  if (len <= 4) {
    templates.push({
      type: 'length',
      text: `The name is short (4 letters or fewer)`,
      test: n => n.length <= 4
    });
  }
  if (len >= 5) {
    templates.push({
      type: 'length',
      text: `The name is long (5 letters or more)`,
      test: n => n.length >= 5
    });
  }

  // --- Vowel-based ---
  const vc = vowelCount(secret);
  templates.push({
    type: 'vowel-count',
    text: `The name has exactly ${vc} vowel${vc !== 1 ? 's' : ''}`,
    test: n => vowelCount(n) === vc
  });
  if (vc >= 2) {
    templates.push({
      type: 'vowel-count',
      text: `The name has at least ${vc} vowel${vc !== 1 ? 's' : ''}`,
      test: n => vowelCount(n) >= vc
    });
  }
  templates.push({
    type: 'vowel-count',
    text: `The name has fewer than ${vc + 1} vowel${vc + 1 !== 1 ? 's' : ''}`,
    test: n => vowelCount(n) < vc + 1
  });

  // --- Double letter ---
  if (hasDoubleLetter(secret)) {
    templates.push({
      type: 'double-letter',
      text: `The name contains a double letter`,
      test: n => hasDoubleLetter(n)
    });
  } else {
    templates.push({
      type: 'double-letter',
      text: `The name has no double letters`,
      test: n => !hasDoubleLetter(n)
    });
  }

  // --- Starts / ends with a vowel ---
  const VOWELS = 'AEIOU';
  if (VOWELS.includes(s[0])) {
    templates.push({
      type: 'starts-vowel',
      text: `The name begins with a vowel`,
      test: n => VOWELS.includes(n[0].toUpperCase())
    });
  } else {
    templates.push({
      type: 'starts-vowel',
      text: `The name does not begin with a vowel`,
      test: n => !VOWELS.includes(n[0].toUpperCase())
    });
  }
  if (VOWELS.includes(s[s.length - 1])) {
    templates.push({
      type: 'ends-vowel',
      text: `The name ends with a vowel`,
      test: n => VOWELS.includes(n[n.length - 1].toUpperCase())
    });
  } else {
    templates.push({
      type: 'ends-vowel',
      text: `The name does not end with a vowel`,
      test: n => !VOWELS.includes(n[n.length - 1].toUpperCase())
    });
  }

  // --- Length comparison to a reference name ---
  const REF_NAME = 'Victoria'; // length 8
  if (secret.length < REF_NAME.length) {
    templates.push({
      type: 'length-ref',
      text: `The name is shorter than "${REF_NAME}"`,
      test: n => n.length < REF_NAME.length
    });
  } else if (secret.length > REF_NAME.length) {
    templates.push({
      type: 'length-ref',
      text: `The name is longer than "${REF_NAME}"`,
      test: n => n.length > REF_NAME.length
    });
  } else {
    templates.push({
      type: 'length-ref',
      text: `The name is the same length as "${REF_NAME}"`,
      test: n => n.length === REF_NAME.length
    });
  }

  // --- More consonants than vowels ---
  const consonantCount = nm => nm.replace(/[^a-z]/gi, '').length - vowelCount(nm);
  if (consonantCount(secret) > vowelCount(secret)) {
    templates.push({
      type: 'consonant-vowel',
      text: `The name has more consonants than vowels`,
      test: n => consonantCount(n) > vowelCount(n)
    });
  } else if (vowelCount(secret) > consonantCount(secret)) {
    templates.push({
      type: 'consonant-vowel',
      text: `The name has more vowels than consonants`,
      test: n => vowelCount(n) > consonantCount(n)
    });
  } else {
    templates.push({
      type: 'consonant-vowel',
      text: `The name has equal vowels and consonants`,
      test: n => consonantCount(n) === vowelCount(n)
    });
  }

  // --- Alphabetical position relative to "M" ---
  if (s < 'M') {
    templates.push({
      type: 'alpha-position',
      text: `The name comes before "M" alphabetically`,
      test: n => n.toUpperCase() < 'M'
    });
  } else {
    templates.push({
      type: 'alpha-position',
      text: `The name comes after "M" alphabetically`,
      test: n => n.toUpperCase() >= 'M'
    });
  }

  // --- Starts and ends with the same letter ---
  if (s[0] === s[s.length - 1]) {
    templates.push({
      type: 'same-start-end',
      text: `The name starts and ends with the same letter`,
      test: n => n[0].toUpperCase() === n[n.length - 1].toUpperCase()
    });
  } else {
    templates.push({
      type: 'same-start-end',
      text: `The name does not start and end with the same letter`,
      test: n => n[0].toUpperCase() !== n[n.length - 1].toUpperCase()
    });
  }

  return templates;
}

// ===== Puzzle Generation =====

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePuzzle() {
  const secret = shuffle(NAMES)[0];
  const pool = NAMES.filter(n => n !== secret);

  // Step 1: Build a full hint chain against the entire pool.
  // With ~190 names and a ≤6 cap this produces ~30 hints.
  const allHints = buildHints(secret, pool, 7);

  // Step 2: Pick candidates — up to 4 names per hint, stop at 28 total.
  // Names from hint N survived hints 1…N-1, so hint N will eliminate exactly them.
  const TARGET_CANDIDATES = 28;
  const candidateSet = new Set();
  for (const hint of allHints) {
    if (candidateSet.size >= TARGET_CANDIDATES) break;
    for (const n of shuffle(hint.eliminatedNames)) {
      if (candidateSet.size >= TARGET_CANDIDATES) break;
      candidateSet.add(n);
    }
  }

  // Step 3: Trim hint list to only hints that actually eliminate a visible candidate.
  // Re-record eliminatedNames relative to the visible candidate set.
  const visibleRemaining = new Set(candidateSet);
  const hints = [];
  for (const hint of allHints) {
    const elimVisible = [...visibleRemaining].filter(n => !hint.test(n));
    if (elimVisible.length > 0) {
      hint.eliminatedNames = elimVisible;
      hints.push(hint);
      for (const n of elimVisible) visibleRemaining.delete(n);
    }
    if (visibleRemaining.size === 0) break;
  }

  const allNames = shuffle([secret, ...[...candidateSet]]);
  return { secret, allNames, hints };
}

function buildHints(secret, candidates, minHints = 7) {
  const templates = buildHintTemplates(secret);
  const remaining = new Set(candidates); // non-secret names still in play
  const chosen = [];
  const typeUsage = {}; // track how many times each hint type has been used
  const MAX_TYPE_USES = 2;

  // Shuffle templates once for variety across runs
  const shuffledTemplates = shuffle(templates);

  const typeAllowed = tpl => (typeUsage[tpl.type] || 0) < MAX_TYPE_USES;

  let attempts = 0;
  while (remaining.size > 0 && attempts < 300) {
    attempts++;

    // How many hints do we still want to use to finish?
    const hintsLeft = Math.max(minHints - chosen.length, 1);
    // Cap eliminations per step: spread across remaining hints, hard max of 6.
    const maxElim = Math.min(Math.ceil(remaining.size / hintsLeft), 6);

    // First pass: find best hint that respects the elimination cap AND type limit
    let best = null;
    let bestScore = 0;

    for (const tpl of shuffledTemplates) {
      if (chosen.includes(tpl)) continue;
      if (!tpl.test(secret)) continue;
      if (!typeAllowed(tpl)) continue;
      let score = 0;
      for (const name of remaining) {
        if (!tpl.test(name)) score++;
      }
      if (score >= 1 && score <= maxElim && score > bestScore) {
        bestScore = score;
        best = tpl;
      }
    }

    // Fallback 1: relax spread cap but enforce hard max of 6, keep type limit
    if (!best) {
      bestScore = 0;
      for (const tpl of shuffledTemplates) {
        if (chosen.includes(tpl)) continue;
        if (!tpl.test(secret)) continue;
        if (!typeAllowed(tpl)) continue;
        let score = 0;
        for (const name of remaining) {
          if (!tpl.test(name)) score++;
        }
        if (score >= 1 && score <= 6 && score > bestScore) {
          bestScore = score;
          best = tpl;
        }
      }
    }

    // Fallback 2: enforce hard max of 6, ignore type limit
    if (!best) {
      bestScore = 0;
      for (const tpl of shuffledTemplates) {
        if (chosen.includes(tpl)) continue;
        if (!tpl.test(secret)) continue;
        let score = 0;
        for (const name of remaining) {
          if (!tpl.test(name)) score++;
        }
        if (score >= 1 && score <= 6 && score > bestScore) {
          bestScore = score;
          best = tpl;
        }
      }
    }

    // Last resort: ignore everything — prevents an unsolvable puzzle
    if (!best) {
      bestScore = 0;
      for (const tpl of shuffledTemplates) {
        if (chosen.includes(tpl)) continue;
        if (!tpl.test(secret)) continue;
        let score = 0;
        for (const name of remaining) {
          if (!tpl.test(name)) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          best = tpl;
        }
      }
    }

    if (!best) break; // no more useful hints

    // Record which names this hint eliminates from the current remaining set.
    // Used by generatePuzzle to build the visible candidate list.
    best.eliminatedNames = [...remaining].filter(n => !best.test(n));
    chosen.push(best);
    typeUsage[best.type] = (typeUsage[best.type] || 0) + 1;
    // Remove eliminated candidates
    for (const name of best.eliminatedNames) remaining.delete(name);
  }

  return chosen;
}

// ===== Game State =====
let puzzle = null;
let hintIndex = 0;
let eliminated = new Set();

function newGame() {
  puzzle = generatePuzzle();
  hintIndex = 0;
  eliminated = new Set();
  renderGame();
  hideWinScreen();
}

// ===== Rendering =====

function renderGame() {
  renderNames();
  renderHints();
  updateProgress();
  updateButton();
}

function renderNames() {
  const grid = document.getElementById('name-grid');
  grid.innerHTML = '';
  for (const name of puzzle.allNames) {
    const card = document.createElement('button');
    card.className = 'name-card' + (eliminated.has(name) ? ' eliminated' : '');
    card.textContent = name;
    card.setAttribute('aria-label', name + (eliminated.has(name) ? ' (eliminated)' : ''));
    card.addEventListener('click', () => onNameTap(name));
    grid.appendChild(card);
  }
}

function renderHints() {
  const log = document.getElementById('hint-log');
  log.innerHTML = '';
  for (let i = 0; i < hintIndex; i++) {
    const hint = puzzle.hints[i];
    const item = document.createElement('div');
    item.className = 'hint-item' + (i === hintIndex - 1 ? ' new' : '');
    item.textContent = hint.text;
    log.appendChild(item);
  }
  // Scroll to bottom
  log.scrollTop = log.scrollHeight;
}

function updateProgress() {
  const el = document.getElementById('hint-progress');
  const total = puzzle.hints.length;
  if (hintIndex === 0) {
    el.textContent = `${total} hint${total !== 1 ? 's' : ''} available — tap the button to start`;
  } else {
    el.textContent = `Hint ${hintIndex} of ${total}`;
  }
}

function updateButton() {
  const btn = document.getElementById('next-hint-btn');
  const allRevealed = hintIndex >= puzzle.hints.length;
  btn.disabled = allRevealed;
  btn.textContent = allRevealed ? 'All hints revealed' : 'Reveal Next Hint';
}

// ===== Event Handlers =====

function onNameTap(name) {
  if (eliminated.has(name)) {
    // Un-eliminate (toggle back)
    eliminated.delete(name);
  } else {
    eliminated.add(name);
  }
  renderNames();
  checkWin();
}

function onNextHint() {
  if (hintIndex >= puzzle.hints.length) return;
  hintIndex++;
  renderHints();
  updateProgress();
  updateButton();

  // Auto-eliminate names based on revealed hints so far (no — we keep it manual per spec)
  // Only update button state
}

function checkWin() {
  const survivors = puzzle.allNames.filter(n => !eliminated.has(n));
  if (survivors.length === 1 && survivors[0] === puzzle.secret) {
    showWinScreen(puzzle.secret, true);
  } else if (survivors.length === 1 && survivors[0] !== puzzle.secret) {
    // Player eliminated the wrong names — show correct answer
    showWinScreen(puzzle.secret, false);
  }
}

// ===== Win Screen =====

function showWinScreen(name, correct) {
  const screen = document.getElementById('win-screen');
  document.getElementById('win-emoji').textContent = correct ? '🎉' : '🤔';
  document.getElementById('win-title').textContent = correct ? "That's right!" : "Not quite…";
  document.getElementById('win-name').textContent = name;
  document.getElementById('win-subtitle').textContent = correct
    ? `You deduced the name through the hints. Well done!`
    : `The correct answer was ${name}. Better luck next time!`;
  document.getElementById('fail-actions').style.display = correct ? 'none' : 'block';
  screen.classList.add('visible');
}

function hideWinScreen() {
  document.getElementById('win-screen').classList.remove('visible');
}

// ===== Init =====

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('next-hint-btn').addEventListener('click', onNextHint);
  document.getElementById('play-again-btn').addEventListener('click', newGame);
  document.getElementById('review-btn').addEventListener('click', hideWinScreen);
  newGame();
});
