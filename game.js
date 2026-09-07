/**
 * ============================================================================
 * DRAGON TEMPLE: CHASM ESCAPE - 3D Endless Runner Game Engine
 * Lead Game Developer & Graphics Engineer Implementation
 * Architecture: Modular OOP (TrackManager, PlayerController, DragonAI, CollectibleManager, ParticleSystem)
 * Stack: Three.js (r128 WebGL), HTML5, CSS3, Procedural Web Audio API
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. AUDIO ENGINE (Procedural Web Audio API)
  // ==========================================================================
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.musicOsc1 = null;
      this.musicOsc2 = null;
      this.musicGain = null;
      this.isMusicPlaying = false;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playCoinSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }

    playDiamondSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.04;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.1);
      });
    }

    playPowerupSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    }

    playWhooshSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    }

    playParachuteSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    }

    playDragonRoar() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.3);
      osc.frequency.linearRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    }

    playFireBreath() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(300, now + 0.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.8);
    }

    playCrashSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    }

    startMusic() {
      if (!this.ctx || this.isMusicPlaying || this.isMuted) return;
      this.isMusicPlaying = true;
      this.musicOsc1 = this.ctx.createOscillator();
      this.musicOsc2 = this.ctx.createOscillator();
      this.musicGain = this.ctx.createGain();

      this.musicOsc1.type = 'sawtooth';
      this.musicOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

      this.musicOsc2.type = 'sine';
      this.musicOsc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

      this.musicGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.musicOsc1.connect(this.musicGain);
      this.musicOsc2.connect(this.musicGain);
      this.musicGain.connect(this.ctx.destination);

      this.musicOsc1.start();
      this.musicOsc2.start();
    }

    stopMusic() {
      if (this.musicOsc1) {
        try { this.musicOsc1.stop(); } catch (e) {}
        this.musicOsc1 = null;
      }
      if (this.musicOsc2) {
        try { this.musicOsc2.stop(); } catch (e) {}
        this.musicOsc2 = null;
      }
      this.isMusicPlaying = false;
    }
  }

  // ==========================================================================
  // 2. TEXTURE & PROCEDURAL MATERIAL GENERATOR
  // ==========================================================================
  class TextureGenerator {
    static createStoneTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#4a5552';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#2d3533';
      ctx.lineWidth = 6;
      const rows = 8;
      const cols = 4;
      const rh = 512 / rows;
      const cw = 512 / cols;

      for (let r = 0; r < rows; r++) {
        const y = r * rh;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();

        const offset = (r % 2) * (cw / 2);
        for (let c = 0; c <= cols + 1; c++) {
          const x = c * cw - offset;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + rh);
          ctx.stroke();
        }
      }

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 10)); // Green moss tint
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    }

    static createWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(0, 0, 256, 256);

      ctx.strokeStyle = '#3d2514';
      ctx.lineWidth = 3;
      for (let i = 0; i < 30; i++) {
        const y = Math.random() * 256;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(80, y + (Math.random() * 20 - 10), 160, y + (Math.random() * 20 - 10), 256, y);
        ctx.stroke();
      }

      return new THREE.CanvasTexture(canvas);
    }

    static createCoinTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, '#fff3a0');
      grad.addColorStop(0.5, '#ffca28');
      grad.addColorStop(1, '#c79100');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      ctx.fillStyle = '#ff8f00';
      ctx.beginPath();
      ctx.arc(64, 64, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff3a0';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 64, 64);

      return new THREE.CanvasTexture(canvas);
    }

    static createDragonScaleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#1c0a0a';
      ctx.fillRect(0, 0, 256, 256);

      ctx.strokeStyle = '#ff3d00';
      ctx.lineWidth = 2;
      const size = 16;
      for (let y = 0; y < 256; y += size) {
        for (let x = 0; x < 256; x += size) {
          ctx.beginPath();
          ctx.arc(x + size / 2, y, size / 2, 0, Math.PI);
          ctx.stroke();
        }
      }
      return new THREE.CanvasTexture(canvas);
    }

    static createParachuteTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Olive-drab and gold tactical canopy stripes
      const stripeW = 256 / 8;
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#4b5320' : '#8b8000'; // Olive drab & dark gold
        ctx.fillRect(i * stripeW, 0, stripeW, 256);
      }

      return new THREE.CanvasTexture(canvas);
    }
  }

  // ==========================================================================
  // 3. MODEL FACTORY (Procedural 3D Geometries & Meshes)
  // ==========================================================================
  class ModelFactory {
    constructor() {
      this.stoneTex = TextureGenerator.createStoneTexture();
      this.woodTex = TextureGenerator.createWoodTexture();
      this.coinTex = TextureGenerator.createCoinTexture();
      this.dragonScaleTex = TextureGenerator.createDragonScaleTexture();
      this.parachuteTex = TextureGenerator.createParachuteTexture();

      this.stoneMat = new THREE.MeshStandardMaterial({
        map: this.stoneTex,
        roughness: 0.75,
        metalness: 0.15
      });
      this.woodMat = new THREE.MeshStandardMaterial({
        map: this.woodTex,
        roughness: 0.7
      });
      this.goldMat = new THREE.MeshStandardMaterial({
        map: this.coinTex,
        roughness: 0.3,
        metalness: 0.85
      });
      this.diamondMat = new THREE.MeshPhysicalMaterial({
        color: 0x00e5ff,
        emissive: 0x0088aa,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.7,
        transparent: true,
        opacity: 0.95
      });
      this.mysteryBoxMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e, // Emerald gift wrap box
        roughness: 0.3,
        metalness: 0.4
      });
      this.ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red ribbon
        roughness: 0.4
      });
    }

    createPlayerMesh() {
      const group = new THREE.Group();

      const shirtMat = new THREE.MeshStandardMaterial({ color: 0x00e699, roughness: 0.6 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xe5a97d, roughness: 0.8 });
      const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

      // Torso
      const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.4);
      const torso = new THREE.Mesh(torsoGeo, shirtMat);
      torso.position.y = 1.35;
      torso.castShadow = true;
      group.add(torso);

      // Backpack
      const packGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
      const backpack = new THREE.Mesh(packGeo, leatherMat);
      backpack.position.set(0, 1.4, -0.3);
      backpack.castShadow = true;
      group.add(backpack);

      // Head
      const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 2.05;
      head.castShadow = true;
      group.add(head);

      // Explorer Hat
      const hatGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.1, 16);
      const hatMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
      const hat = new THREE.Mesh(hatGeo, hatMat);
      hat.position.y = 2.25;
      group.add(hat);

      // Arms
      const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
      armGeo.translate(0, -0.3, 0);

      const armL = new THREE.Mesh(armGeo, shirtMat);
      armL.position.set(-0.48, 1.7, 0);
      armL.castShadow = true;
      group.add(armL);

      const armR = new THREE.Mesh(armGeo, shirtMat);
      armR.position.set(0.48, 1.7, 0);
      armR.castShadow = true;
      group.add(armR);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
      legGeo.translate(0, -0.4, 0);

      const legL = new THREE.Mesh(legGeo, pantsMat);
      legL.position.set(-0.2, 0.9, 0);
      legL.castShadow = true;
      group.add(legL);

      const legR = new THREE.Mesh(legGeo, pantsMat);
      legR.position.set(0.2, 0.9, 0);
      legR.castShadow = true;
      group.add(legR);

      // PARACHUTE CANOPY MESH (Olive-drab canopy)
      const parachuteGroup = new THREE.Group();
      parachuteGroup.position.set(0, 2.5, 0);
      parachuteGroup.visible = false;

      const canopyGeo = new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const canopyMat = new THREE.MeshStandardMaterial({
        map: this.parachuteTex,
        side: THREE.DoubleSide,
        roughness: 0.5
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.y = 2.0;
      parachuteGroup.add(canopy);

      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(angle) * 2.2, 2.0, Math.sin(angle) * 2.2),
          new THREE.Vector3(0, 0, 0)
        ]);
        const line = new THREE.Line(lineGeo, lineMat);
        parachuteGroup.add(line);
      }

      group.add(parachuteGroup);

      // Shield Aura Mesh
      const shieldGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.y = 1.2;
      shieldMesh.visible = false;
      group.add(shieldMesh);

      return {
        group: group,
        torso: torso,
        armL: armL,
        armR: armR,
        legL: legL,
        legR: legR,
        head: head,
        parachuteGroup: parachuteGroup,
        shieldMesh: shieldMesh
      };
    }

    createDragonMesh() {
      const group = new THREE.Group();

      const dragonMat = new THREE.MeshStandardMaterial({
        map: this.dragonScaleTex,
        color: 0xcc2211,
        roughness: 0.4,
        metalness: 0.3
      });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      const wingMembraneMat = new THREE.MeshStandardMaterial({
        color: 0x991100,
        side: THREE.DoubleSide,
        roughness: 0.6
      });

      // Body/Torso
      const bodyGeo = new THREE.ConeGeometry(1.6, 4.5, 8);
      bodyGeo.rotateX(Math.PI * 0.5);
      const body = new THREE.Mesh(bodyGeo, dragonMat);
      body.castShadow = true;
      group.add(body);

      // Neck & Head
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.2, 2.2);

      const headGeo = new THREE.BoxGeometry(1.2, 1.0, 1.8);
      const head = new THREE.Mesh(headGeo, dragonMat);
      head.position.z = 0.9;
      head.castShadow = true;
      headGroup.add(head);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
      eyeL.position.set(-0.5, 0.3, 1.3);
      headGroup.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
      eyeR.position.set(0.5, 0.3, 1.3);
      headGroup.add(eyeR);

      // Snapping Jaw
      const jawGeo = new THREE.BoxGeometry(1.0, 0.4, 1.6);
      jawGeo.translate(0, -0.2, 0.8);
      const jaw = new THREE.Mesh(jawGeo, dragonMat);
      headGroup.add(jaw);

      group.add(headGroup);

      // WINGS
      const wingL = new THREE.Group();
      wingL.position.set(-1.2, 0.8, 0.5);

      const wingBoneGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.0);
      wingBoneGeo.rotateZ(Math.PI * 0.4);
      const wingBoneL = new THREE.Mesh(wingBoneGeo, dragonMat);
      wingL.add(wingBoneL);

      const membraneShape = new THREE.Shape();
      membraneShape.moveTo(0, 0);
      membraneShape.lineTo(-3.8, 1.2);
      membraneShape.lineTo(-2.8, -2.2);
      membraneShape.lineTo(0, -0.5);
      const membraneGeo = new THREE.ShapeGeometry(membraneShape);
      const membraneL = new THREE.Mesh(membraneGeo, wingMembraneMat);
      wingL.add(membraneL);
      group.add(wingL);

      const wingR = new THREE.Group();
      wingR.position.set(1.2, 0.8, 0.5);

      const wingBoneR = new THREE.Mesh(wingBoneGeo, dragonMat);
      wingBoneR.rotation.y = Math.PI;
      wingR.add(wingBoneR);

      const membraneR = new THREE.Mesh(membraneGeo, wingMembraneMat);
      membraneR.scale.x = -1;
      wingR.add(membraneR);
      group.add(wingR);

      return {
        group: group,
        wingL: wingL,
        wingR: wingR,
        jaw: jaw,
        headGroup: headGroup
      };
    }

    createCoinMesh() {
      const geo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16);
      geo.rotateX(Math.PI * 0.5);
      const coin = new THREE.Mesh(geo, this.goldMat);
      coin.castShadow = true;
      return coin;
    }

    createDiamondMesh() {
      const geo = new THREE.OctahedronGeometry(0.55, 0);
      const diamond = new THREE.Mesh(geo, this.diamondMat);
      diamond.castShadow = true;
      return diamond;
    }

    createMysteryBoxMesh() {
      const group = new THREE.Group();
      const boxGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const box = new THREE.Mesh(boxGeo, this.mysteryBoxMat);
      box.castShadow = true;
      group.add(box);

      // Wrapped Red Ribbon Cross
      const ribbon1Geo = new THREE.BoxGeometry(0.95, 0.95, 0.2);
      const ribbon1 = new THREE.Mesh(ribbon1Geo, this.ribbonMat);
      group.add(ribbon1);

      const ribbon2Geo = new THREE.BoxGeometry(0.2, 0.95, 0.95);
      const ribbon2 = new THREE.Mesh(ribbon2Geo, this.ribbonMat);
      group.add(ribbon2);

      return group;
    }

    createLadderMesh() {
      const group = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8 });
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const hazardMat = new THREE.MeshStandardMaterial({ color: 0xff3d00, emissive: 0x881100, roughness: 0.5 });

      const railGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8);
      const railL = new THREE.Mesh(railGeo, woodMat);
      railL.position.set(-1.2, 1.8, 0);
      railL.castShadow = true;
      group.add(railL);

      const railR = new THREE.Mesh(railGeo, woodMat);
      railR.position.set(1.2, 1.8, 0);
      railR.castShadow = true;
      group.add(railR);

      const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8);
      rungGeo.rotateZ(Math.PI * 0.5);
      for (let y = 0.4; y <= 3.2; y += 0.55) {
        const rung = new THREE.Mesh(rungGeo, woodMat);
        rung.position.set(0, y, 0);
        rung.castShadow = true;
        group.add(rung);
      }

      const bracketGeo = new THREE.BoxGeometry(2.6, 0.15, 0.25);
      const topBracket = new THREE.Mesh(bracketGeo, ironMat);
      topBracket.position.set(0, 3.4, 0);
      group.add(topBracket);

      const hazardSignGeo = new THREE.BoxGeometry(2.0, 0.4, 0.1);
      const hazardSign = new THREE.Mesh(hazardSignGeo, hazardMat);
      hazardSign.position.set(0, 2.2, 0.1);
      group.add(hazardSign);

      return group;
    }
  }

  // ==========================================================================
  // 4. PARTICLE SYSTEM ENGINE
  // ==========================================================================
  class ParticleSystem {
    constructor(scene) {
      this.scene = scene;
      this.particles = [];

      const pCount = 400;
      this.geometry = new THREE.BufferGeometry();
      this.positions = new Float32Array(pCount * 3);
      this.colors = new Float32Array(pCount * 3);

      for (let i = 0; i < pCount; i++) {
        this.positions[i * 3] = 0;
        this.positions[i * 3 + 1] = -500;
        this.positions[i * 3 + 2] = 0;

        this.colors[i * 3] = 1;
        this.colors[i * 3 + 1] = 0.5;
        this.colors[i * 3 + 2] = 0;
      }

      this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      this.particleSystem = new THREE.Points(this.geometry, pMat);
      this.scene.add(this.particleSystem);
    }

    emitFireBurst(pos, laneX) {
      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: pos.x + (Math.random() - 0.5) * 1.5,
          y: pos.y + (Math.random() - 0.5) * 1.0,
          z: pos.z,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          vz: 12 + Math.random() * 8,
          life: 1.0,
          maxLife: 0.6 + Math.random() * 0.4,
          r: 1.0, g: 0.3 + Math.random() * 0.4, b: 0.0
        });
      }
    }

    emitSparkles(pos, colorHex) {
      const color = new THREE.Color(colorHex);
      for (let i = 0; i < 24; i++) {
        this.particles.push({
          x: pos.x,
          y: pos.y + 0.5,
          z: pos.z,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 6 + 2,
          vz: (Math.random() - 0.5) * 6,
          life: 1.0,
          maxLife: 0.5,
          r: color.r, g: color.g, b: color.b
        });
      }
    }

    update(dt) {
      const posAttr = this.geometry.attributes.position;
      const colAttr = this.geometry.attributes.color;

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt / p.maxLife;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }

      for (let i = 0; i < 400; i++) {
        if (i < this.particles.length) {
          const p = this.particles[i];
          posAttr.setXYZ(i, p.x, p.y, p.z);
          colAttr.setXYZ(i, p.r * p.life, p.g * p.life, p.b * p.life);
        } else {
          posAttr.setXYZ(i, 0, -500, 0);
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  }

  // ==========================================================================
  // 5. TRACK MANAGER & PROCEDURAL CHUNK POOLING
  // ==========================================================================
  class TrackManager {
    constructor(scene, modelFactory) {
      this.scene = scene;
      this.modelFactory = modelFactory;
      this.chunkLength = 40.0;
      this.maxChunks = 18; // Active pooled chunks
      this.activeChunks = [];
      this.obstacles = [];

      this.TYPES = {
        SOLID_BRIDGE: 'solid_bridge',
        BROKEN_PLANKS: 'broken_planks',
        GAP: 'gap',
        LOW_ARCH: 'low_arch',
        WATERFALL_CROSSING: 'waterfall_crossing',
        LADDER: 'ladder'
      };

      this.currentZ = 0;
    }

    initTrack() {
      for (let i = 0; i < 6; i++) {
        this.spawnChunk(this.TYPES.SOLID_BRIDGE, i === 0);
      }
    }

    spawnChunk(type, isFirst = false) {
      const group = new THREE.Group();
      group.position.z = this.currentZ;

      const chunkData = {
        type: type,
        zStart: this.currentZ,
        zEnd: this.currentZ + this.chunkLength,
        group: group
      };

      if (type === this.TYPES.SOLID_BRIDGE) {
        this.buildStoneBridge(group);
      } else if (type === this.TYPES.BROKEN_PLANKS) {
        this.buildBrokenPlanksBridge(group);
      } else if (type === this.TYPES.GAP) {
        this.buildGapSection(group, chunkData);
      } else if (type === this.TYPES.WATERFALL_CROSSING) {
        this.buildWaterfallSection(group);
      } else if (type === this.TYPES.LOW_ARCH) {
        this.buildStoneBridge(group);
        this.spawnLowArchObstacle(group, this.currentZ);
      } else if (type === this.TYPES.LADDER) {
        this.buildStoneBridge(group);
        this.spawnLadderObstacle(group, this.currentZ);
      }

      this.scene.add(group);
      this.activeChunks.push(chunkData);
      this.currentZ += this.chunkLength;
    }

    buildStoneBridge(group) {
      const floorGeo = new THREE.BoxGeometry(12, 1.0, this.chunkLength);
      const floor = new THREE.Mesh(floorGeo, this.modelFactory.stoneMat);
      floor.position.set(0, -0.5, this.chunkLength / 2);
      floor.receiveShadow = true;
      group.add(floor);

      for (let z = 5; z < this.chunkLength; z += 15) {
        const pillarGeo = new THREE.BoxGeometry(1.2, 4.0, 1.2);
        const pillarL = new THREE.Mesh(pillarGeo, this.modelFactory.stoneMat);
        pillarL.position.set(-6.5, 1.5, z);
        group.add(pillarL);

        const pillarR = new THREE.Mesh(pillarGeo, this.modelFactory.stoneMat);
        pillarR.position.set(6.5, 1.5, z);
        group.add(pillarR);

        const torchLight = new THREE.PointLight(0xff7700, 1.2, 12);
        torchLight.position.set(-5.5, 3.2, z);
        group.add(torchLight);
      }
    }

    buildBrokenPlanksBridge(group) {
      const plankGeo = new THREE.BoxGeometry(11, 0.3, 1.2);
      for (let z = 1; z < this.chunkLength - 1; z += 2.4) {
        if (Math.random() < 0.25) continue; // Missing broken plank!
        const plank = new THREE.Mesh(plankGeo, this.modelFactory.woodMat);
        plank.position.set(0, -0.15, z);
        plank.receiveShadow = true;
        group.add(plank);
      }
    }

    buildGapSection(group, chunkData) {
      const solidLen = 12.0;
      const floor1 = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, solidLen), this.modelFactory.stoneMat);
      floor1.position.set(0, -0.5, solidLen / 2);
      group.add(floor1);

      const floor2 = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, solidLen), this.modelFactory.stoneMat);
      floor2.position.set(0, -0.5, this.chunkLength - solidLen / 2);
      group.add(floor2);

      chunkData.gapZStart = chunkData.zStart + solidLen;
      chunkData.gapZEnd = chunkData.zEnd - solidLen;
    }

    buildWaterfallSection(group) {
      this.buildStoneBridge(group);

      // Cascading mist plane
      const mistGeo = new THREE.PlaneGeometry(16, 20);
      const mistMat = new THREE.MeshBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const mist = new THREE.Mesh(mistGeo, mistMat);
      mist.position.set(-8, -8, this.chunkLength / 2);
      mist.rotation.y = Math.PI * 0.5;
      group.add(mist);
    }

    spawnLowArchObstacle(group, zBase) {
      const archGeo = new THREE.BoxGeometry(12, 1.8, 1.5);
      const arch = new THREE.Mesh(archGeo, this.modelFactory.stoneMat);
      arch.position.set(0, 2.5, 20.0);
      arch.castShadow = true;
      group.add(arch);

      this.obstacles.push({
        type: 'low_arch',
        z: zBase + 20.0,
        height: 1.6
      });
    }

    spawnLadderObstacle(group, zBase) {
      const laneIdx = Math.floor(Math.random() * 3);
      const x = (laneIdx - 1) * 3.5;

      const ladderMesh = this.modelFactory.createLadderMesh();
      ladderMesh.position.set(x, 0, 20.0);
      group.add(ladderMesh);

      const laneIndices = [laneIdx];
      if (Math.random() < 0.4) {
        const secondLane = (laneIdx + 1) % 3;
        const x2 = (secondLane - 1) * 3.5;
        const ladder2 = this.modelFactory.createLadderMesh();
        ladder2.position.set(x2, 0, 20.0);
        group.add(ladder2);
        laneIndices.push(secondLane);
      }

      this.obstacles.push({
        type: 'ladder',
        z: zBase + 20.0,
        x: x,
        laneIndices: laneIndices
      });
    }

    update(playerZ, collectibleManager) {
      while (this.currentZ < playerZ + 220) {
        const rand = Math.random();
        let type = this.TYPES.SOLID_BRIDGE;
        if (rand < 0.2) type = this.TYPES.BROKEN_PLANKS;
        else if (rand < 0.4) type = this.TYPES.GAP;
        else if (rand < 0.6) type = this.TYPES.LOW_ARCH;
        else if (rand < 0.8) type = this.TYPES.WATERFALL_CROSSING;
        else type = this.TYPES.LADDER;

        const newChunk = this.spawnChunk(type);
        const lastChunkData = this.activeChunks[this.activeChunks.length - 1];
        collectibleManager.spawnCollectiblesForChunk(lastChunkData);
      }

      // Recycle passed chunks behind player
      for (let i = this.activeChunks.length - 1; i >= 0; i--) {
        const chunk = this.activeChunks[i];
        if (chunk.zEnd < playerZ - 35) {
          this.scene.remove(chunk.group);
          this.activeChunks.splice(i, 1);
        }
      }
    }

    isOverGap(playerZ) {
      for (let chunk of this.activeChunks) {
        if (chunk.type === this.TYPES.GAP) {
          if (playerZ >= chunk.gapZStart && playerZ <= chunk.gapZEnd) {
            return true;
          }
        }
      }
      return false;
    }
  }

  // ==========================================================================
  // 6. COLLECTIBLE MANAGER
  // ==========================================================================
  class CollectibleManager {
    constructor(scene, modelFactory) {
      this.scene = scene;
      this.modelFactory = modelFactory;
      this.collectibles = [];
    }

    reset() {
      for (let c of this.collectibles) {
        if (c.group) c.group.remove(c.mesh);
      }
      this.collectibles = [];
    }

    spawnCollectiblesForChunk(chunkData) {
      const group = chunkData.group;
      const laneX = [-3.5, 0, 3.5];

      // Gold Coins (High frequency lane arcs)
      const coinLane = Math.floor(Math.random() * 3);
      const coinX = laneX[coinLane];
      const startZ = chunkData.zStart + 8;

      for (let i = 0; i < 5; i++) {
        const coin = this.modelFactory.createCoinMesh();
        const z = startZ + i * 2.5;
        const y = 1.2;
        coin.position.set(coinX, y, z - chunkData.zStart);
        group.add(coin);

        this.collectibles.push({
          mesh: coin,
          group: group,
          type: 'coin',
          worldPos: new THREE.Vector3(coinX, y, z),
          collected: false
        });
      }

      // Cyan Diamonds (Uncommon/Rare over gaps or high floats)
      if (Math.random() < 0.65) {
        const diamondLane = (coinLane + 1) % 3;
        const diamondX = laneX[diamondLane];
        const diamondZ = chunkData.zStart + 24;
        const diamondY = 2.4;

        const diamond = this.modelFactory.createDiamondMesh();
        diamond.position.set(diamondX, diamondY, diamondZ - chunkData.zStart);
        group.add(diamond);

        this.collectibles.push({
          mesh: diamond,
          group: group,
          type: 'diamond',
          worldPos: new THREE.Vector3(diamondX, diamondY, diamondZ),
          collected: false
        });
      }

      // Gift Mystery Boxes (Ultra Rare wrapped box)
      if (Math.random() < 0.3) {
        const boxLane = (coinLane + 2) % 3;
        const boxX = laneX[boxLane];
        const boxZ = chunkData.zStart + 32;

        const box = this.modelFactory.createMysteryBoxMesh();
        box.position.set(boxX, 1.5, boxZ - chunkData.zStart);
        group.add(box);

        this.collectibles.push({
          mesh: box,
          group: group,
          type: 'mystery_box',
          worldPos: new THREE.Vector3(boxX, 1.5, boxZ),
          collected: false
        });
      }
    }

    update() {
      for (let c of this.collectibles) {
        if (!c.collected) {
          c.mesh.rotation.y += 0.04;
        }
      }
    }
  }

  // ==========================================================================
  // 7. PLAYER CONTROLLER ENGINE
  // ==========================================================================
  class PlayerController {
    constructor(scene, modelFactory, audioEngine, particleSystem) {
      this.scene = scene;
      this.audio = audioEngine;
      this.particles = particleSystem;

      this.playerObj = modelFactory.createPlayerMesh();
      this.meshGroup = this.playerObj.group;
      this.scene.add(this.meshGroup);

      this.lanes = [-3.5, 0.0, 3.5];
      this.currentLane = 1;

      this.position = new THREE.Vector3(0, 0, 0);
      this.velocityY = 0;
      this.gravity = 28.0;
      this.jumpStrength = 12.0;
      this.baseSpeed = 18.0; // Responsive high-speed runner pace
      this.speedMultiplier = 1.0;

      this.isGrounded = true;
      this.isJumping = false;
      this.isSliding = false;
      this.slideTimer = 0;
      this.isFalling = false;
      this.isGliding = false;
      this.parachuteCharges = 1;
      this.stumbleTimer = 0;

      // Powerups
      this.magnetTimer = 0;
      this.shieldActive = false;

      this.animTime = 0;
    }

    reset() {
      this.currentLane = 1;
      this.position.set(0, 0, 0);
      this.velocityY = 0;
      this.isGrounded = true;
      this.isJumping = false;
      this.isSliding = false;
      this.slideTimer = 0;
      this.isFalling = false;
      this.isGliding = false;
      this.parachuteCharges = 1;
      this.stumbleTimer = 0;
      this.magnetTimer = 0;
      this.shieldActive = false;
      this.speedMultiplier = 1.0;
      this.playerObj.torso.rotation.x = 0.0;
      this.playerObj.parachuteGroup.visible = false;
      this.playerObj.shieldMesh.visible = false;
      this.meshGroup.position.set(0, 0, 0);
    }

    moveLeft() {
      if (this.currentLane > 0) {
        this.currentLane--;
        this.audio.playWhooshSound();
      }
    }

    moveRight() {
      if (this.currentLane < 2) {
        this.currentLane++;
        this.audio.playWhooshSound();
      }
    }

    jump() {
      if (this.isGrounded && !this.isSliding) {
        this.velocityY = this.jumpStrength;
        this.isGrounded = false;
        this.isJumping = true;
        this.audio.playWhooshSound();
      }
    }

    slide() {
      if (this.isGrounded && !this.isSliding) {
        this.isSliding = true;
        this.slideTimer = 0.8;
        this.audio.playWhooshSound();
      }
    }

    deployParachute() {
      if (this.isFalling && !this.isGliding && this.parachuteCharges > 0) {
        this.isGliding = true;
        this.parachuteCharges--;
        this.velocityY = -2.0;
        this.playerObj.parachuteGroup.visible = true;
        this.audio.playParachuteSound();

        const alert = document.getElementById('alert-banner');
        const text = document.getElementById('alert-text');
        if (alert && text) {
          text.textContent = '🪂 PARACHUTE GLIDE ACTIVE!';
          alert.classList.remove('hidden');
          setTimeout(() => alert.classList.add('hidden'), 2000);
        }
      }
    }

    update(dt, trackManager) {
      const currentSpeed = this.baseSpeed * this.speedMultiplier;

      // 1. Forward Movement
      this.position.z += currentSpeed * dt;

      // 2. Ultra-Snappy LERP Lane Switching (24.0 speed)
      const targetX = this.lanes[this.currentLane];
      this.position.x += (targetX - this.position.x) * 24.0 * dt;

      // Bank roll angle
      const bankAngle = (this.position.x - targetX) * -0.07;
      this.meshGroup.rotation.z = bankAngle;

      // 3. Slide Timer
      if (this.isSliding) {
        this.slideTimer -= dt;
        this.meshGroup.scale.y = 0.45;
        if (this.slideTimer <= 0) {
          this.isSliding = false;
          this.meshGroup.scale.y = 1.0;
        }
      }

      // 4. Stumble Slowdown
      if (this.stumbleTimer > 0) {
        this.stumbleTimer -= dt;
        this.speedMultiplier = 0.55;
      } else {
        this.speedMultiplier = 1.0 + (this.position.z / 2000);
      }

      // 5. Magnet Timer
      if (this.magnetTimer > 0) {
        this.magnetTimer -= dt;
        const magBadge = document.getElementById('magnet-badge');
        const magBar = document.getElementById('magnet-timer-bar');
        if (magBadge && magBar) {
          magBadge.classList.remove('hidden');
          magBar.style.width = (this.magnetTimer / 8.0 * 100) + '%';
        }
      } else {
        const magBadge = document.getElementById('magnet-badge');
        if (magBadge) magBadge.classList.add('hidden');
      }

      // 6. Gravity & Gap Mechanics
      const overGap = trackManager.isOverGap(this.position.z);

      if (overGap && this.position.y <= 0.1) {
        if (!this.isGliding) {
          this.isFalling = true;
          this.isGrounded = false;
          this.velocityY -= this.gravity * dt;
          this.position.y += this.velocityY * dt;

          const pBtn = document.getElementById('parachute-btn');
          if (pBtn) pBtn.classList.add('active-falling');
        } else {
          // GLIDING WITH PARACHUTE
          this.velocityY = -2.0;
          this.position.y += this.velocityY * dt;

          if (this.position.y <= 0) {
            this.position.y = 0;
            this.isFalling = false;
            this.isGliding = false;
            this.isGrounded = true;
            this.playerObj.parachuteGroup.visible = false;
            const pBtn = document.getElementById('parachute-btn');
            if (pBtn) pBtn.classList.remove('active-falling');
          }
        }
      } else {
        const pBtn = document.getElementById('parachute-btn');
        if (pBtn) pBtn.classList.remove('active-falling');

        if (!this.isGrounded) {
          this.velocityY -= this.gravity * dt;
          this.position.y += this.velocityY * dt;

          if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocityY = 0;
            this.isGrounded = true;
            this.isJumping = false;
            if (this.isGliding) {
              this.isGliding = false;
              this.playerObj.parachuteGroup.visible = false;
            }
          }
        }
      }

      // 7. Energetic High-Speed Sprint Running Animation
      if (this.isGrounded && !this.isSliding) {
        this.animTime += dt * currentSpeed * 1.2;
        
        // Torso Forward Sprint Posture
        this.playerObj.torso.rotation.x = 0.25;
        this.playerObj.torso.position.y = 1.35 + Math.abs(Math.sin(this.animTime)) * 0.08;

        // Dynamic High Knee Stride & Arm Pumping
        const stride = Math.sin(this.animTime) * 0.9;
        this.playerObj.legL.rotation.x = stride;
        this.playerObj.legR.rotation.x = -stride;
        this.playerObj.armL.rotation.x = -stride * 1.1;
        this.playerObj.armR.rotation.x = stride * 1.1;

        // Footstep dust particles during sprint
        if (Math.random() < 0.2) {
          this.particles.emitSparkles(new THREE.Vector3(this.position.x, 0.1, this.position.z), 0x94a3b8);
        }
      } else if (this.isJumping) {
        this.playerObj.torso.rotation.x = 0.1;
        this.playerObj.legL.rotation.x = -0.6;
        this.playerObj.legR.rotation.x = -0.9;
      } else {
        this.playerObj.torso.rotation.x = 0.0;
        this.playerObj.torso.position.y = 1.35;
      }

      // Sync position
      this.meshGroup.position.copy(this.position);

      // HUD Badge Count
      const pCount = document.getElementById('parachute-count');
      if (pCount) pCount.textContent = this.parachuteCharges;
    }

    triggerStumble() {
      if (this.shieldActive) {
        this.shieldActive = false;
        this.playerObj.shieldMesh.visible = false;
        this.particles.emitSparkles(this.position, 0x00e5ff);
        return;
      }

      if (this.stumbleTimer <= 0) {
        this.stumbleTimer = 1.2;
        this.audio.playCrashSound();
        this.particles.emitSparkles(this.position, 0xff3d00);
      }
    }
  }

  // ==========================================================================
  // 8. PURSUING DRAGON AI ENGINE
  // ==========================================================================
  class DragonAI {
    constructor(scene, modelFactory, audioEngine, particleSystem) {
      this.scene = scene;
      this.audio = audioEngine;
      this.particles = particleSystem;

      this.dragonObj = modelFactory.createDragonMesh();
      this.meshGroup = this.dragonObj.group;
      this.scene.add(this.meshGroup);

      this.distanceBehind = 14.0;
      this.wingTime = 0;
      this.fireTimer = 12.0;
      this.chaseTimer = 7.0; // 7 seconds of initial pursuit
    }

    reset(playerZ) {
      this.distanceBehind = 14.0;
      this.meshGroup.position.set(0, 3.5, playerZ - this.distanceBehind);
      this.fireTimer = 12.0;
      this.chaseTimer = 7.0; // Chase for initial 7 seconds
      this.meshGroup.visible = true;
    }

    update(dt, playerPos, playerStumbling) {
      if (playerStumbling) {
        this.distanceBehind = Math.max(4.5, this.distanceBehind - 12.0 * dt);
        this.chaseTimer = 5.0; // Swoop back in when player stumbles!
        this.meshGroup.visible = true;
        this.audio.playDragonRoar();
      } else {
        this.distanceBehind = Math.min(14.0, this.distanceBehind + 2.5 * dt);
      }

      if (this.chaseTimer > 0) {
        this.chaseTimer -= dt;
        this.meshGroup.visible = true;

        if (this.chaseTimer <= 0 && this.meshGroup.visible) {
          // Dragon flies up into clouds and disappears after 7 seconds!
          this.meshGroup.visible = false;
          const alert = document.getElementById('alert-banner');
          const text = document.getElementById('alert-text');
          if (alert && text) {
            text.textContent = '🐉 DRAGON RETREATED INTO THE MIST!';
            alert.classList.remove('hidden');
            setTimeout(() => alert.classList.add('hidden'), 2200);
          }
        }
      }

      if (!this.meshGroup.visible) return;

      const targetZ = playerPos.z - this.distanceBehind;
      const targetX = playerPos.x * 0.7;
      const targetY = playerPos.y + 3.8;

      this.meshGroup.position.x += (targetX - this.meshGroup.position.x) * 4.0 * dt;
      this.meshGroup.position.y += (targetY - this.meshGroup.position.y) * 4.0 * dt;
      this.meshGroup.position.z = targetZ;

      // Wing flapping animation (sine wave)
      this.wingTime += dt * 8.0;
      const wingAngle = Math.sin(this.wingTime) * 0.4;
      this.dragonObj.wingL.rotation.z = wingAngle;
      this.dragonObj.wingR.rotation.z = -wingAngle;
      this.dragonObj.jaw.rotation.x = Math.abs(Math.sin(this.wingTime * 0.5)) * 0.3;

      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.triggerFireAttack(playerPos);
        this.fireTimer = 14.0 + Math.random() * 6.0;
      }
    }

    triggerFireAttack(playerPos) {
      this.chaseTimer = 4.0; // Dragon re-appears for fire attack
      this.meshGroup.visible = true;
      this.audio.playDragonRoar();
      this.audio.playFireBreath();

      const alert = document.getElementById('alert-banner');
      const text = document.getElementById('alert-text');
      if (alert && text) {
        text.textContent = '🔥 DRAGON FIRE BREATH! SWITCH LANES!';
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 2200);
      }

      this.particles.emitFireBurst(this.meshGroup.position, playerPos.x);
    }
  }

  // ==========================================================================
  // 9. MAIN GAME ENGINE
  // ==========================================================================
  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.scene.background = new THREE.Color(0x0e1816);
      this.scene.fog = new THREE.FogExp2(0x0e1816, 0.012);

      const ambientLight = new THREE.AmbientLight(0xd4e4e0, 0.65);
      this.scene.add(ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
      this.sunLight.position.set(20, 40, -10);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 150;
      this.sunLight.shadow.camera.left = -20;
      this.sunLight.shadow.camera.right = 20;
      this.sunLight.shadow.camera.top = 20;
      this.sunLight.shadow.camera.bottom = -20;
      this.scene.add(this.sunLight);

      this.audio = new AudioEngine();
      this.modelFactory = new ModelFactory();
      this.particles = new ParticleSystem(this.scene);
      this.trackManager = new TrackManager(this.scene, this.modelFactory);
      this.collectibleManager = new CollectibleManager(this.scene, this.modelFactory);
      this.player = new PlayerController(this.scene, this.modelFactory, this.audio, this.particles);
      this.dragon = new DragonAI(this.scene, this.modelFactory, this.audio, this.particles);

      this.state = 'MENU';
      this.coins = 0;
      this.diamonds = 0;
      this.highScore = parseInt(localStorage.getItem('dragon_temple_high_score') || '0');

      this.clock = new THREE.Clock();

      this.initEvents();
      this.updateHighScoreDisplay();
      this.trackManager.initTrack();

      // Start camera positioned dramatically right behind the pursuing dragon
      this.camera.position.set(0, 5.2, -18.0);
      this.camera.lookAt(0, 2.0, 10.0);
    }

    initEvents() {
      window.addEventListener('resize', () => this.onWindowResize());

      window.addEventListener('keydown', (e) => {
        if (this.state !== 'PLAYING') return;

        switch (e.code) {
          case 'ArrowLeft':
          case 'KeyA':
            this.player.moveLeft();
            break;
          case 'ArrowRight':
          case 'KeyD':
            this.player.moveRight();
            break;
          case 'ArrowUp':
          case 'KeyW':
          case 'Space':
            this.player.jump();
            break;
          case 'ArrowDown':
          case 'KeyS':
            this.player.slide();
            break;
          case 'KeyP':
            this.player.deployParachute();
            break;
        }
      });

      document.getElementById('start-btn').addEventListener('click', () => this.startGame());
      document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
      document.getElementById('parachute-btn').addEventListener('click', () => {
        if (this.state === 'PLAYING') this.player.deployParachute();
      });

      const btnLeft = document.getElementById('btn-shift-left');
      const btnRight = document.getElementById('btn-shift-right');
      const btnJump = document.getElementById('btn-jump');
      const btnSlide = document.getElementById('btn-slide');

      const triggerAction = (fn) => {
        if (this.state === 'PLAYING') fn();
      };

      if (btnLeft) {
        btnLeft.addEventListener('click', (e) => { e.preventDefault(); triggerAction(() => this.player.moveLeft()); });
        btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAction(() => this.player.moveLeft()); }, { passive: false });
      }
      if (btnRight) {
        btnRight.addEventListener('click', (e) => { e.preventDefault(); triggerAction(() => this.player.moveRight()); });
        btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAction(() => this.player.moveRight()); }, { passive: false });
      }
      if (btnJump) {
        btnJump.addEventListener('click', (e) => { e.preventDefault(); triggerAction(() => this.player.jump()); });
        btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAction(() => this.player.jump()); }, { passive: false });
      }
      if (btnSlide) {
        btnSlide.addEventListener('click', (e) => { e.preventDefault(); triggerAction(() => this.player.slide()); });
        btnSlide.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAction(() => this.player.slide()); }, { passive: false });
      }
    }

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateHighScoreDisplay() {
      const el = document.getElementById('start-high-score');
      if (el) el.textContent = this.highScore.toLocaleString() + ' m';
    }

    startGame() {
      this.audio.init();
      this.audio.resume();
      this.audio.startMusic();

      this.coins = 0;
      this.diamonds = 0;

      this.player.reset();
      this.dragon.reset(0);
      this.collectibleManager.reset();

      this.state = 'PLAYING';

      document.getElementById('game-container').classList.remove('shake-screen');
      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('gameover-screen').classList.add('hidden');
      document.getElementById('hud-overlay').classList.remove('hidden');

      this.clock.start();
    }

    gameOver(reason) {
      this.state = 'GAMEOVER';
      this.audio.stopMusic();
      this.audio.playCrashSound();

      const container = document.getElementById('game-container');
      if (container) {
        container.classList.add('shake-screen');
        setTimeout(() => container.classList.remove('shake-screen'), 450);
      }

      const distance = Math.floor(this.player.position.z);
      const totalScore = distance + (this.coins * 10) + (this.diamonds * 100);

      document.getElementById('hud-overlay').classList.add('hidden');
      document.getElementById('gameover-screen').classList.remove('hidden');

      document.getElementById('death-reason').textContent = reason;
      document.getElementById('final-distance').textContent = distance.toLocaleString() + ' m';
      document.getElementById('final-coins').textContent = this.coins;
      document.getElementById('final-diamonds').textContent = this.diamonds;
      document.getElementById('final-score').textContent = totalScore.toLocaleString();

      const recordTag = document.getElementById('new-high-score-tag');
      if (totalScore > this.highScore) {
        this.highScore = totalScore;
        localStorage.setItem('dragon_temple_high_score', this.highScore.toString());
        this.updateHighScoreDisplay();
        if (recordTag) recordTag.classList.remove('hidden');
      } else {
        if (recordTag) recordTag.classList.add('hidden');
      }
    }

    checkCollisions() {
      const pPos = this.player.position;

      // 1. Collectible Collisions
      for (let c of this.collectibleManager.collectibles) {
        if (c.collected) continue;

        const dist = pPos.distanceTo(c.worldPos);

        if (this.player.magnetTimer > 0 && c.type === 'coin' && dist < 14.0) {
          c.worldPos.lerp(pPos, 0.15);
          c.mesh.position.copy(c.worldPos).sub(c.group.position);
        }

        if (dist < 1.4) {
          c.collected = true;
          c.mesh.visible = false;

          if (c.type === 'coin') {
            this.coins++;
            this.audio.playCoinSound();
            this.particles.emitSparkles(c.worldPos, 0xffca28);
          } else if (c.type === 'diamond') {
            this.diamonds++;
            this.audio.playDiamondSound();
            this.particles.emitSparkles(c.worldPos, 0x00e5ff);
          } else if (c.type === 'mystery_box') {
            this.audio.playPowerupSound();
            this.particles.emitSparkles(c.worldPos, 0x22c55e);

            // Random Gift Bonus: Shield, Parachute Refill, or Magnet
            const bonusRand = Math.random();
            if (bonusRand < 0.35) {
              this.player.parachuteCharges++;
            } else if (bonusRand < 0.7) {
              this.player.magnetTimer = 8.0;
            } else {
              this.player.shieldActive = true;
              this.player.playerObj.shieldMesh.visible = true;
            }
          }
        }
      }

      // 2. Obstacle Collisions
      for (let obs of this.trackManager.obstacles) {
        if (Math.abs(pPos.z - obs.z) < 1.3) {
          if (obs.type === 'ladder') {
            if (obs.laneIndices.includes(this.player.currentLane)) {
              this.particles.emitSparkles(pPos, 0xff3d00);
              this.gameOver('CRASHED INTO TEMPLE LADDER 🪜');
              return;
            }
          } else if (obs.type === 'low_arch' && !this.player.isSliding) {
            this.player.triggerStumble();
          }
        }
      }

      // 3. Falling Underground into Chasm -> INSTANT DEATH
      if (this.player.position.y < -1.8) {
        this.particles.emitSparkles(pPos, 0x00e5ff);
        this.gameOver('FELL INTO THE UNDERGROUND CHASM 🕳️');
        return;
      }

      // 4. Caught by Dragon -> INSTANT DEATH
      if (this.dragon.distanceBehind <= 4.2) {
        this.gameOver('DEVOURED BY THE DRAGON 🐉');
        return;
      }
    }

    updateHUD() {
      const distEl = document.getElementById('hud-distance');
      const coinsEl = document.getElementById('hud-coins');
      const diamEl = document.getElementById('hud-diamonds');
      const speedEl = document.getElementById('hud-speed');

      const distVal = Math.floor(this.player.position.z);
      if (distEl) distEl.textContent = distVal.toLocaleString();
      if (coinsEl) coinsEl.textContent = this.coins;
      if (diamEl) diamEl.textContent = this.diamonds;
      if (speedEl) speedEl.textContent = Math.floor(this.player.speedMultiplier * 100) + '%';
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const dt = Math.min(this.clock.getDelta(), 0.1);

      if (this.state === 'PLAYING') {
        this.player.update(dt, this.trackManager);
        this.dragon.update(dt, this.player.position, this.player.stumbleTimer > 0);
        this.trackManager.update(this.player.position.z, this.collectibleManager);
        this.collectibleManager.update();
        this.particles.update(dt);

        this.checkCollisions();
        this.updateHUD();

        // Dynamic camera follow: adapts distance when dragon is chasing vs retreated into mist
        const pPos = this.player.position;
        const dragonVisible = this.dragon.meshGroup.visible;
        const targetCamZ = dragonVisible ? (pPos.z - 15.0) : (pPos.z - 7.5);
        const targetCamY = dragonVisible ? (pPos.y + 4.8) : (pPos.y + 3.8);

        this.camera.position.x += (pPos.x * 0.35 - this.camera.position.x) * 8.0 * dt;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 6.0 * dt;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 6.0 * dt;

        this.camera.lookAt(pPos.x * 0.4, pPos.y + 1.8, pPos.z + 12.0);

        this.sunLight.position.z = pPos.z - 10;
        this.sunLight.target.position.z = pPos.z + 10;
        this.sunLight.target.updateMatrixWorld();
      } else {
        // MENU / GAMEOVER View starting right behind the active chasing dragon!
        const time = this.clock.getElapsedTime();
        this.dragon.meshGroup.position.set(0, 3.5 + Math.sin(time * 2) * 0.3, -12.0);
        this.dragon.dragonObj.wingL.rotation.z = Math.sin(time * 6) * 0.4;
        this.dragon.dragonObj.wingR.rotation.z = -Math.sin(time * 6) * 0.4;

        // Camera stays right behind the dragon looking forward at the runner
        this.camera.position.set(Math.sin(time * 0.5) * 1.5, 5.2, -20.0);
        this.camera.lookAt(0, 2.0, 5.0);
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  // Start Engine when DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
    window.gameEngine.animate();
  });
})();
