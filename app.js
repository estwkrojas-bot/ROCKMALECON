// ===================== DATA =====================
const tracks = [
  { id: 1, title: "Ruido Urbano",        band: "Los Desaparecidos", year: "1987", src: "music/7.mp3"  },
  { id: 2, title: "Noche en el Malecón", band: "Cemento Crudo",     year: "1989", src: "music/8.mp3"  },
  { id: 3, title: "Grito de Frontera",   band: "Asfalto Negro",     year: "1991", src: "music/9.mp3"  },
  { id: 4, title: "Ciudad Olvidada",     band: "Ecos del Páramo",   year: "1993", src: "music/10.mp3" },
  { id: 5, title: "Resistencia",         band: "Vértigo",           year: "1995", src: "music/11.mp3" },
];

const audioFiles = [
  { id: 1, band: "LOS DESAPARECIDOS", year: "1987", track: "Ruido Urbano",        description: "Grabado en casete durante su único concierto en el Malecón. Calidad de audio degradada.", duration: "3:42", src: "music/1.mp3" },
  { id: 2, band: "CEMENTO CRUDO",     year: "1989", track: "Noche en el Malecón", description: "Ensayo en vivo capturado en una grabadora portátil. Se escuchan voces de fondo.",         duration: "4:15", src: "music/2.mp3" },
  { id: 3, band: "ASFALTO NEGRO",     year: "1991", track: "Grito de Frontera",   description: "Única grabación conocida de la banda. Rescatada de un casete encontrado en 2003.",         duration: "5:08", src: "music/3.mp3" },
  { id: 4, band: "ECOS DEL PÁRAMO",   year: "1993", track: "Ciudad Olvidada",     description: "Demo grabado en estudio casero. Incluye efectos de eco experimental.",                     duration: "3:55", src: "music/4.mp3" },
  { id: 5, band: "VÉRTIGO",           year: "1995", track: "Resistencia",         description: "Último registro antes de la disolución de la banda. Audio con interferencias.",             duration: "4:30", src: "music/5.mp3" },
  { id: 6, band: "RUIDO URBANO",      year: "1988", track: "Cemento y Asfalto",   description: "Grabación en vivo en el Bar El Refugio. Se perdió el master original.",                    duration: "3:20", src: "music/6.mp3" },
];

const posters = [
  { id: 1, band: "LOS DESAPARECIDOS", year: "1987", venue: "Malecón Cultural", rotation: -3, scale: 0.7, src: "img/1.jpg", top: "0px", left: "0px", with: "0px" },
  { id: 2, band: "CEMENTO CRUDO",     year: "1989", venue: "Bar El Refugio",   rotation:  2, scale: 1.2, src: "img/2.jpg", top: "0px", left: "-40px", with: "10px" },
  { id: 3, band: "ASFALTO NEGRO",     year: "1991", venue: "Parque Santander", rotation: -1, scale: 0.7, src: "img/3.jpg", top: "0px", left: "-80px", with: "0px" },
  { id: 4, band: "ECOS DEL PÁRAMO",   year: "1993", venue: "Centro Cultural",  rotation:  4, scale: 0.7, src: "img/4.jpg", top: "0px", left: "0px", with: "0px" },
  { id: 5, band: "VÉRTIGO",           year: "1995", venue: "Malecón",          rotation: -2, scale: 1.2, src: "img/5.jpg", top: "0px", left: "-40px", with: "0px" },
  { id: 6, band: "RUIDO URBANO",      year: "1988", venue: "Sala Underground", rotation:  1, scale: 0.7, src: "img/6.jpg", top: "0px", left: "-80px", with: "0px" },
];

// ===================== SIDEBAR AUDIO =====================
const sidebarAudio = new Audio();
sidebarAudio.src = tracks[0].src;

sidebarAudio.addEventListener('ended', () => {
  nextTrack();
});

// ===================== STATE =====================
let currentTrack = 0;
let isPlaying = false;
let progressInterval = null;
let progress = 0;
let playingAudioId = null;
let ambientPlaying = false;

// ===================== HELPERS =====================
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function generateWaveformBars(count = 40) {
  return Array.from({ length: count }, () => {
    const h = Math.random() * 80 + 20;
    return `<div class="waveform-bar" style="height:${h}%"></div>`;
  }).join('');
}

// ===================== AUDIO PLAYER SIDEBAR =====================
function updatePlayerUI() {
  const track = tracks[currentTrack];
  document.getElementById('cassetteBand').textContent = track.band;
  document.getElementById('trackTitle').textContent   = track.title;
  document.getElementById('trackMeta').textContent    = `${track.band} • ${track.year}`;

  document.querySelectorAll('.playlist-track').forEach((el, i) => {
    el.classList.toggle('active', i === currentTrack);
  });
}

function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    if (sidebarAudio.duration) {
      progress = (sidebarAudio.currentTime / sidebarAudio.duration) * 100;
    } else {
      progress = (progress + 1) % 100;
    }
    document.getElementById('progressFill').style.width = progress + '%';
  }, 500);
}

function stopProgress() {
  if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
}

function togglePlay() {
  isPlaying = !isPlaying;
  const playIcon  = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const reelL     = document.getElementById('reelLeft');
  const reelR     = document.getElementById('reelRight');

  if (isPlaying) {
    sidebarAudio.play().catch(err => console.error('Error al reproducir:', err));
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
    reelL.classList.add('spinning');
    reelR.classList.add('spinning');
    startProgress();
  } else {
    sidebarAudio.pause();
    playIcon.style.display  = '';
    pauseIcon.style.display = 'none';
    reelL.classList.remove('spinning');
    reelR.classList.remove('spinning');
    stopProgress();
  }
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  progress = 0;
  document.getElementById('progressFill').style.width = '0%';
  sidebarAudio.src = tracks[currentTrack].src;
  if (isPlaying) sidebarAudio.play().catch(err => console.error(err));
  updatePlayerUI();
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  progress = 0;
  document.getElementById('progressFill').style.width = '0%';
  sidebarAudio.src = tracks[currentTrack].src;
  if (isPlaying) sidebarAudio.play().catch(err => console.error(err));
  updatePlayerUI();
}

// ===================== PLAYLIST =====================
function buildPlaylist() {
  const container = document.getElementById('playlistTracks');
  container.innerHTML = tracks.map((t, i) => `
    <button class="playlist-track${i === currentTrack ? ' active' : ''}" data-index="${i}">
      <span class="playlist-track-title">${t.title}</span>
      <span class="playlist-track-meta">${t.band} • ${t.year}</span>
    </button>
  `).join('');

  container.querySelectorAll('.playlist-track').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTrack = parseInt(btn.dataset.index);
      progress = 0;
      document.getElementById('progressFill').style.width = '0%';
      sidebarAudio.src = tracks[currentTrack].src;
      if (isPlaying) sidebarAudio.play().catch(err => console.error(err));
      updatePlayerUI();
      document.getElementById('playlistPanel').classList.remove('open');
    });
  });
}

// ===================== AUDIO ARCHIVE =====================
function buildAudioGrid() {
  const grid = document.getElementById('audioGrid');
  grid.innerHTML = audioFiles.map(f => `
    <div class="audio-card">
      <div class="noise-overlay opacity-10"></div>
      <div class="card-top-row">
        <div class="card-badge"><p>ARCHIVO #${String(f.id).padStart(3,'0')}</p></div>
        <div class="card-year-badge"><p>${f.year}</p></div>
      </div>
      <h3 class="card-band">${f.band}</h3>
      <div class="card-divider"></div>
      <p class="card-track">${f.track}</p>
      <p class="card-desc">${f.description}</p>
      <div class="card-player-row">
        <button class="card-play-btn" data-id="${f.id}">
          <svg class="play-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <svg class="pause-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        </button>
        <div class="waveform" id="waveform-${f.id}">${generateWaveformBars()}</div>
        <div class="card-duration"><p>${f.duration}</p></div>
      </div>
      <div class="card-stamp">AUDIO<br>RECUPERADO</div>
      <audio id="audio-${f.id}" src="${f.src}" preload="none"></audio>
    </div>
  `).join('');

  grid.querySelectorAll('.card-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const audio = document.getElementById(`audio-${id}`);
      const wasSame = (playingAudioId === id);

      grid.querySelectorAll('.card-play-btn').forEach(b => {
        b.querySelector('.play-svg').style.display  = '';
        b.querySelector('.pause-svg').style.display = 'none';
        document.getElementById(`waveform-${b.dataset.id}`)?.classList.remove('playing');
        const otherAudio = document.getElementById(`audio-${b.dataset.id}`);
        if (otherAudio) otherAudio.pause();
      });

      if (!wasSame) {
        playingAudioId = id;
        audio.play().catch(err => console.error('Error al reproducir:', err));
        btn.querySelector('.play-svg').style.display  = 'none';
        btn.querySelector('.pause-svg').style.display = '';
        document.getElementById(`waveform-${id}`)?.classList.add('playing');

        audio.onended = () => {
          btn.querySelector('.play-svg').style.display  = '';
          btn.querySelector('.pause-svg').style.display = 'none';
          document.getElementById(`waveform-${id}`)?.classList.remove('playing');
          playingAudioId = null;
        };
      } else {
        playingAudioId = null;
      }
    });
  });
}

// ===================== POSTER GALLERY =====================
function buildPosterGrid() {
  const grid = document.getElementById('posterGrid');
  grid.innerHTML = posters.map(p => `
    <div class="poster-card" style="transform:rotate(${p.rotation}deg) scale(${p.scale}); position:relative; top:${p.top || '0'}; left:${p.left || '0'};" data-id="${p.id}">
      <div class="poster-inner">
        <div class="noise-overlay opacity-20"></div>
        <div class="poster-content">
          <div>
            <div class="accent-line mb-4" style="width:64px;"></div>
            <h3 class="poster-band">${p.band}</h3>
          </div>
          ${p.src
            ? `<div class="poster-graphic"><img src="${p.src}" style="width:100%;height:100%;object-fit:cover;opacity:0.85;"></div>`
            : `<div class="poster-graphic"><div class="graphic-box"><div class="graphic-box-inner"></div></div></div>`
          }
          <div>
            <p class="poster-venue">${p.venue}</p>
            <p class="poster-year">${p.year}</p>
          </div>
        </div>
        <div class="tape-tl"></div>
        <div class="tape-tr"></div>
      </div>
      <div class="poster-shadow" style="transform:translateY(8px) rotate(${p.rotation}deg);"></div>
    </div>
  `).join('');

  grid.querySelectorAll('.poster-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const poster = posters.find(p => p.id === id);
      if (!poster) return;
      document.getElementById('modalBand').textContent  = poster.band;
      document.getElementById('modalVenue').textContent = poster.venue;
      document.getElementById('modalYear').textContent  = poster.year;
      document.getElementById('posterModal').classList.add('open');
    });
  });
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  updatePlayerUI();
  buildAudioGrid();
  buildPosterGrid();

  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('posterModal').classList.remove('open');
  });
  document.getElementById('posterModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('posterModal')) {
      document.getElementById('posterModal').classList.remove('open');
    }
  });

  const ambientAudio = new Audio('music/1.mp3');
  ambientAudio.loop = true;
  ambientAudio.volume = 0.3;

  document.getElementById('ambientBtn').addEventListener('click', () => {
    ambientPlaying = !ambientPlaying;
    document.getElementById('ambientLabel').textContent  = ambientPlaying ? 'Sonido Ambiente On' : 'Sonido Ambiente Off';
    document.getElementById('ambientBtn').classList.toggle('active', ambientPlaying);
    document.getElementById('volOffIcon').style.display  = ambientPlaying ? 'none' : '';
    document.getElementById('volOnIcon').style.display   = ambientPlaying ? '' : 'none';

    if (ambientPlaying) {
      ambientAudio.play().catch(err => console.error('Error ambiente:', err));
    } else {
      ambientAudio.pause();
      ambientAudio.currentTime = 0;
    }
  });

  document.getElementById('playBtn').addEventListener('click', togglePlay);
  document.getElementById('prevBtn').addEventListener('click', prevTrack);
  document.getElementById('nextBtn').addEventListener('click', nextTrack);
  document.getElementById('playlistBtn').addEventListener('click', () => {
    buildPlaylist();
    document.getElementById('playlistPanel').classList.add('open');
  });
  document.getElementById('playlistClose').addEventListener('click', () => {
    document.getElementById('playlistPanel').classList.remove('open');
  });
});