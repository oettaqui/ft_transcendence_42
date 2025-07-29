const { db } = require('../config/database');

class UserStats {
  constructor(data = {}) {
    this.userId = data.user_id || data.userId;
    this.gamesPlayed = data.games_played || data.gamesPlayed || 0;
    this.gamesWon = data.games_won || data.gamesWon || 0;
    this.gamesLost = data.games_lost || data.gamesLost || 0;
    this.rankingPoints = data.ranking_points || data.rankingPoints || 1000;
    this.bestScore = data.best_score || data.bestScore || 0;
  }

  // Get user stats by user ID
  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM user_stats WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? new UserStats(row) : new UserStats({ userId }));
        }
      );
    });
  }

  // Update user stats
  async update(stats) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const params = [];
      
      if (stats.gamesPlayed !== undefined) {
        updates.push('games_played = ?');
        params.push(stats.gamesPlayed);
        this.gamesPlayed = stats.gamesPlayed;
      }
      if (stats.gamesWon !== undefined) {
        updates.push('games_won = ?');
        params.push(stats.gamesWon);
        this.gamesWon = stats.gamesWon;
      }
      if (stats.gamesLost !== undefined) {
        updates.push('games_lost = ?');
        params.push(stats.gamesLost);
        this.gamesLost = stats.gamesLost;
      }
      if (stats.rankingPoints !== undefined) {
        updates.push('ranking_points = ?');
        params.push(stats.rankingPoints);
        this.rankingPoints = stats.rankingPoints;
      }
      if (stats.bestScore !== undefined) {
        updates.push('best_score = ?');
        params.push(stats.bestScore);
        this.bestScore = stats.bestScore;
      }
      
      if (updates.length === 0) {
        return resolve(0);
      }
      
      params.push(this.userId);
      
      db.run(
        `UPDATE user_stats SET ${updates.join(', ')} WHERE user_id = ?`,
        params,
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  // Get win rate
  getWinRate() {
    if (this.gamesPlayed === 0) return 0;
    return ((this.gamesWon / this.gamesPlayed) * 100).toFixed(1);
  }

  // Convert to JSON
  toJSON() {
    return {
      userId: this.userId,
      gamesPlayed: this.gamesPlayed,
      gamesWon: this.gamesWon,
      gamesLost: this.gamesLost,
      rankingPoints: this.rankingPoints,
      bestScore: this.bestScore,
      winRate: this.getWinRate()
    };
  }
}

module.exports = UserStats;