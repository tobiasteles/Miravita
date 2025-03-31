import { database, ref, set, onValue } from './firebase-config.js';

export class GameDatabase {
  static savePlayerData(userId, playerData) {
    set(ref(database, 'players/' + userId), playerData);
  }

  static getPlayerData(userId, callback) {
    const playerRef = ref(database, 'players/' + userId);
    onValue(playerRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  static updateWorldState(worldData) {
    set(ref(database, 'world'), worldData);
  }

  static listenToWorldChanges(callback) {
    const worldRef = ref(database, 'world/players');
    onValue(worldRef, (snapshot) => {
      callback(snapshot.val() || {});
    });
  }

  static updatePlayerPosition(userId, position) {
    set(ref(database, `world/players/${userId}/position`), position);
  }
}