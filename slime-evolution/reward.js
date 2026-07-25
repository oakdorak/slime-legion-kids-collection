/**
 * SlimeRewardSystem — Sistema reutilizable de recompensas por sprites.
 * 
 * USO:
 *   const reward = new SlimeRewardSystem({
 *     gameId: 'emotion-mirror',
 *     manifestUrl: '../slime-evolution/sprite-manifest.json'
 *   });
 *   await reward.init();
 *   await reward.showReward({ characterId: 'chiwish', branchId: 'supernova' });
 * 
 * COMPATIBILIDAD: v1.0.0 del manifest cae a phases_map.
 * ACCESIBILIDAD: role=dialog, aria-modal, focus trap, ESC para cerrar.
 */
class SlimeRewardSystem {
    constructor(config = {}) {
        this.gameId = config.gameId || 'unknown';
        this.manifestUrl = config.manifestUrl || '../slime-evolution/sprite-manifest.json';
        this.manifest = null;
        this.overlay = null;
        this.focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this._initialFocus = null;
    }

    async init() {
        try {
            const res = await fetch(this.manifestUrl, { cache: 'no-store' });
            if (!res.ok) throw new Error('Manifest not found: ' + res.status);
            this.manifest = await res.json();
            this._injectStyles();
            this._ensureOverlay();
        } catch (err) {
            console.error('[SlimeReward] init failed:', err);
        }
    }

    _injectStyles() {
        if (document.getElementById('slime-reward-styles')) return;
        const style = document.createElement('style');
        style.id = 'slime-reward-styles';
        style.textContent = `
            #slime-reward-overlay {
                position: fixed; inset: 0;
                background: rgba(35,31,36,0.96);
                display: none; align-items: center; justify-content: center;
                z-index: 300;
                padding: 20px;
            }
            #slime-reward-overlay.open { display: flex; }
            #slime-reward-card {
                background: #2e2a30;
                border: 2px solid #896ab0;
                border-radius: 24px;
                padding: 28px;
                max-width: 420px;
                width: 100%;
                text-align: center;
                box-shadow: 0 0 60px rgba(137,106,176,0.45);
                position: relative;
            }
            #slime-reward-sprite {
                image-rendering: pixelated;
                margin: 0 auto 18px;
                border-radius: 16px;
                background-repeat: no-repeat;
                box-shadow: 0 0 30px rgba(137,106,176,0.35);
            }
            #slime-reward-label {
                font-family: 'Outfit', system-ui, sans-serif;
                font-size: 1.3rem;
                font-weight: 800;
                color: #e3e0a4;
                letter-spacing: 2px;
                margin-bottom: 6px;
            }
            #slime-reward-desc {
                font-size: 0.9rem;
                color: #9b8e6c;
                margin-bottom: 22px;
                line-height: 1.5;
            }
            #slime-reward-close {
                padding: 12px 32px;
                background: #896ab0;
                color: #231f24;
                border: none;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                font-family: 'Outfit', system-ui, sans-serif;
                box-shadow: 0 0 20px rgba(137,106,176,0.5);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            #slime-reward-close:focus-visible {
                outline: 3px solid #e3e0a4;
                outline-offset: 4px;
            }
            #slime-reward-close:active { transform: scale(0.95); }
            #slime-reward-close:hover { box-shadow: 0 0 30px rgba(137,106,176,0.7); }
        `;
        document.head.appendChild(style);
    }

    _ensureOverlay() {
        if (this.overlay) return;
        this.overlay = document.createElement('div');
        this.overlay.id = 'slime-reward-overlay';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');
        this.overlay.setAttribute('aria-label', 'Recompensa desbloqueada');
        this.overlay.innerHTML = `
            <div id="slime-reward-card">
                <div id="slime-reward-sprite" role="img" aria-hidden="true"></div>
                <div id="slime-reward-label" aria-live="polite"></div>
                <div id="slime-reward-desc"></div>
                <button id="slime-reward-close" type="button">¡Gracias!</button>
            </div>
        `;
        const liveEl = document.createElement('div');
        liveEl.setAttribute('aria-live', 'assertive');
        liveEl.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        this.overlay.appendChild(liveEl);
        this._liveEl = liveEl;
        document.body.appendChild(this.overlay);

        const closeBtn = this.overlay.querySelector('#slime-reward-close');
        closeBtn.addEventListener('click', () => this.closeReward());
        closeBtn.addEventListener('keydown', (e) => {
            if (!e.repeat && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.closeReward();
            }
        });

        this.overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeReward();
            }
            if (e.key === 'Tab') {
                this._trapFocus(e);
            }
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.closeReward();
        });
    }

    _trapFocus(e) {
        const focusable = Array.from(this.overlay.querySelectorAll(this.focusableSelector));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    _resolveFrame(characterId, branchId) {
        if (!this.manifest) return null;
        const branch = this.manifest.branches?.[characterId]?.find(b => b.id === branchId);
        const character = this.manifest.characters?.find(c => c.id === characterId);
        if (!character || !branch) {
            if (character) {
                const frame = character.frames?.find(f => f.phase === branchId);
                return frame ? {...frame, character} : null;
            }
            return null;
        }
        const phase = branch.aliases?.[0] || branchId;
        const frame = character.frames?.find(f => f.phase === phase);
        return frame ? {...frame, character, branch} : null;
    }

    _resolveMasterFrame(characterId, branchId) {
        if (!this.manifest?.masterSheet?.frames) return null;
        const branch = this.manifest.branches?.[characterId]?.find(b => b.id === branchId);
        const phase = branch?.aliases?.[0] || branchId;
        return this.manifest.masterSheet.frames.find(f => f.character === characterId && f.phase === phase) || null;
    }

    async showReward(opts = {}) {
        if (!this.manifest) await this.init();
        const { characterId, branchId, reason, onClose } = opts;
        if (!this.overlay) return;

        this._initialFocus = document.activeElement;

        const spriteEl = this.overlay.querySelector('#slime-reward-sprite');
        const labelEl = this.overlay.querySelector('#slime-reward-label');
        const descEl = this.overlay.querySelector('#slime-reward-desc');

        const frame = this._resolveFrame(characterId, branchId);
        const mframe = this._resolveMasterFrame(characterId, branchId);
        const char = this.manifest.characters?.find(c => c.id === characterId);
        const branch = this.manifest.branches?.[characterId]?.find(b => b.id === branchId);

        if (!frame || !char) {
            console.error('[SlimeReward] frame not found:', characterId, branchId);
            return;
        }

        const scale = Math.min(1.2, 280 / Math.max(frame.width, frame.height));
        const displayW = Math.round(frame.width * scale);
        const displayH = Math.round(frame.height * scale);

        spriteEl.style.width = displayW + 'px';
        spriteEl.style.height = displayH + 'px';
        spriteEl.style.backgroundImage = `url('../slime-evolution/${char.sheet}')`;
        spriteEl.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
        spriteEl.setAttribute('aria-label', branch ? `Sprite desbloqueado: ${branch.label}` : `Sprite de ${char.name}`);

        labelEl.textContent = branch ? branch.label : char.name;
        descEl.textContent = reason || (branch ? branch.description : '¡Has desbloqueado un nuevo slime!');
        if (this._liveEl) {
            this._liveEl.textContent = '';
            requestAnimationFrame(() => {
                this._liveEl.textContent = `Recompensa desbloqueada: ${labelEl.textContent}. ${descEl.textContent}`;
            });
        }

        this.overlay.classList.add('open');
        this.overlay.style.display = 'flex';
        const closeBtn = this.overlay.querySelector('#slime-reward-close');
        if (closeBtn) closeBtn.focus();

        this._onCloseCb = onClose || null;
    }

    closeReward() {
        if (!this.overlay) return;
        this.overlay.classList.remove('open');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            if (this._initialFocus) {
                this._initialFocus.focus();
                this._initialFocus = null;
            }
            if (typeof this._onCloseCb === 'function') {
                this._onCloseCb();
                this._onCloseCb = null;
            }
        }, 150);
    }

    weightedRandom(pool, weights) {
        if (!Array.isArray(pool) || pool.length === 0) return null;
        if (!Array.isArray(weights) || weights.length !== pool.length) {
            return pool[Math.floor(Math.random() * pool.length)];
        }
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < pool.length; i++) {
            r -= weights[i];
            if (r <= 0) return pool[i];
        }
        return pool[pool.length - 1];
    }

    parseRewardKey(key) {
        if (!this.manifest?.branches) return null;
        const [charId, branchId] = key.split('.');
        if (!charId || !branchId) return null;
        return { characterId: charId, branchId };
    }

    getRewardPool(gameId) {
        if (!this.manifest?.consumption?.[gameId]) return [];
        return this.manifest.consumption[gameId].rewardPool || [];
    }
}

console.log('[SlimeReward] Módulo cargado: sistema de recompensas por sprites lista.');