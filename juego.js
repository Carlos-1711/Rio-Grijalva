/* ======== GESTIÓN DE JUGADOR Y PUNTAJES ======== */
const foundColors = [
  "#ff4d4d", "#4dff4d", "#4d4dff", "#ffb84d",
  "#b84dff", "#4dffff", "#ff4db8", "#b8ff4d",
  "#ff944d", "#944dff", "#4d94ff", "#ff4d94",
  "#4dff94", "#94ff4d", "#ffdb4d", "#db4dff",
  "#4ddbff", "#ff4ddb", "#d9ff4d"
];
const LEVEL_ORDER = ['easy', 'medium', 'hard'];
function nextLevel() {
  const currentIndex = LEVEL_ORDER.indexOf(state.level);
  if(currentIndex < LEVEL_ORDER.length - 1){
    const nextLvl = LEVEL_ORDER[currentIndex + 1];
    alert(`¡Nivel ${state.level.toUpperCase()} completado! Ahora pasas a ${nextLvl.toUpperCase()}`);
    setup(nextLvl);
    startTimer();
  } else {
    // Si completó el último nivel
    alert(`¡Felicidades! Completaste todos los niveles. Puntaje final: ${state.score} pts.`);
    endGame(true); // termina el juego y registra puntaje
  }
}


let playerName = localStorage.getItem("playerName") || null;
document.getElementById("playerName").textContent = playerName ? playerName : "-";

function askPlayerName() {
  let name = prompt("👋 Escribe tu nombre para registrar tu puntaje:");
  if (!name || name.trim() === "") name = "Invitado";
  playerName = name.trim();
  localStorage.setItem("playerName", playerName);
  document.getElementById("playerName").textContent = playerName;
}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  scores.push({ name: playerName, score });
  scores.sort((a,b)=>b.score - a.score);
  const top5 = scores.slice(0,5);
  localStorage.setItem("scoreHistory", JSON.stringify(top5));
  renderScoreHistory();
}

function renderScoreHistory() {
  const scores = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  const tbody = document.querySelector("#scoreHistory tbody");
  tbody.innerHTML = "";
  if (scores.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3'>Sin registros aún.</td></tr>";
    return;
  }
  scores.forEach((s,i)=>{
    const row = document.createElement("tr");
    row.innerHTML = `<td>${i+1}</td><td>${s.name}</td><td>${s.score}</td>`;
    tbody.appendChild(row);
  });
}
renderScoreHistory();

/* --- Palabras por nivel --- */
const wordsByLevel = {
  easy: ["Mercurio", "Arsénico", "Cadmio", "Plomo", "Agua", "Río", "Laguna", "Pez", "Tierra", "Verde"],
  medium: ["Mercurio", "Arsénico", "Cadmio", "Plomo", "Agua", "Río", "Laguna", "Pez", "Tierra", "Verde", "Oxígeno", "Contaminación"],
  hard: ["Mercurio", "Arsénico", "Cadmio", "Plomo", "Agua", "Río", "Laguna", "Pez", "Tierra", "Verde", "Oxígeno", "Contaminación", "Desarrollo", "Industria", "Biodiversidad"]
};

/* --- Datos y estado --- */
const LEVELS = {
  easy: {size:12, time:180, words: wordsByLevel.easy.map(w => w.toUpperCase())},
  medium: {size:15, time:240, words: wordsByLevel.medium.map(w => w.toUpperCase())},
  hard: {size:18, time:300, words: wordsByLevel.hard.map(w => w.toUpperCase())}
};

let state = {
  level:'easy',
  size:12,
  grid:[],
  cells:[],
  placedWords:[],
  found:new Set(),
  score:0,
  timer:null,
  timeLeft:0
};

/* --- Elementos DOM --- */
const gridEl=document.getElementById('grid');
const wordListEl=document.getElementById('wordList');
const startBtn=document.getElementById('startBtn');
const restartBtn=document.getElementById('restartBtn');
const levelSelect=document.getElementById('level');
const scoreEl=document.getElementById('score');
const timerEl=document.getElementById('timer');
const lvlTag=document.getElementById('lvlTag');
const foundCountEl=document.getElementById('foundCount');
const totalWordsEl=document.getElementById('totalWords');
const hintBtn=document.getElementById('hintBtn');
const solveBtn=document.getElementById('solveBtn');
const resultsEl=document.getElementById('results');
const bestEl=document.getElementById('best');
const confettiContainer=document.getElementById('modal');

/* --- Configuración de letras --- */
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randInt(n){return Math.floor(Math.random()*n);}
const DIRS=[{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:1},{dx:-1,dy:-1},{dx:1,dy:-1},{dx:-1,dy:1}];

/* --- Generación del tablero --- */
function setup(levelKey){
  stopTimer();
  const lvl = LEVELS[levelKey];
  state.level = levelKey;
  state.size = lvl.size;
  state.grid = Array.from({length:lvl.size},()=>Array(lvl.size).fill(''));
  state.cells = [];
  state.placedWords = [];
  state.found = new Set();
  state.score = 0;
  state.timeLeft = lvl.time;

  scoreEl.textContent = '0';
  lvlTag.textContent = levelKey==='easy'?'Fácil':levelKey==='medium'?'Medio':'Difícil';
  totalWordsEl.textContent = lvl.words.length;
  foundCountEl.textContent = '0';
  resultsEl.textContent = '';

  document.getElementById('winModal').style.display = 'none';
  document.getElementById('winModal').setAttribute('aria-hidden','true');

  placeWordsAndFill();
  renderGrid();
  renderWordList();
  updateTimerDisplay();
}

/* --- Colocar palabras y rellenar letras --- */
function placeWordsAndFill(){
  const lvlWords = LEVELS[state.level].words;
  let attempts=0, ok=false;
  while(attempts<6 && !ok){
    attempts++;
    state.grid = Array.from({length:state.size},()=>Array(state.size).fill(''));
    state.placedWords=[];
    let fail=false;
    for(const w of lvlWords){
      const p=tryPlaceWord(w);
      if(!p){fail=true; break;} else state.placedWords.push(p);
    }
    if(!fail) ok=true;
  }
  if(!ok) console.warn('Algunas palabras no pudieron colocarse tras varios intentos');
  fillRandom();
}

function tryPlaceWord(word){
  const len = word.length, size = state.size;
  for(let a=0;a<400;a++){
    const dir = DIRS[randInt(DIRS.length)];
    const rMin = Math.max(0,-dir.dy*(len-1));
    const rMax = Math.min(size-1, size-1-dir.dy*(len-1));
    const cMin = Math.max(0,-dir.dx*(len-1));
    const cMax = Math.min(size-1, size-1-dir.dx*(len-1));
    const r = randInt(rMax-rMin+1)+rMin;
    const c = randInt(cMax-cMin+1)+cMin;
    let fits=true, positions=[];
    for(let i=0;i<len;i++){
      const rr=r+dir.dy*i, cc=c+dir.dx*i;
      const ch=state.grid[rr][cc];
      if(ch && ch!=='' && ch!==word[i]){fits=false; break;}
      positions.push({r:rr,c:cc});
    }
    if(!fits) continue;
    for(let i=0;i<len;i++){
      const rr=r+dir.dy*i, cc=c+dir.dx*i;
      state.grid[rr][cc]=word[i];
    }
    return {word, positions};
  }
  return null;
}

function fillRandom(){
  for(let r=0;r<state.size;r++){
    for(let c=0;c<state.size;c++){
      if(!state.grid[r][c]||state.grid[r][c]==='') state.grid[r][c]=letters[randInt(letters.length)];
    }
  }
}

/* --- Renderizado del grid y lista de palabras --- */
function renderGrid(){
  gridEl.innerHTML='';
  state.cells=[];
  const cellSize = state.size>16?36:state.size>13?40:44;
  gridEl.style.setProperty('--cell-size', cellSize+'px');
  gridEl.style.gridTemplateColumns = `repeat(${state.size}, ${cellSize}px)`;
  for(let r=0;r<state.size;r++){
    for(let c=0;c<state.size;c++){
      const div=document.createElement('div');
      div.className='cell';
      div.dataset.r=r;
      div.dataset.c=c;
      div.textContent = state.grid[r][c];
      gridEl.appendChild(div);
      state.cells.push(div);
    }
  }
}

function renderWordList(){
  wordListEl.innerHTML='';
  for(const p of state.placedWords){
    const w=p.word;
    const div=document.createElement('div');
    div.className='word';
    div.dataset.word=w;
    div.innerHTML = `<div>${w}</div><div class="tag">${w.length} letras</div>`;
    wordListEl.appendChild(div);
  }
}

/* --- Selección de letras --- */
let selecting=false, selPath=[], selSet=new Set();
gridEl.addEventListener('mousedown', e=>{
  if(e.target.classList.contains('cell')){
    selecting=true;
    clearSelection();
    toggleCellSelection(e.target);
  }
});
document.addEventListener('mouseup', e=>{
  if(selecting){selecting=false; validateSelection();}
});
gridEl.addEventListener('mouseover', e=>{
  if(selecting && e.target.classList.contains('cell')) toggleCellSelection(e.target);
});
gridEl.addEventListener('click', e=>{
  if(e.target.classList.contains('cell')){
    if(selecting) return;
    clearSelection();
    toggleCellSelection(e.target);
    validateSelection();
  }
});

function toggleCellSelection(cell){
  const key = cell.dataset.r+','+cell.dataset.c;
  if(selSet.has(key)) return;
  selSet.add(key);
  selPath.push(cell);
  cell.classList.add('selected');
}

function clearSelection(){ selPath.forEach(c=>c.classList.remove('selected')); selPath=[]; selSet=new Set(); }

/* --- Validar selección --- */
const motivaciones=["¡Excelente! Sigue así 💪","¡Muy bien! Vas en camino 🎯","¡Buen ojo! Continúa 🔍","¡Genial! Encuentra las demás 🌟"];
function showMotivation(){ 
  const msg=motivaciones[randInt(motivaciones.length)];
  const el=document.createElement('div');
  el.className='motiv';
  el.textContent=msg;
  const left = Math.min(window.innerWidth - 140, Math.max(10, gridEl.getBoundingClientRect().left + 30 + Math.random()* (gridEl.clientWidth - 60)));
  const top = Math.max(10, gridEl.getBoundingClientRect().top + 20 + Math.random()* Math.max(20, gridEl.clientHeight - 40));
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1200);
}

function validateSelection(){
  if(selPath.length===0) return;
  const word = selPath.map(c=>c.textContent).join('');
  const rword = selPath.map(c=>c.textContent).reverse().join('');
  const placed = state.placedWords.map(p=>p.word);
  let foundWord = null;
  if(placed.includes(word)) foundWord = word;
  else if(placed.includes(rword)) foundWord = rword;

if(foundWord && !state.found.has(foundWord)){
    // Obtener índice de la palabra en placedWords
    const wordIndex = state.placedWords.findIndex(p => p.word === foundWord);
    const color = foundColors[wordIndex]; // color único por palabra

    // Aplicar color a las celdas
    selPath.forEach(c=>{
        c.classList.add('found');
        c.style.backgroundColor = color;
        c.style.color = "#fff"; // opcional, para contraste
        c.style.textShadow = "0 0 6px #000"; // opcional
    });

    // Aplicar color a la palabra de la lista
    for(const wEl of wordListEl.children){
        if(wEl.dataset.word===foundWord){
            wEl.classList.add('found');
            wEl.style.backgroundColor = color;
            wEl.style.color = "#fff";
        }
    }

    state.found.add(foundWord);


    const base = foundWord.length * 10;
    const mult = state.level==='easy'?1 : state.level==='medium'?1.3 : 1.6;
    const scoreGain = Math.round(base*mult + Math.max(0, state.timeLeft/8));
    state.score += scoreGain;
    scoreEl.textContent = state.score;
    foundCountEl.textContent = state.found.size;
    resultsEl.textContent = `Encontraste ${foundWord} (+${scoreGain} pts)`;

    showMotivation();
    burstConfetti();

  if(state.found.size === state.placedWords.length){
  setTimeout(()=> nextLevel(), 300);
}

  } else {
    selPath.forEach(c=>{
      c.classList.add('hintFlash');
      setTimeout(()=>c.classList.remove('hintFlash'),350);
    });
  }
  clearSelection();
}

/* --- Confetti --- */
function burstConfetti(){
  confettiContainer.style.display='block';
  setTimeout(()=>{confettiContainer.style.display='none'},800);
}

/* --- Temporizador --- */
function startTimer(){
  stopTimer();
  state.timer = setInterval(()=>{
    state.timeLeft--;
    updateTimerDisplay();
    if(state.timeLeft<=0){
      stopTimer();
      endGame(false);
    }
  },1000);
}
function stopTimer(){ if(state.timer) clearInterval(state.timer); state.timer=null; }
function updateTimerDisplay(){
  const mm = String(Math.floor(state.timeLeft/60)).padStart(2,'0');
  const ss = String(state.timeLeft%60).padStart(2,'0');
  timerEl.textContent = `${mm}:${ss}`;
}

/* --- Final de juego --- */
function endGame(win){
  stopTimer();
  const modal=document.getElementById('winModal');

  // Registrar puntaje actual siempre
  saveScore(state.score);

  if(win){
    // Verificar si hay siguiente nivel
    let nextLevel;
    if(state.level === 'easy') nextLevel = 'medium';
    else if(state.level === 'medium') nextLevel = 'hard';
    else nextLevel = null; // si estaba en hard, terminó todo

    if(nextLevel){
      // Pasar al siguiente nivel automáticamente después de 1s
      setTimeout(()=>{
        setup(nextLevel);
        startTimer();
      }, 1000);
    } else {
      // Si terminó nivel hard, mostrar modal y volver a fácil al cerrar
      modal.style.display='flex';
      modal.setAttribute('aria-hidden','false');
      document.getElementById('finalScore').textContent=`¡Completaste todos los niveles! Puntaje final: ${state.score} pts.`;
    }

  } else {
    // Si se acabó el tiempo
    resultsEl.textContent=`Tiempo agotado ⏰ Puntaje obtenido: ${state.score} pts.`;

    modal.style.display='flex';
    modal.setAttribute('aria-hidden','false');
    document.getElementById('finalScore').textContent=`Puntaje final: ${state.score} pts.`;
  }

  // 🔹 Limpiar nombre del jugador para el siguiente
  playerName = null;                        
  localStorage.removeItem('playerName');    
  document.getElementById('playerName').textContent = '-';
}




/* --- Botones modal --- */
function closeWinModal(){ 
  document.getElementById('winModal').style.display='none';
  document.getElementById('winModal').setAttribute('aria-hidden','true');

  // Reiniciar al nivel fácil para el próximo jugador
  setup('easy');
}

function replay(){ 
  closeWinModal();
  setup(state.level);
  startTimer();
}

/* --- Hints y resolver --- */
hintBtn.addEventListener('click', ()=>{
  for(const p of state.placedWords){
    if(!state.found.has(p.word)){
      for(const pos of p.positions){
        const c = state.cells[pos.r*state.size+pos.c];
        c.classList.add('hintFlash');
        setTimeout(()=>c.classList.remove('hintFlash'),600);
      }
      break;
    }
  }
});

solveBtn.addEventListener('click', ()=>{
  for(const p of state.placedWords){
    if(!state.found.has(p.word)){
      for(const pos of p.positions){
        const c = state.cells[pos.r*state.size+pos.c];
        c.classList.add('found');
      }
      state.found.add(p.word);
      for(const wEl of wordListEl.children) if(wEl.dataset.word===p.word) wEl.classList.add('found');
    }
  }
  endGame(true);
});

/* --- Botones inicio y reinicio --- */
startBtn.addEventListener('click', ()=>{
  if (!playerName) askPlayerName(); // ✅ pide el nombre antes de iniciar
  setup(levelSelect.value);
  startTimer();
});
restartBtn.addEventListener('click', ()=>{
  state.level = 'easy';           // forzar al nivel fácil
  setup('easy');                   // reinicia tablero y palabras
  startTimer();                    // inicia el temporizador
});

levelSelect.addEventListener('change', ()=>{ setup(levelSelect.value); });

/* --- Inicialización --- */
(function(){
  bestEl.textContent = parseInt(localStorage.getItem('best_'+state.level)||'0');
  setup(levelSelect.value);
})();

/* === NUEVO: BOTÓN CAMBIAR NOMBRE === */
const changeNameBtn = document.getElementById("changeNameBtn");
if (changeNameBtn) {
  changeNameBtn.addEventListener("click", () => {
    askPlayerName();
  });
}
for(const wEl of wordListEl.children) 
  if(wEl.dataset.word===foundWord) wEl.classList.add('found');