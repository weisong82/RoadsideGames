const GameEngine = {
  currentGame: null,
  currentStepIndex: 0,
  onComplete: null,
  timerInterval: null,
  currentPhoto: null,

  // 显示 Toast 提示
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    // Trigger transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('toast-show'));
    });
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  },

  // 开始游戏
  start(gameId, callbacks = {}) {
    const game = Games.get(gameId);
    if (!game) {
      console.error('Game not found:', gameId);
      this.showToast('找不到该游戏，请返回首页重试 🙁', 'error');
      return;
    }

    this.currentGame = game;
    this.currentStepIndex = 0;
    this.onComplete = callbacks.onComplete || (() => {});

    // 如果游戏包含照片库，随机选一张
    if (game.photos && game.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * game.photos.length);
      this.currentPhoto = game.photos[randomIndex];
    } else {
      this.currentPhoto = null;
    }

    // 记录游戏开始并更新连续打卡
    Store.incrementGame(gameId);
    Store.updateStreak();

    // 渲染游戏界面
    this.renderStep();
  },

  // 渲染当前步骤
  renderStep() {
    const game = this.currentGame;
    const stepIndex = this.currentStepIndex;
    const steps = game.steps || [];

    if (stepIndex >= steps.length) {
      // 游戏完成
      this.complete();
      return;
    }

    const step = steps[stepIndex];
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <button class="back-btn" onclick="window.history.back()">←</button>
          <h2>${game.icon} ${game.title}</h2>
          <div class="step-progress">${stepIndex + 1}/${steps.length}</div>
        </div>

        <div class="step-content">
          ${this.renderStepContent(step)}
        </div>

        <div class="step-actions">
          ${this.renderStepActions(step)}
        </div>
      </div>
    `;

    // 如果是 timer 步骤，启动倒计时
    if (step.type === 'observation' && step.timer) {
      this.startTimer(step.timer);
    }
  },

  // 启动定时器
  startTimer(seconds) {
    let remaining = seconds;
    const timerEl = document.querySelector('.timer');

    this.timerInterval = setInterval(() => {
      remaining--;
      if (timerEl) {
        timerEl.textContent = `${remaining}秒`;
      }

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        // 时间到提示
        if (Store.state.settings.soundEnabled) {
          this.playSound('timer-complete');
        }
      }
    }, 1000);
  },

  // 音效播放（Web Audio API）
  playSound(type) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === 'timer-complete') {
        // 两音节上升短促音
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, ctx.currentTime);
        oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Web Audio API 不可用时静默失败
    }
  },

  // 渲染步骤内容
  renderStepContent(step) {
    switch (step.type) {
      case 'intro':
        return `
          <div class="step-intro">
            <div class="step-icon">${this.currentGame.icon}</div>
            <p class="step-text">${step.text}</p>
          </div>
        `;

      case 'observation':
        return `
          <div class="step-observation">
            <div class="step-icon">👀</div>
            <p class="step-text">${step.text}</p>
            ${step.timer ? `<div class="timer" data-seconds="${step.timer}">${step.timer}秒</div>` : ''}
          </div>
        `;

      case 'input':
        return `
          <div class="step-input">
            ${step.showPhoto && this.currentPhoto ? `
              <div class="plant-photo-container">
                <img
                  src="${this.currentPhoto.imageUrl}"
                  alt="${this.currentPhoto.name}"
                  class="plant-photo"
                  onerror="this.parentElement.querySelector('.plant-photo-fallback').style.display='flex';this.style.display='none'"
                >
                <div class="plant-photo-fallback">${this.currentPhoto.fallbackIcon || '🌿'}</div>
                <p class="plant-photo-hint">${this.currentPhoto.hint}</p>
              </div>
            ` : ''}
            <p class="step-text">${step.text}</p>
            ${step.inputType === 'number'
              ? `<input type="number" class="input-field" placeholder="输入你的答案">`
              : `<input type="text" class="input-field" placeholder="输入你的答案">`
            }
            ${step.showPhoto && this.currentPhoto ? `
              <button class="btn btn-outline plant-reveal-btn" onclick="this.parentElement.querySelector('.plant-photo-answer').style.display='block';this.style.display='none'">查看答案</button>
              <p class="plant-photo-answer">参考答案：<strong>${this.currentPhoto.name}</strong></p>
            ` : ''}
          </div>
        `;

      case 'challenge':
        return `
          <div class="step-challenge">
            <div class="step-icon">🎯</div>
            <p class="step-text">${step.text}</p>
            <p class="step-hint">完成后点击"我做到了"</p>
          </div>
        `;

      case 'complete':
        return `
          <div class="step-complete">
            <div class="step-icon">🎉</div>
            <p class="step-text">${step.text}</p>
          </div>
        `;

      default:
        return `
          <div class="step-default">
            <p class="step-text">${step.text}</p>
          </div>
        `;
    }
  },

  // 渲染步骤操作按钮
  renderStepActions(step) {
    const isLastStep = this.currentStepIndex >= (this.currentGame.steps?.length - 1);

    if (isLastStep) {
      return `
        <button class="btn btn-primary complete-btn" onclick="GameEngine.next()">
          完成！
        </button>
      `;
    }

    return `
      <button class="btn btn-outline" onclick="GameEngine.skip()">跳过</button>
      <button class="btn btn-primary" onclick="GameEngine.next()">下一步</button>
    `;
  },

  // 下一步
  next() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.currentStepIndex++;
    this.renderStep();
  },

  // 跳过
  skip() {
    if (confirm('确定要跳过这步吗？')) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.currentStepIndex++;
      this.renderStep();
    }
  },

  // 游戏完成
  complete() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const gameId = this.currentGame.id;
    const unlockedBadge = Games.checkBadgeUnlock(gameId);

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="game-complete">
        <div class="complete-icon">🏆</div>
        <h2>太棒了！</h2>
        <p>你又完成了一次探索！</p>
        ${unlockedBadge ? `
          <div class="badge-unlocked">
            <div class="new-badge">🎖️</div>
            <p>解锁新徽章：${this.getBadgeName(unlockedBadge)}</p>
          </div>
        ` : ''}
        <button class="btn btn-primary" onclick="window.location.hash='#/'">返回首页</button>
      </div>
    `;

    // 回调
    if (this.onComplete) {
      this.onComplete({ gameId, unlockedBadge });
    }

    this.currentGame = null;
    this.currentPhoto = null;
  },

  // 获取徽章名称
  getBadgeName(badgeId) {
    const metadata = GAME_METADATA.find(g => g.badge === badgeId);
    return metadata ? metadata.badgeName : badgeId;
  }
};

// 导出
window.GameEngine = GameEngine;
