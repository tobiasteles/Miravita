import { AuthManager } from '/firebase/auth.js';
import { GameDatabase } from '/firebase/database.js';
import { Player } from '/game_modules/player/Player.js';
import { GameRenderer } from '/public/js/game-engine/renderer.js';


class Game {
  constructor() {
    this.renderer = new GameRenderer();
    this.player = null;
    this.gameActive = false;
    this.initAuth();
    this.initGameLoop();
  }

  async initAuth() {
    AuthManager.onAuthStateChanged(async (user) => {
      if (user) {
        await this.handleUserLogin(user.uid);
      } else {
        this.handleUserLogout();
      }
    });
  }

  async handleUserLogin(userId) {
    try {
      this.player = new Player(userId);
      await this.player.loadFromDatabase();
      
      this.setupMovement();
      this.player.startPositionSync(userId); // Adicionada a chamada para sincronização contínua
      
      this.setupWorldListeners(userId);
      
      this.gameActive = true;
      console.log('Jogador autenticado:', this.player);
    } catch (error) {
      console.error('Erro no login:', error);
      this.showLoginScreen();
    }
  }

  setupMovement() {
    window.addEventListener('keydown', (e) => this.player.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.player.handleKeyUp(e));
  }

  setupWorldListeners(userId) {
    this.worldListener = GameDatabase.listenToWorldChanges((players) => {
      Object.entries(players).forEach(([uid, data]) => {
        if (uid === userId) return;
        this.renderer.addPlayer(uid, data);
      });
      this.renderer.update();
    });
  }

  initGameLoop() {
    const loop = () => {
      if (this.gameActive) {
        this.renderer.update();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  handleUserLogout() {
    this.gameActive = false;
    // Aqui, você pode adicionar a remoção dos listeners se necessário
    if (this.worldListener) this.worldListener.off();
    this.renderer.clear();
    this.showLoginScreen();
  }

  showLoginScreen() {
    const loginHTML = `
      <div class="login-panel">
        <h2>Miravita MMORPG</h2>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Senha" required>
        <div class="button-group">
          <button id="login-btn">Entrar</button>
          <button id="register-btn">Registrar</button>
        </div>
      </div>
    `;
    
    document.body.innerHTML = loginHTML;
    
    document.getElementById('login-btn').addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await AuthManager.login(email, password);
    });

    document.getElementById('register-btn').addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await AuthManager.register(email, password);
    });
  }
}

// Inicialização do jogo
new Game();
