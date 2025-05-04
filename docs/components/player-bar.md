# 雅韵(YaYun) - 迷你播放条组件说明文档

## 组件概述

迷你播放条是一个轻量级音乐播放控制组件，位于导航栏上方，在有音乐播放时显示，提供当前播放内容快速预览和基本控制功能。设计遵循iOS Human Interface Guidelines，采用玻璃拟态效果，支持左右滑动切换曲目，点击进入完整播放页面。

## 组件结构

```html
<div class="player-bar light hidden" id="player-bar">
  <div class="swipe-container" id="swipe-container">
    <div class="flex items-center justify-between h-full px-4">
      <!-- 专辑封面 -->
      <div class="album-cover">
        <img src="..." alt="专辑封面" class="w-full h-full object-cover">
      </div>
      
      <!-- 歌曲信息 -->
      <div class="flex-1 ml-3 overflow-hidden">
        <div class="song-title" id="song-title">歌曲标题</div>
        <div class="artist-name" id="artist-name">艺术家名称</div>
      </div>
      
      <!-- 控制按钮 -->
      <div class="flex items-center space-x-2">
        <div class="control-button" onclick="togglePlay()">
          <i class="fas fa-play" id="play-icon"></i>
        </div>
        <div class="control-button" onclick="nextTrack()">
          <i class="fas fa-forward"></i>
        </div>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="progress-bar" id="progress-bar"></div>
  </div>
</div>
```

## 视觉规格

- **高度**：60px
- **背景**：半透明玻璃拟态效果（backdrop-filter: blur(15px)）
  - 浅色模式：rgba(255, 255, 255, 0.7)
  - 深色模式：rgba(30, 30, 30, 0.7)
- **专辑封面**：40px x 40px，圆角4px
- **文本样式**：
  - 歌曲标题：14px，衬线字体(New York)，斜体，500字重
  - 艺术家名称：12px，无衬线字体(SF Pro Text)，灰色
- **控制按钮**：32px x 32px，圆形
- **进度条**：高度2px，品牌红色(#8B0000)
- **阴影**：轻微顶部投影，增强层次感

## 功能实现

### 播放状态管理

组件维护内部播放状态，控制图标和进度显示：

```javascript
// 模拟播放状态
let isPlaying = false;

// 切换播放/暂停
function togglePlay() {
  isPlaying = !isPlaying;
  
  const playIcon = document.getElementById('play-icon');
  if (isPlaying) {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    startProgressAnimation();
  } else {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    stopProgressAnimation();
  }
}
```

### 进度条动画

动态更新进度条宽度，模拟播放进度：

```javascript
let progressInterval;
function startProgressAnimation() {
  let progress = parseInt(document.getElementById('progress-bar').style.width) || 0;
  clearInterval(progressInterval);
  
  progressInterval = setInterval(() => {
    progress += 0.1;
    if (progress >= 100) {
      progress = 0;
      nextTrack();
    }
    document.getElementById('progress-bar').style.width = `${progress}%`;
  }, 100);
}

function stopProgressAnimation() {
  clearInterval(progressInterval);
}
```

### 左右滑动切换曲目

支持触摸滑动手势切换曲目：

```javascript
// 添加滑动手势支持
const container = document.getElementById('swipe-container');
let startX, moveX;

container.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

container.addEventListener('touchmove', (e) => {
  moveX = e.touches[0].clientX;
});

container.addEventListener('touchend', () => {
  if (startX && moveX) {
    const diff = moveX - startX;
    // 向左滑动超过50px切换到下一曲
    if (diff < -50) {
      nextTrack();
    }
    // 向右滑动超过50px切换到上一曲
    else if (diff > 50) {
      // 上一曲功能实现
    }
  }
  startX = null;
  moveX = null;
});
```

### 曲目切换动画

切换曲目时的滑动过渡动画：

```javascript
function nextTrack() {
  // 播放动画效果
  const container = document.getElementById('swipe-container');
  const currentContent = container.innerHTML;
  
  // 创建当前内容的克隆，准备动画
  const currentElement = document.createElement('div');
  currentElement.innerHTML = currentContent;
  currentElement.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full');
  currentElement.classList.add('slide-out');
  
  // 获取下一首曲目
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  const nextTrack = tracks[currentTrackIndex];
  
  // 更新内容
  updateTrackInfo(nextTrack);
  
  // 添加动画元素
  container.appendChild(currentElement);
  
  // 动画结束后移除
  setTimeout(() => {
    currentElement.remove();
  }, 300);
}
```

### 显示/隐藏切换

控制播放条的显示与隐藏：

```javascript
function togglePlayerBar() {
  const playerBar = document.getElementById('player-bar');
  playerBar.classList.toggle('hidden');
}
```

## 使用方法

### 基本引入

1. 将播放条HTML复制到应用布局中（通常在导航栏上方）
2. 引入必要的CSS样式
3. 引入JavaScript实现交互功能

### 示例集成

```html
<body>
  <!-- 主内容区 -->
  <div class="main-content">
    <!-- ... -->
  </div>
  
  <!-- 迷你播放条 -->
  <div class="player-bar light hidden" id="player-bar">
    <!-- 组件内容... -->
  </div>
  
  <!-- 底部导航栏 -->
  <nav class="navigation-bar">
    <!-- ... -->
  </nav>
  
  <script>
    // 初始化播放条
    document.addEventListener('DOMContentLoaded', initPlayerBar);
    
    // 示例：在某处触发播放条显示
    function startPlaying(trackData) {
      // 更新播放条信息
      updateTrackInfo(trackData);
      // 显示播放条
      document.getElementById('player-bar').classList.remove('hidden');
      // 开始播放
      togglePlay();
    }
  </script>
</body>
```

### 音乐数据结构

组件使用以下数据结构管理曲目信息：

```javascript
const tracks = [
  {
    title: "莫扎特：D大调第三十八交响曲",
    artist: "维也纳爱乐乐团 / 伦纳德·伯恩斯坦",
    cover: "path/to/cover-image.jpg",
    progress: 40
  },
  // 更多曲目...
];
```

### 自定义样式

可以通过修改CSS变量自定义组件外观：

```css
:root {
  --brand-color: #8B0000; /* 主品牌色 */
  --inactive-color: #757575; /* 次要文本色 */
  --bg-light: rgba(255, 255, 255, 0.7); /* 浅色模式背景 */
  --bg-dark: rgba(30, 30, 30, 0.7); /* 深色模式背景 */
}
```

## 交互细节

### 点击行为
- 点击专辑封面或歌曲信息：进入完整播放页面
- 点击播放/暂停按钮：切换播放状态
- 点击下一曲按钮：切换到下一首曲目

### 滑动手势
- 左滑：切换到下一曲
- 右滑：切换到上一曲
- 上滑：隐藏播放条（完整实现中）

### 动画效果
- 显示/隐藏：上下滑动过渡（transform: translateY）
- 曲目切换：左右滑动过渡（transform: translateX）
- 按钮反馈：轻微缩放（transform: scale(0.9)）
- 进度条：平滑宽度变化（transition: width 0.1s linear）

## 性能优化

- 使用CSS transform属性触发GPU加速
- 有限DOM操作，重用现有元素
- 动画完成后自动移除临时元素
- 播放条隐藏时暂停进度条动画，减少CPU占用

## 辅助功能

- 足够的触摸区域（控制按钮至少32px x 32px）
- 适当的颜色对比度（文本与背景）
- 支持VoiceOver和TalkBack的无障碍标签

## 注意事项

1. **位置管理**：确保播放条在导航栏上方，不被其他元素遮挡
2. **Z-Index处理**：设置适当的层级，通常低于状态栏但高于主内容
3. **显示逻辑**：仅在有音乐播放时显示，避免空状态
4. **内存管理**：停止播放时清除定时器，避免内存泄漏

## 最佳实践

- 保持播放条UI简洁，仅显示最必要的信息
- 确保歌曲信息在有限空间内优雅截断（使用ellipsis）
- 与主播放页面保持一致的视觉风格
- 考虑添加微小的触觉反馈（在实际App中） 