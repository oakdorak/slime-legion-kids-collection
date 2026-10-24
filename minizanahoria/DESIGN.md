# 🥕 Minizanahoria: La Aventura Adaptativa
**Version:** 1.0 | **Ecosystem Protocol:** MAIAH v4.5 | **Clinical Target:** ASD Adaptive Skill Training

This document defines the functional design, clinical mechanics, and frontend architecture of **Minizanahoria: La Aventura Adaptativa**, a serious game designed to train neurodivergent children in adaptive skills.

---

## 🧬 Clinical Mechanics

### 1. Focus Orbit (Atención Conjunta)
* **Objective:** Direct scan path training and attention redirection.
* **Mechanic:** Minizanahoria stands in the center of a grid and turns to look at a specific quadrant (visual gaze vector). The child must identify where Minizanahoria is looking and click the corresponding glowing target.
* **Clinical Rationale:** Strengthens gaze-following capabilities, which is a foundational building block of joint attention.

### 2. Emotion Resonance (Reconocimiento Emocional)
* **Objective:** Emotion decoding and situational empathy.
* **Mechanic:** Minizanahoria exhibits an emotional state represented through animated vector expressions (Happy, Sad, Angry, Surprised, Tired). The child identifies the emotion and chooses an action card (e.g., "Darle agua", "Darle un abrazo", "Dejarle descansar") to soothe or celebrate with the mascot.
* **Clinical Rationale:** Builds cognitive empathy and connects visual emotional signals with adaptive social responses.

### 3. Routine Builder (Habilidades de Vida Diaria - ADL)
* **Objective:** Executive functioning, planning, and task-sequencing.
* **Mechanic:** The child is presented with a shuffled sequence of daily tasks (e.g., *Cepillarse los dientes*, *Ponerse la pijama*, *Leer un cuento*, *Ir a dormir*). They must drag and drop the steps into the correct chronological order.
* **Clinical Rationale:** Enhances sequencing, reduces executive overload, and translates structured routines into predictable patterns.

---

## 🎨 Visual Identity & Theme (Estética Robbit)
The game uses a high-contrast, distraction-free interface utilizing Oscar's tactical color palette:

*   **Background Dark:** `#231f24` (Deep comfort, low sensory stimulation)
*   **Lavender Accent:** `#896ab0` (Active states, selections, and glowing elements)
*   **Muted Gold:** `#9b8e6c` (Success badges, rewards, and achievements)
*   **Primary Text:** `#e3e0a4` (High contrast, readable labels)
*   **Sage Green:** `#a8b28a` (Correct selections, progress bars)

---

## 🛠️ Technical Implementation Stack
1.  **Frontend:** Single Page Application (HTML5, Vanilla CSS, Vanilla Javascript).
2.  **Vector Graphics:** Custom inline SVGs representing Minizanahoria with CSS-driven animations (idle, jump, spin, sad-sway).
3.  **Synthesizer Sound Engine:** Native Web Audio API synthesizing comforting sine/triangle wave chords. Zero remote assets, zero latency, 100% sovereign.
