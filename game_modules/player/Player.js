import { GameDatabase } from '../../firebase/database.js';

export class Player {
  constructor(userId) {
    this.userId = userId;
    this.stats = { level: 1, health: 100, mana: 50, experience: 0 };
    this.position = { x: 0, y: 0 };
    this.inventory = [];
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
      speed: 5
    };
  }

  updatePosition() {
    if (this.movement.up) this.position.y -= this.movement.speed;
    if (this.movement.down) this.position.y += this.movement.speed;
    if (this.movement.left) this.position.x -= this.movement.speed;
    if (this.movement.right) this.position.x += this.movement.speed;
  }

  startMovementListener() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    switch(e.key.toLowerCase()) {
      case 'w': this.movement.up = true; break;
      case 's': this.movement.down = true; break;
      case 'a': this.movement.left = true; break;
      case 'd': this.movement.right = true; break;
    }
  }

  handleKeyUp(e) {
    switch(e.key.toLowerCase()) {
      case 'w': this.movement.up = false; break;
      case 's': this.movement.down = false; break;
      case 'a': this.movement.left = false; break;
      case 'd': this.movement.right = false; break;
    }
  }

  async saveToDatabase() {
    try {
      await GameDatabase.savePlayerData(this.userId, {
        stats: this.stats,
        position: this.position,
        inventory: this.inventory
      });
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
    }
  }

  async loadFromDatabase() {
    return new Promise((resolve) => {
      GameDatabase.getPlayerData(this.userId, (data) => {
        if (data) {
          this.stats = data.stats || this.stats;
          this.position = data.position || this.position;
          this.inventory = data.inventory || this.inventory;
        }
        resolve();
      });
    });
  }

  // Novo método para sincronização contínua
  startPositionSync(userId) {
    setInterval(() => {
      this.updatePosition();
      GameDatabase.updatePlayerPosition(userId, this.position);
    }, 100);
  }
}
