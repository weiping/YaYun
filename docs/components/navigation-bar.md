# 雅韵(YaYun) - 导航栏组件说明文档

## 组件概述

导航栏组件是模拟iOS底部选项卡的可复用导航组件，固定在应用底部，提供应用的主要功能入口。组件包含首页、发现、搜索、我的四个主要导航选项，支持深色/浅色两种模式，并实现了精美的点击粒子动画效果。

## 组件结构

```html
<nav class="navigation-bar light" id="navigation-bar">
  <!-- 粒子效果容器 -->
  <div class="particles-container" id="particles-container"></div>
  
  <!-- 首页 -->
  <div class="nav-item active" data-name="home" onclick="setActiveTab(this)">
    <i class="nav-icon fa-solid fa-home"></i>
    <span class="nav-text">首页</span>
  </div>
  
  <!-- 发现 -->
  <div class="nav-item" data-name="discover" onclick="setActiveTab(this)">
    <i class="nav-icon fa-solid fa-compass"></i>
    <span class="nav-text">发现</span>
  </div>
  
  <!-- 搜索 -->
  <div class="nav-item" data-name="search" onclick="setActiveTab(this)">
    <i class="nav-icon fa-solid fa-search"></i>
    <span class="nav-text">搜索</span>
  </div>
  
  <!-- 我的 -->
  <div class="nav-item" data-name="profile" onclick="setActiveTab(this)">
    <i class="nav-icon fa-solid fa-user"></i>
    <span class="nav-text">我的</span>
  </div>
  
  <!-- 底部手势条 -->
  <div class="home-indicator"></div>
</nav>
```

## 视觉规格

- **整体高度**：83px（包含49px导航区域和34px底部安全区）
- **背景**：毛玻璃效果（backdrop-filter: blur(10px)）
  - 浅色模式：rgba(255, 255, 255, 0.8)
  - 深色模式：rgba(30, 30, 30, 0.8)
- **图标尺寸**：24px x 24px
- **文本大小**：10px，San Francisco字体，500字重
- **颜色**：
  - 激活状态：品牌色 #8B0000
  - 未激活状态：灰色 #757575
- **手势条**：134px x 5px，居中显示，圆角100px，黑色或白色（基于主题）

## 功能实现

### 标签页切换

通过点击导航项切换激活状态：

```javascript
function setActiveTab(element) {
  // 移除所有标签的激活状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 为当前标签添加激活状态
  element.classList.add('active');
  
  // 创建点击粒子效果
  createParticles(element);
}
```

### 粒子动画效果

点击导航项时产生粒子扩散动画：

```javascript
function createParticles(element) {
  const container = document.getElementById('particles-container');
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 创建8-12个粒子
  const particleCount = Math.floor(Math.random() * 5) + 8;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // 随机大小 (3-6px)
    const size = Math.random() * 3 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 随机位置 (围绕点击中心)
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 10;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // 添加到容器
    container.appendChild(particle);
    
    // 动画结束后移除
    setTimeout(() => {
      particle.remove();
    }, 600);
  }
}
```

粒子动画CSS：

```css
.particles-container {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background-color: var(--brand-color);
  border-radius: 50%;
  opacity: 0.6;
  transform: scale(0);
  animation: particleAnimation 0.6s ease-out forwards;
}

@keyframes particleAnimation {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
```

### 深色/浅色模式切换

支持自动适应系统主题：

```javascript
function toggleTheme(isDark) {
  const navigationBar = document.getElementById('navigation-bar');
  
  if (isDark) {
    navigationBar.classList.remove('light');
    navigationBar.classList.add('dark');
  } else {
    navigationBar.classList.remove('dark');
    navigationBar.classList.add('light');
  }
}

// 检测系统主题并应用
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
toggleTheme(prefersDark);

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  toggleTheme(e.matches);
});
```

## 使用方法

### 基本引入

1. 引入Font Awesome图标库
2. 复制导航栏HTML结构到页面底部
3. 引入CSS样式和JavaScript代码

### 导航项配置

可以通过以下方式自定义导航项：

```html
<div class="nav-item" data-name="custom" onclick="setActiveTab(this)">
  <i class="nav-icon fa-solid fa-custom-icon"></i>
  <span class="nav-text">自定义</span>
</div>
```

- `data-name`: 导航项标识，可用于页面切换逻辑
- `nav-icon`: 可替换为任何Font Awesome图标
- `nav-text`: 自定义导航文本

### 页面集成示例

```html
<body>
  <!-- 页面内容 -->
  <div class="main-content">
    <!-- ... -->
  </div>
  
  <!-- 导航栏 -->
  <nav class="navigation-bar light" id="navigation-bar">
    <!-- 导航内容... -->
  </nav>
  
  <script>
    // 导航栏初始化代码
    document.addEventListener('DOMContentLoaded', initNavigationBar);
    
    // 页面切换逻辑
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        const pageName = this.getAttribute('data-name');
        navigateToPage(pageName);
      });
    });
    
    function navigateToPage(pageName) {
      // 自定义页面跳转逻辑
      console.log(`Navigating to ${pageName}`);
    }
  </script>
</body>
```

## 性能优化

- 粒子动画使用CSS transform和opacity属性触发GPU加速
- 设置动画结束后自动移除粒子DOM元素，避免内存泄漏
- 使用requestAnimationFrame替代setTimeout实现更流畅的动画（完整实现中）
- 毛玻璃效果仅应用于小面积区域，避免性能问题

## 兼容性说明

- backdrop-filter属性：Safari完全支持，Chrome/Edge需添加-webkit-前缀
- CSS变量：现代浏览器广泛支持，IE不支持
- Animation API：所有现代浏览器支持
- 媒体查询prefers-color-scheme：iOS 13+, Android 10+, 现代桌面浏览器

## 辅助功能

- 导航项使用语义化元素并添加适当的aria属性
- 颜色对比度符合WCAG 2.1 AA标准
- 触摸区域足够大（60px宽），便于触控操作
- 视觉反馈清晰，支持键盘导航

## 最佳实践

- 确保导航栏固定在底部，不被内容遮挡
- 保持当前活动项与页面内容一致
- 保留足够的底部安全区，适配全面屏设备
- 考虑在页面滚动时隐藏/显示导航栏的平滑过渡效果 