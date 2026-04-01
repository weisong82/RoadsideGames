// 徽章卡片组件
function BadgeCard({ badgeId, unlocked, badgeName, icon }) {
  return `
    <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="badge-icon">${unlocked ? icon : '🔒'}</div>
      <div class="badge-name">${badgeName}</div>
      ${unlocked ? '<div class="badge-date">已收集</div>' : ''}
    </div>
  `;
}

window.BadgeCard = BadgeCard;
