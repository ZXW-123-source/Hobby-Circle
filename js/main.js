// 等待DOM加载完成
function ready(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

// 数字格式化函数
function formatNumber(n) {
  if(n >= 1000) return (n/1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
  return n + '';
}

// 卡片点击事件处理
function setupCardClickEvents() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    // 设置卡片光标为指针
    card.style.cursor = 'pointer';
    
    // 添加点击事件，跳转到圈子详情页
    card.addEventListener('click', function() {
      const actionsDiv = this.querySelector('.actions[data-id]');
      if (actionsDiv) {
        const circleId = actionsDiv.getAttribute('data-id');
        window.location.href = `circle-detail.html?circleId=${circleId}`;
      }
    });
    
    // 为卡片内的按钮添加事件，阻止冒泡
    const buttons = card.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    });
  });
}

// 英雄区域动画
function setupHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }
}

// 卡片滚动显示
function setupCardsIntersectionObserver() {
  const cards = document.querySelectorAll('.card');
  if('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) { 
          entry.target.classList.add('inview'); 
          obs.unobserve(entry.target); 
        }
      });
    }, {threshold: 0.12});
    
    cards.forEach(c => io.observe(c));
  } else {
    // 降级处理：不支持IntersectionObserver的浏览器直接显示所有卡片
    cards.forEach(c => c.classList.add('inview'));
  }
}

// 点赞功能
function setupLikeButtons() {
  document.querySelectorAll('.btn-like, .post-action.like').forEach(btn => {
    // 检查按钮是否已经有内联onclick事件，如果有则跳过，避免冲突
    if (!btn.hasAttribute('onclick')) {
      btn.addEventListener('click', function() {
        const countEl = btn.querySelector('.count') || btn.querySelector('.like-count');
        let likes = parseInt(btn.getAttribute('data-likes') || '0', 10);
        const pressed = btn.classList.toggle('liked');
        
        if(pressed) { 
          likes += 1; 
          btn.setAttribute('aria-pressed', 'true');
          
          // 添加收藏动画（如果需要）
          if (btn.classList.contains('favorite')) {
            btn.classList.add('favorite-animation');
            setTimeout(() => btn.classList.remove('favorite-animation'), 300);
          }
        } else { 
          likes = Math.max(0, likes - 1); 
          btn.setAttribute('aria-pressed', 'false'); 
        }
        
        btn.setAttribute('data-likes', likes);
        if (countEl) {
          countEl.textContent = formatNumber(likes);
        }
      });
    }
  });
}

// 评论功能
function setupCommentButtons() {
  document.querySelectorAll('.btn-comment, .post-action.comment').forEach(btn => {
    btn.addEventListener('click', function() {
      const countEl = btn.querySelector('.count') || btn.querySelector('.comment-count');
      let comments = parseInt(btn.getAttribute('data-comments') || '0', 10);
      
      // 这里可以根据需要显示评论输入框或其他交互
      // 简单演示：显示提示框
      const text = prompt('Add a comment (demo):');
      if(text) { 
        comments += 1; 
        btn.setAttribute('data-comments', comments); 
        if (countEl) {
          countEl.textContent = comments;
        }
      }
    });
  });
}

// 加入圈子功能
function setupJoinButtons() {
  document.querySelectorAll('.join').forEach(btn => {
    // 检查按钮是否已经有内联onclick事件，如果有则跳过，避免冲突
    if (!btn.hasAttribute('onclick')) {
      btn.addEventListener('click', function() {
        let members = parseInt(btn.getAttribute('data-members') || '0', 10);
        const joined = btn.classList.toggle('joined');
        
        if(joined) { 
          members += 1; 
          btn.textContent = 'Joined • ' + formatNumber(members); 
          btn.style.background = '#6fb0ff';
          btn.classList.add('btn-joined');
        } else { 
          members = Math.max(0, members - 1); 
          btn.textContent = 'Join • ' + formatNumber(members); 
          btn.style.background = 'var(--accent)';
          btn.classList.remove('btn-joined');
        }
        
        btn.setAttribute('data-members', members);
        
        // 更新卡片内的成员数量显示
        const card = btn.closest('.card');
        if(card) { 
          card.querySelectorAll('.members-count').forEach(el => {
            el.textContent = formatNumber(members); 
          }); 
        }
      });
    }
  });
}

// 评论区域切换
function toggleCommentsSection(button) {
  const card = button.closest('.card');
  const commentsContainer = card.querySelector('.comments-container');
  
  if (commentsContainer) {
    const isHidden = commentsContainer.style.display === 'none' || !commentsContainer.style.display;
    commentsContainer.style.display = isHidden ? 'block' : 'none';
    
    // 滚动到底部
    if (isHidden) {
      setTimeout(() => {
        const commentsList = commentsContainer.querySelector('.comments-list');
        if (commentsList) {
          commentsList.scrollTop = commentsList.scrollHeight;
        }
      }, 100);
    }
  }
}

// 评论点赞功能
function likeComment(element) {
  const likeCount = element.querySelector('.like-count');
  let likes = parseInt(element.getAttribute('data-likes') || '0', 10);
  
  const isLiked = element.classList.toggle('liked');
  if (isLiked) {
    likes += 1;
  } else {
    likes = Math.max(0, likes - 1);
  }
  
  element.setAttribute('data-likes', likes);
  if (likeCount) {
    likeCount.textContent = likes;
  }
}

// 添加新评论
function addNewComment(button) {
  const commentsContainer = button.closest('.comments-container');
  const commentInput = commentsContainer.querySelector('input[type="text"]');
  const commentsList = commentsContainer.querySelector('.comments-list');
  
  const commentText = commentInput.value.trim();
  if (commentText) {
    // 创建新评论元素
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
      <img src="images/user${Math.floor(Math.random() * 10) + 1}.jpg" alt="User" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-user">You</span>
          <span class="comment-time">Just now</span>
        </div>
        <div class="comment-text">${commentText}</div>
        <div class="comment-actions">
          <span class="comment-action like-action" onclick="likeComment(this)" data-likes="0">❤ <span class="like-count">0</span></span>
        </div>
      </div>
    `;
    
    // 添加到评论列表开头
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // 清空输入框
    commentInput.value = '';
    
    // 更新评论计数
    const commentButton = commentsContainer.closest('.card').querySelector('.btn-comment');
    if (commentButton) {
      const countEl = commentButton.querySelector('.count');
      let comments = parseInt(commentButton.getAttribute('data-comments') || '0', 10);
      comments += 1;
      commentButton.setAttribute('data-comments', comments);
      if (countEl) {
        countEl.textContent = comments;
      }
    }
  }
}

// 滚动到底部按钮
function scrollToBottom(button) {
  const commentsList = button.closest('.comments-list');
  if (commentsList) {
    commentsList.scrollTop = commentsList.scrollHeight;
    
    // 添加按钮动画反馈
    button.style.transform = 'translateY(2px)';
    setTimeout(() => {
      button.style.transform = 'translateY(0)';
    }, 200);
  }
}

// 创建圈子表单处理
function createCircle(event) {
  if (event) event.preventDefault();
  
  const form = document.getElementById('createCircleForm');
  if (!form) return;
  
  const circleName = document.getElementById('circleName').value;
  const circleDescription = document.getElementById('circleDescription').value;
  const circleTags = document.getElementById('circleTags').value;
  
  // 简单验证
  if (!circleName || !circleDescription || !circleTags) {
    showNotification('Please fill all required fields');
    return false;
  }
  
  // 这里应该是AJAX提交逻辑
  // 简单演示：显示成功消息
  showNotification('Circle created successfully!', 'success');
  
  // 重置表单
  form.reset();
  document.getElementById('previewImage').style.display = 'none';
  document.getElementById('placeholderText').style.display = 'block';
  
  return false;
}

// 图片预览功能
function setupImagePreview() {
  const imageInput = document.getElementById('circleImage');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const preview = document.getElementById('previewImage');
      const placeholder = document.getElementById('placeholderText');
      
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          preview.src = event.target.result;
          preview.style.display = 'block';
          placeholder.style.display = 'none';
        }
        
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }
  
  // 预设图片选择
  document.querySelectorAll('.image-option').forEach(option => {
    option.addEventListener('click', function() {
      const imageUrl = this.getAttribute('data-image');
      const preview = document.getElementById('previewImage');
      const placeholder = document.getElementById('placeholderText');
      
      preview.src = imageUrl;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      
      // 移除其他选中状态
      document.querySelectorAll('.image-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // 添加选中状态
      this.classList.add('selected');
      
      // 阻止冒泡
      event.stopPropagation();
    });
  });
}

// 显示通知
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // 根据类型设置样式
  if (type === 'success') {
    notification.style.background = '#4caf50';
  }
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 自动移除
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// 编辑模态框功能
function openEditModal(circleId) {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.style.display = 'flex';
    
    // 这里应该填充表单数据
    document.getElementById('editCircleId').value = circleId;
    
    // 模拟填充数据（实际应该从服务器获取）
    if (circleId === 'circle_photography') {
      document.getElementById('editCircleName').value = 'Photography';
      document.getElementById('editCircleDescription').value = 'Share techniques, gear tips, your latest shots...';
      document.getElementById('editCircleTags').value = 'photography,camera,techniques';
      document.getElementById('editPreviewImage').src = 'images/cityphotography.jpg';
    }
    // 可以添加更多圈子的编辑数据
  }
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function updateCircle(event) {
  if (event) event.preventDefault();
  
  // 这里应该是更新逻辑
  showNotification('Circle updated successfully!', 'success');
  closeEditModal();
  return false;
}

function selectEditImage(imageUrl) {
  const preview = document.getElementById('editPreviewImage');
  preview.src = imageUrl;
  
  // 移除其他选中状态
  document.querySelectorAll('#editCircleForm .image-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // 添加选中状态到当前点击的按钮
  const button = event.currentTarget;
  button.classList.add('selected');
}

// 消息栏功能
function initMessageBar() {
  const messageBar = document.querySelector('.message-bar');
  if (!messageBar) return;
  
  // 设置消息栏固定定位
  messageBar.style.position = 'fixed';
  messageBar.style.bottom = '0';
  messageBar.style.left = '0';
  messageBar.style.right = '0';
  
  // 消息项点击事件
  const messageItems = messageBar.querySelectorAll('.message-item');
  messageItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除其他项的活跃状态
      messageItems.forEach(i => i.classList.remove('active'));
      // 添加当前项的活跃状态
      this.classList.add('active');
      
      // 显示消息面板
      showMessagePanel();
    });
  });
}

// 显示消息面板
function showMessagePanel() {
  let messagePanel = document.querySelector('.message-panel');
  
  if (!messagePanel) {
    // 创建消息面板
    messagePanel = createMessagePanel();
    document.body.appendChild(messagePanel);
  }
  
  // 显示面板
  messagePanel.classList.add('open');
}

// 创建消息面板
function createMessagePanel() {
  const panel = document.createElement('div');
  panel.className = 'message-panel';
  
  panel.innerHTML = `
    <div class="message-panel-header">
      <h3>Messages</h3>
      <button class="message-panel-close" onclick="closeMessagePanel()">&times;</button>
    </div>
    <div class="message-panel-content">
      <div class="message-item" style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #f0f0f0;">
        <img src="images/user2.jpg" alt="Alice" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-weight:600;">Alice</span>
            <span class="status-online"></span>
          </div>
          <div style="color:var(--muted); font-size:12px;">5 minutes ago</div>
          <div style="margin-top:4px; font-size:14px;">Hey! How's your photography project going?</div>
        </div>
      </div>
      <div class="message-item" style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #f0f0f0;">
        <img src="images/user3.jpg" alt="Charlie" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-weight:600;">Charlie</span>
          </div>
          <div style="color:var(--muted); font-size:12px;">1 hour ago</div>
          <div style="margin-top:4px; font-size:14px;">Are you joining the reading club meeting tomorrow?</div>
        </div>
      </div>
      <div class="message-item" style="display:flex; gap:12px; padding:12px;">
        <img src="images/user4.jpg" alt="Diana" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-weight:600;">Diana</span>
            <span class="status-online"></span>
          </div>
          <div style="color:var(--muted); font-size:12px;">Yesterday</div>
          <div style="margin-top:4px; font-size:14px;">Thanks for sharing that recipe! It turned out amazing.</div>
        </div>
      </div>
    </div>
  `;
  
  return panel;
}

// 关闭消息面板
function closeMessagePanel() {
  const messagePanel = document.querySelector('.message-panel');
  if (messagePanel) {
    messagePanel.classList.remove('open');
    // 可以选择在关闭后移除面板
    // setTimeout(() => messagePanel.remove(), 300);
  }
}

// 评论计数点击功能
function setupCommentCountClick() {
  document.querySelectorAll('.comment-count').forEach(count => {
    count.addEventListener('click', function() {
      const postCard = this.closest('.post-card');
      if (postCard) {
        // 滚动到评论区域
        const commentsSection = postCard.querySelector('.comments-section');
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth' });
          commentsSection.style.display = 'block';
        }
      }
    });
  });
}

// 评论切换功能
function setupCommentsToggle() {
  document.querySelectorAll('.comments-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const commentsSection = this.nextElementSibling;
      if (commentsSection && commentsSection.classList.contains('comments-section')) {
        const isHidden = commentsSection.style.display === 'none' || !commentsSection.style.display;
        commentsSection.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? 'Hide comments' : 'Show comments';
      }
    });
  });
}

// 更新评论功能（用于新添加的帖子）
function updateCommentFeatures() {
  // 为新添加的帖子初始化评论功能
  setupCommentsToggle();
  setupCommentCountClick();
  
  // 为新添加的评论添加点赞功能
  document.querySelectorAll('.like-action:not([data-initialized])').forEach(action => {
    action.setAttribute('data-initialized', 'true');
    action.addEventListener('click', function() {
      likeComment(this);
    });
  });
}

// 收藏功能
function setupFavoriteButtons() {
  // 为所有收藏按钮设置点击事件
  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', function() {
      const postId = this.getAttribute('data-post-id');
      
      // 切换收藏状态（通过类名和图标）
      if (this.classList.contains('favorited')) {
        // 取消收藏
        this.classList.remove('favorited');
        this.textContent = '☆';
        showNotification('已取消收藏', 'info');
      } else {
        // 添加收藏
        this.classList.add('favorited');
        this.textContent = '★';
        showNotification('收藏成功', 'success');
      }
    });
  });
}

function setupTabEvents() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Show corresponding content
      const targetId = tab.id.replace('-tab', '');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // 动态调整搜索栏位置
      const searchBar = document.getElementById('search-bar');
      if (searchBar) {
        if (targetId === 'discover') {
          searchBar.style.display = 'block';
        } else {
          searchBar.style.display = 'none';
        }
      }
      
      // 每次切换标签后重新初始化当前标签页的功能
      setTimeout(() => {
        // 初始化点赞和收藏按钮
        setupLikeButtons();
        setupFavoriteButtons();
        
        // 初始化评论功能
        setupCommentButtons();
        
        // 更新评论相关功能
        updateCommentFeatures();
      }, 100);
    });
  });
}

// 通知功能
function showNotification(message, type = 'info') {
  // 检查是否已存在通知元素
  let notification = document.getElementById('notification');
  
  if (!notification) {
    // 创建通知元素
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // 设置消息和类型
  notification.textContent = message;
  notification.className = 'notification';
  notification.classList.add(type);
  
  // 显示通知
  notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)';
  
  // 3秒后自动隐藏
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    // 动画结束后隐藏
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);
}

// 创建帖子功能
function setupCreatePostFeature() {
  const createPostBtn = document.getElementById('create-post-btn');
  const modal = document.getElementById('create-post-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelPostBtn = document.getElementById('cancel-post');
  const submitPostBtn = document.getElementById('submit-post');
  const tagButtons = document.querySelectorAll('.tag-btn');
  const selectedTagInput = document.getElementById('selected-tag');
  
  if (!createPostBtn || !modal) return;
  
  // 打开模态框
  function openModal() {
    modal.style.display = 'flex';
    // 重置表单
    document.getElementById('post-content').value = '';
    selectedTagInput.value = '';
    // 重置标签按钮状态
    tagButtons.forEach(btn => btn.classList.remove('selected'));
    
    // 添加动画效果
    setTimeout(() => {
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
      }
    }, 10);
  }
  
  // 关闭模态框
  function closeModal() {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.transform = 'scale(0.9)';
      modalContent.style.opacity = '0';
    }
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 200);
  }
  
  // 标签选择处理
  tagButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除其他标签的选中状态
      tagButtons.forEach(b => b.classList.remove('selected'));
      // 添加当前标签的选中状态
      this.classList.add('selected');
      // 保存选中的标签
      selectedTagInput.value = this.getAttribute('data-tag');
    });
  });
  
  // 创建新帖子
  function createNewPost() {
    const postContent = document.getElementById('post-content').value.trim();
    const selectedTag = selectedTagInput.value;
    
    // 验证输入
    if (!postContent) {
      showNotification('Please enter post content', 'error');
      return;
    }
    
    if (!selectedTag) {
      showNotification('Please select a tag', 'error');
      return;
    }
    
    // 生成唯一ID
    const postId = 'new-post-' + Date.now();
    
    // 创建新帖子HTML
    const newPostHTML = `
      <section class="post" style="animation: fadeInUp 0.5s ease; position: relative;">
        <button class="favorite-btn" data-post-id="${postId}">☆</button>
        <button class="delete-btn" data-post-id="${postId}">🗑️</button>
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="images/user1.jpg" alt="You" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          <strong>You</strong> <small style="color:var(--muted)">in ${selectedTag} · Just now</small>
        </div>
        <p>${escapeHTML(postContent)}</p>
        <div class="post-actions">
          <button class="like-btn" data-post-id="${postId}">
            <span class="heart-icon">❤</span>
            <span class="like-count">0</span>
          </button>
          <div class="comment-count" data-post-id="${postId}">
            <span class="comment-icon">💬</span>
            <span class="count">0</span>
          </div>
        </div>
        <div class="comment-section">
          <input type="text" class="comment-input" placeholder="Add a comment..." data-post-id="${postId}">
          <button class="comment-submit" data-post-id="${postId}">Post Comment</button>
          <div class="comments-toggle" data-post-id="${postId}">Show Comments (0)</div>
          <div class="comments-list" data-post-id="${postId}" style="display: none;">
            <button class="scroll-to-bottom" data-post-id="${postId}">▼</button>
          </div>
        </div>
      </section>
    `;
    
    // 添加到当前活跃的标签页
    const activeTab = document.querySelector('.feed-tab.active');
    if (activeTab) {
      // 找到h3元素，在其后插入新帖子
      const h3 = activeTab.querySelector('h3');
      if (h3) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newPostHTML;
        const newPost = tempDiv.firstElementChild;
        h3.parentNode.insertBefore(newPost, h3.nextSibling);
      }
    }
    
    // 重新设置收藏按钮事件
    setupFavoriteButtons();
    
    // 关闭模态框
    closeModal();
    
    // 显示成功通知
    showNotification('Post created successfully!', 'success');
  }
  
  // HTML转义函数
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // 绑定事件
  createPostBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelPostBtn.addEventListener('click', closeModal);
  submitPostBtn.addEventListener('click', createNewPost);
  
  // 点击模态框外部关闭
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // 按ESC键关闭模态框
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

// 初始化所有事件
function initAllEvents() {
  // 基础功能
  setupCardClickEvents();
  setupHeroAnimation();
  setupCardsIntersectionObserver();
  setupLikeButtons();
  setupCommentButtons();
  setupJoinButtons();
  setupFavoriteButtons();
  setupCreatePostFeature();
  
  // 表单相关功能
  if (document.getElementById('createCircleForm')) {
    setupImagePreview();
  }
  
  // 消息栏功能
  if (document.querySelector('.message-bar')) {
    initMessageBar();
  }
  
  // 评论相关功能
  setupCommentsToggle();
  setupCommentCountClick();
  
  // 为所有新功能初始化
  updateCommentFeatures();
  
  // 调用标签切换事件设置
  setupTabEvents();
  
  // 同时保留现有的nav-btn事件监听逻辑
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // 获取当前激活的标签内容ID
      const activeContentId = this.getAttribute('data-target') || 'discover';
      
      // 动态调整搜索栏位置
      const searchBar = document.getElementById('search-bar');
      if (searchBar) {
        if (activeContentId === 'discover') {
          searchBar.style.display = 'block';
        } else {
          searchBar.style.display = 'none';
        }
      }
      
      // 等待内容加载完成后重新初始化功能
      setTimeout(() => {
        // 初始化点赞和收藏按钮
        setupLikeButtons();
        setupFavoriteButtons();
        
        // 初始化评论功能
        setupCommentButtons();
        
        // 更新评论相关功能
        updateCommentFeatures();
      }, 100);
    });
  });
}

// 页面加载完成后初始化
ready(initAllEvents);

// 全局函数（用于内联事件处理）
window.likePost = function(element) {
  // 直接在这个函数中实现点赞逻辑，而不是分发事件
  // 防止事件冒泡
  if (window.event) {
    window.event.stopPropagation();
  }
  
  const countEl = element.querySelector('.count');
  let likes = parseInt(element.getAttribute('data-likes') || '0', 10);
  const pressed = element.classList.toggle('liked');
  
  if(pressed) { 
    likes += 1; 
    element.setAttribute('aria-pressed', 'true');
  } else { 
    likes = Math.max(0, likes - 1); 
    element.setAttribute('aria-pressed', 'false'); 
  }
  
  element.setAttribute('data-likes', likes);
  if (countEl) {
    countEl.textContent = formatNumber(likes);
  }
};

window.toggleCommentsSection = function(element) {
  toggleCommentsSection(element);
};

window.joinCircle = function(element) {
  // 防止事件冒泡
  if (window.event) {
    window.event.stopPropagation();
  }
  
  const btn = element.closest('.join') || element;
  let members = parseInt(btn.getAttribute('data-members') || '0', 10);
  const joined = btn.classList.toggle('joined');
  
  if(joined) { 
    members += 1; 
    btn.textContent = 'Joined • ' + formatNumber(members); 
    btn.style.background = '#6fb0ff';
    btn.classList.add('btn-joined');
  } else { 
    members = Math.max(0, members - 1); 
    btn.textContent = 'Join • ' + formatNumber(members); 
    btn.style.background = 'var(--accent)';
    btn.classList.remove('btn-joined');
  }
  
  btn.setAttribute('data-members', members);
  
  // 更新卡片内的成员数量显示
  const card = btn.closest('.card');
  if(card) { 
    card.querySelectorAll('.members-count').forEach(el => {
      el.textContent = formatNumber(members); 
    }); 
  }
};

window.likeComment = function(element) {
  likeComment(element);
};

window.addNewComment = function(element) {
  addNewComment(element);
};

window.scrollToBottom = function(element) {
  scrollToBottom(element);
};

window.createCircle = function(event) {
  return createCircle(event);
};

window.updateCircle = function(event) {
  return updateCircle(event);
};

window.selectEditImage = function(imageUrl) {
  selectEditImage(imageUrl);
};

window.openEditModal = function(circleId) {
  openEditModal(circleId);
};

window.closeEditModal = function() {
  closeEditModal();
};

window.closeMessagePanel = function() {
  closeMessagePanel();
};

window.toggleComments = function(element) {
  const commentsSection = element.nextElementSibling;
  if (commentsSection && commentsSection.classList.contains('comments-section')) {
    const isHidden = commentsSection.style.display === 'none' || !commentsSection.style.display;
    commentsSection.style.display = isHidden ? 'block' : 'none';
    element.textContent = isHidden ? 'Hide comments' : 'Show comments';
  }
};