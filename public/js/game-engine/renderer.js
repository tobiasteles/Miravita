import { GameRenderer } from '../game-engine/renderer.js';
import { AuthManager } from '../firebase/auth.js';
import { Player } from '../game_modules/player/Player.js';
import { GameDatabase } from '../firebase/database.js';
import { GameRenderer } from './game-engine/renderer.js';

class Game {
  constructor() {
    // Inicializa o renderizador
    this.renderer = new GameRenderer();
    
    // Variáveis de estado do jogo
    this.player = null;
    this.gameActive = false;
    
    // Inicia os sistemas principais
    this.initAuth();
    this.initGameLoop();
  }

  initAuth() {
    AuthManager.onAuthStateChanged((user) => {
      if (user) {
        // Player autenticado
        this.handleUserAuthenticated(user);
      } else {
        // Usuário não logado
        this.handleUserLoggedOut();
      }
    });
  }

  handleUserAuthenticated(user) {
    // Cria instância do jogador local
    this.player = new Player(user.uid);
    
    // Configura controles
    this.player.startMovementListener();
    
    // Inicia sincronização de posição
    this.startPositionSync(user.uid);
    
    // Configura listeners do mundo
    this.setupWorldListeners(user.uid);
    
    // Carrega dados do jogador
    this.loadPlayerData(() => {
      this.gameActive = true;
      console.log('Jogo iniciado!');
    });
  }

  startPositionSync(userId) {
    // Atualiza posição no Firebase a cada 100ms
    this.positionInterval = setInterval(() => {
      this.player.updatePosition();
      GameDatabase.updatePlayerPosition(userId, this.player.position);
    }, 100);
  }

  setupWorldListeners(currentUserId) {
    // Listener para mudanças nos outros jogadores
    this.worldListener = GameDatabase.listenToWorldChanges((players) => {
      Object.entries(players).forEach(([uid, playerData]) => {
        if (uid === currentUserId) {
          // Atualiza jogador local no renderizador
          this.renderer.addPlayer(uid, {
            ...playerData,
            isCurrentPlayer: true
          });
        } else {
          // Atualiza outros jogadores
          this.renderer.addPlayer(uid, playerData);
        }
      });
      
      // Remove jogadores desconectados
      const activeIds = Object.keys(players);
      Object.keys(this.renderer.players).forEach(uid => {
        if (!activeIds.includes(uid)) {
          this.renderer.removePlayer(uid);
        }
      });
    });
  }

  loadPlayerData(callback) {
    this.player.loadFromDatabase(() => {
      // Posição inicial do jogador
      this.renderer.addPlayer(this.player.userId, {
        position: this.player.position,
        stats: this.player.stats,
        isCurrentPlayer: true
      });
      callback();
    });
  }

  initGameLoop() {
    const update = (timestamp) => {
      if (this.gameActive) {
        // Atualiza lógica do jogo
        this.update(timestamp);
        
        // Renderiza o frame
        this.renderer.update();
      }
      
      // Próximo frame
      requestAnimationFrame(update);
    };
    
    // Inicia o loop
    requestAnimationFrame(update);
  }

  update(timestamp) {
    // Atualizações de estado do jogo
    // (futuras implementações de física, animações, etc.)
  }

  handleUserLoggedOut() {
    // Cleanup do estado do jogo
    this.gameActive = false;
    
    if (this.positionInterval) {
      clearInterval(this.positionInterval);
    }
    
    if (this.worldListener) {
      this.worldListener.off(); // Remove Firebase listener
    }
    
    this.renderer.clear();
    this.showLoginScreen();
  }

  showLoginScreen() {
    // Sua implementação de UI de login anterior
  }
}

// Inicializa o jogo
new Game();