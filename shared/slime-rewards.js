/**
 * Slime Legion — Sovereign Evolution & Reward Engine
 * Protocolo MAIAH: La ciencia es el escudo, el juego es el arma.
 * Conecta los 7 juegos de NeuroDivertidos con el sistema de evolución Slime.
 */

const SlimeRewards = {
  KEY_POINTS: 'slime_legion_points',
  KEY_CHAR: 'slime_legion_character',
  KEY_BRANCH: 'slime_legion_branch', // 'a' (Luz) o 'b' (Oscuridad)

  CHARACTERS: {
    minizanahoria: { id: 'minizanahoria', name: 'Mini-Zanahoria', title: 'La Protagonista Traviesa', phases: 5 },
    robbit: { id: 'robbit', name: 'Robbit', title: 'Guía y Paladín', phases: 5 },
    chiwish: { id: 'chiwish', name: 'Chi-Wish', title: 'Slime de los Deseos', phases: 5 },
    diegoivan: { id: 'diegoivan', name: 'Diego Ivan', title: 'Dino-Caballero', phases: 5 },
    emmaruth: { id: 'emmaruth', name: 'Emma Ruth', title: 'Architect Supreme', phases: 5 },
    yuya: { id: 'yuya', name: 'Yuya', title: 'Diosa de la Alegría', phases: 5 },
    cherry: { id: 'cherry', name: 'Cherry', title: 'Hada Cerezo', phases: 5 },
    madrecerebro: { id: 'madrecerebro', name: 'Madre Cerebro', title: 'Mente Colmena', phases: 5 },
    totopo: { id: 'totopo', name: 'Totopo', title: 'El Sabio Subterráneo', phases: 1 }
  },

  getPoints() {
    return parseInt(localStorage.getItem(this.KEY_POINTS) || '0', 10);
  },

  getCharacter() {
    return localStorage.getItem(this.KEY_CHAR) || 'minizanahoria';
  },

  setCharacter(charId) {
    if (this.CHARACTERS[charId]) {
      localStorage.setItem(this.KEY_CHAR, charId);
    }
  },

  getBranch() {
    return localStorage.getItem(this.KEY_BRANCH) || 'a';
  },

  setBranch(branch) {
    localStorage.setItem(this.KEY_BRANCH, branch === 'b' ? 'b' : 'a');
  },

  getPhaseInfo(pts) {
    const points = pts !== undefined ? pts : this.getPoints();
    const branch = this.getBranch();

    if (points >= 50) {
      return {
        key: `phase4${branch}`,
        number: 4,
        name: branch === 'a' ? 'Fase 4A: Camino de Luz ✨' : 'Fase 4B: Camino Oscuro 💀',
        description: branch === 'a' ? 'Proteger, crear y nutrir al mundo.' : 'Destruir barreras con poder puro.',
        minPoints: 50,
        nextPoints: null,
        progressPct: 100
      };
    } else if (points >= 25) {
      return {
        key: 'phase3',
        number: 3,
        name: 'Fase 3: Forma Completa',
        description: 'Humanoide ágil, listo para defender el valle.',
        minPoints: 25,
        nextPoints: 50,
        progressPct: Math.min(100, Math.round(((points - 25) / 25) * 100))
      };
    } else if (points >= 10) {
      return {
        key: 'phase2',
        number: 2,
        name: 'Fase 2: Pikuniku',
        description: 'Brotan extremidades para explorar e interactuar.',
        minPoints: 10,
        nextPoints: 25,
        progressPct: Math.min(100, Math.round(((points - 10) / 15) * 100))
      };
    } else {
      return {
        key: 'phase1',
        number: 1,
        name: 'Fase 1: Blob',
        description: 'Pequeño slime curioso aprendiendo a sentir.',
        minPoints: 0,
        nextPoints: 10,
        progressPct: Math.min(100, Math.round((points / 10) * 100))
      };
    }
  },

  getSpritePath(charId, phaseKey) {
    const cid = charId || this.getCharacter();
    const pkey = phaseKey || this.getPhaseInfo().key;
    // Si es Totopo solo tiene phase3
    if (cid === 'totopo') {
      return `../slime-evolution/sprites/totopo_phase3.webp`;
    }
    return `../slime-evolution/sprites/${cid}_${pkey}.webp`;
  },

  awardPoints(pts, reason = '¡Desafío superado!') {
    const prevPoints = this.getPoints();
    const prevPhase = this.getPhaseInfo(prevPoints);
    const newPoints = prevPoints + pts;
    localStorage.setItem(this.KEY_POINTS, newPoints.toString());
    const newPhase = this.getPhaseInfo(newPoints);

    if (window.AgoraAudio) {
      AgoraAudio.playSuccess();
    }

    if (newPhase.key !== prevPhase.key) {
      this.showEvolutionCelebration(prevPhase, newPhase);
    } else {
      this.showToast(`+${pts} Puntos de Evolución 🧬 (${newPoints} pts)`);
    }

    return newPoints;
  },

  awardVictory(gameName, pts = 5) {
    return this.awardPoints(pts, `Victoria en ${gameName}`);
  },

  showToast(text) {
    if (typeof document === 'undefined') return;
    let toast = document.getElementById('slime-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'slime-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #231f24;
        color: #e3e0a4;
        border: 2px solid #896ab0;
        box-shadow: 0 8px 30px rgba(137, 106, 176, 0.4);
        padding: 12px 24px;
        border-radius: 999px;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>🧬</span> <span>${text}</span>`;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
  },

  showEvolutionCelebration(oldPhase, newPhase) {
    if (typeof document === 'undefined') return;
    const char = this.getCharacter();
    const charData = this.CHARACTERS[char] || this.CHARACTERS.minizanahoria;
    const spriteUrl = this.getSpritePath(char, newPhase.key);

    const overlay = document.createElement('div');
    overlay.id = 'slime-evolution-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(35, 31, 36, 0.94);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Outfit', sans-serif;
      color: #e3e0a4;
      text-align: center;
      animation: fadeIn 0.4s ease;
    `;

    const isPhase4Choice = newPhase.number === 4;

    overlay.innerHTML = `
      <style>
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .evo-card {
          background: #2d2832;
          border: 3px solid #896ab0;
          box-shadow: 0 0 50px rgba(137, 106, 176, 0.5);
          border-radius: 24px;
          max-width: 480px;
          width: 100%;
          padding: 2rem;
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .evo-sprite {
          width: 180px;
          height: 180px;
          object-fit: contain;
          image-rendering: pixelated;
          filter: drop-shadow(0 0 20px rgba(168, 178, 138, 0.5));
          margin: 1rem 0;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .evo-title {
          font-size: 1.8rem;
          color: #a8b28a;
          margin: 0.5rem 0;
          font-weight: 800;
        }
        .evo-subtitle {
          color: #9b8e6c;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .evo-btn {
          background: #896ab0;
          color: #231f24;
          font-weight: 800;
          border: none;
          padding: 12px 28px;
          border-radius: 999px;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 1.5rem;
          box-shadow: 0 4px 15px rgba(137, 106, 176, 0.4);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .evo-btn:hover {
          transform: scale(1.05);
          background: #a8b28a;
        }
        .path-choice {
          display: flex;
          gap: 12px;
          margin-top: 1rem;
          width: 100%;
        }
        .path-btn {
          flex: 1;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          border: 2px solid;
          background: transparent;
        }
        .path-light {
          border-color: #ffd700;
          color: #ffd700;
        }
        .path-dark {
          border-color: #b42828;
          color: #ff7070;
        }
      </style>

      <div class="evo-card">
        <span style="font-size: 2.5rem;">✨🧬✨</span>
        <div class="evo-title">¡TU SLIME HA EVOLUCIONADO!</div>
        <div class="evo-subtitle">${charData.name} alcanzó <strong>${newPhase.name}</strong></div>
        
        <img class="evo-sprite" src="${spriteUrl}" alt="${newPhase.name}" onerror="this.style.display='none'">
        
        <p style="font-size: 0.95rem; line-height: 1.5; color: #e3e0a4; max-width: 380px;">
          ${newPhase.description}
        </p>

        ${isPhase4Choice ? `
          <div style="font-size: 0.9rem; color: #9b8e6c; margin-top: 1rem;">
            Elige el destino de tu Slime:
          </div>
          <div class="path-choice">
            <button class="path-btn path-light" onclick="SlimeRewards.setBranch('a'); location.reload();">✨ Camino de Luz</button>
            <button class="path-btn path-dark" onclick="SlimeRewards.setBranch('b'); location.reload();">💀 Camino Oscuro</button>
          </div>
        ` : `
          <button class="evo-btn" onclick="document.getElementById('slime-evolution-overlay').remove()">¡Continuar Aventura! 🚀</button>
        `}
      </div>
    `;

    document.body.appendChild(overlay);
  }
};

window.SlimeRewards = SlimeRewards;
