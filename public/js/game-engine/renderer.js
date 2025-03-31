export class GameRenderer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    document.getElementById('game-container').appendChild(this.canvas);
    this.players = {};
  }

  addPlayer(playerId, playerData) {
    this.players[playerId] = playerData;
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  clear() {
    this.players = {};
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    Object.values(this.players).forEach(player => {
      this.ctx.fillStyle = player.isCurrentPlayer ? '#ff0000' : '#00ff00';
      this.ctx.fillRect(player.position.x, player.position.y, 32, 32);
    });
  }
}