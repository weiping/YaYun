# 雅韵(YaYun) - 发现页面说明文档

## 页面概述

发现页面是雅韵应用的音乐探索中心，为用户提供个性化推荐内容和音乐排行榜，帮助用户发现新的经典音乐作品。页面采用模块化设计，清晰划分不同内容分区，使用卡片式布局展示推荐内容，结合品牌色调和iOS风格设计元素，为用户提供直观、高效的音乐发现体验。

## 页面结构

发现页面采用纵向滚动的布局结构，由以下主要模块组成：

1. **状态栏**：顶部iOS风格状态栏，显示时间和系统状态图标
2. **页面标题**：使用衬线字体显示"发现"标题，风格典雅
3. **个性推荐区**：包含大图推荐卡片和双栏推荐内容，展示根据用户偏好推荐的音乐内容
4. **分类浏览区**：横向可滚动的音乐分类标签，提供快速分类导航功能
5. **排行榜区**：展示经典音乐榜和新上架排行，以列表形式呈现热门曲目
6. **底部导航栏**：固定在底部的主导航，提供应用主要功能入口

## 设计规格

### 整体视觉

- **主色调**：深红色(#8B0000)与金色(#D4AF37)点缀
- **背景色**：
  - 浅色模式：白色(#FFFFFF)
  - 深色模式：深灰色(#1E1E1E)
- **字体**：
  - 页面标题：New York衬线字体，24px，500字重
  - 区块标题：SF Pro Display，18px，600字重
  - 内容文本：SF Pro Display，14px，400/500字重
  - 辅助文本：SF Pro Text，12px，400字重

### 内容模块

#### 个性推荐区

- **大图推荐卡片**：
  - 尺寸：全宽 x 192px
  - 圆角：16px
  - 阴影：0 4px 12px rgba(0, 0, 0, 0.08)
  - 渐变叠加：底部到顶部的黑色渐变，增强文字可读性
  - 文本层级：分类标签(小号) → 标题(中号) → 描述(小号)

- **推荐网格**：
  - 布局：两列网格
  - 单元尺寸：约170px x 160px
  - 圆角：16px
  - 图片比例：1:1（方形）

#### 分类浏览区

- **分类标签**：
  - 背景：品牌色10%透明度
  - 文字颜色：品牌色(#8B0000)
  - 圆角：12px
  - 内边距：4px 10px
  - 布局：横向滚动容器，无滚动条

#### 排行榜区

- **榜单卡片**：
  - 背景：白色(深色模式下为深灰色)
  - 标题栏：品牌色背景，白色文本
  - 圆角：12px
  - 阴影：轻微阴影增强立体感
  - 内边距：16px

- **榜单项**：
  - 高度：60px
  - 布局：排名 → 封面 → 曲目信息 → 播放量
  - 分隔线：浅灰色(深色模式下为深灰色)
  - 交互反馈：点击时轻微背景色变化

## 交互设计

### 点击交互

- **推荐卡片**：
  - 轻微缩放效果（scale: 0.98）
  - 阴影减小
  - 粒子动画效果从点击位置扩散
  - 点击后将跳转至相应详情页面

- **分类标签**：
  - 点击后将显示相应分类的音乐内容
  - 当前未实现筛选逻辑，作为预留功能

- **排行榜项**：
  - 点击时轻微背景色变化
  - 粒子动画效果从点击位置扩散
  - 点击后将跳转至歌曲播放页面

### 滚动交互

- **页面滚动**：
  - 流畅的垂直滚动
  - 隐藏滚动条，提供更沉浸式的体验
  - 内容超出屏幕可继续滚动

- **分类区域**：
  - 横向滚动容器
  - 无滚动条
  - 平滑的触摸滑动体验

### 特效动画

- **粒子效果**：
  - 点击元素时触发
  - 5-8个彩色粒子从点击位置向四周扩散
  - 粒子从小变大，透明度从高到低
  - 动画时长：600ms

## 功能实现

### 组件加载

页面采用模块化设计，通过JavaScript动态加载共享组件：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 加载状态栏
  fetch('../components/status-bar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('status-bar-container').innerHTML = html;
      updateStatusTime();
    });
  
  // 加载导航栏
  fetch('../components/navigation-bar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navigation-bar-container').innerHTML = html;
      setTimeout(() => {
        setActiveTab(document.querySelector('[data-name="discover"]'));
      }, 100);
    });
  
  // 加载播放条
  fetch('../components/player-bar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('player-bar-container').innerHTML = html;
    });
});
```

### 粒子动画效果

点击元素时触发的粒子扩散动画：

```javascript
function createParticleEffect(event) {
  const x = event.clientX;
  const y = event.clientY;
  
  // 创建粒子容器
  let container = document.querySelector('.particles-container-temp');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('particles-container-temp');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }
  
  // 创建5-8个粒子
  const particleCount = Math.floor(Math.random() * 4) + 5;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // 随机大小 (3-6px)
    const size = Math.random() * 3 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 随机位置 (围绕点击位置)
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 10;
    const particleX = x + Math.cos(angle) * distance;
    const particleY = y + Math.sin(angle) * distance;
    
    particle.style.left = `${particleX}px`;
    particle.style.top = `${particleY}px`;
    
    // 添加到容器
    container.appendChild(particle);
    
    // 动画结束后移除
    setTimeout(() => {
      particle.remove();
    }, 600);
  }
}
```

### 深色/浅色模式

支持自动适应系统主题或手动切换：

```javascript
// 深色/浅色模式切换
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  
  // 更新组件主题
  const statusBar = document.getElementById('status-bar');
  const navigationBar = document.getElementById('navigation-bar');
  const playerBar = document.getElementById('player-bar');
  
  if (statusBar) {
    if (isDark) {
      statusBar.classList.remove('light');
      statusBar.classList.add('dark');
    } else {
      statusBar.classList.remove('dark');
      statusBar.classList.add('light');
    }
  }
  
  // 更新其他组件...
}

// 检测系统主题偏好
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
}
```

## 用户体验优化

### 性能优化

- **图片优化**：使用适当大小的图片资源，避免过大文件影响加载速度
- **无滚动条**：隐藏滚动条，提供更沉浸式的滚动体验
- **延迟加载**：组件和功能按需加载，优化初始加载速度
- **CSS过渡**：所有交互动效使用CSS过渡实现，提升性能

### 交互反馈

- **点击反馈**：元素点击时有明确的视觉反馈（缩放、背景色变化）
- **粒子效果**：增强用户点击的视觉反馈，提升趣味性
- **状态指示**：当前分区和功能有明确的视觉状态区分

### 界面适配

- **深色模式**：完整支持系统深色模式，自动适应系统设置变化
- **iPhone适配**：针对iPhone 15 Pro尺寸设计，确保界面元素合理排布

## 下一步优化

1. **实现分类筛选**：为分类标签添加实际筛选功能
2. **个性化推荐算法**：实现基于用户历史的真实推荐逻辑
3. **内容预加载**：优化图片加载策略，实现预加载和渐进式加载
4. **添加下拉刷新**：实现下拉刷新功能，更新推荐内容
5. **添加播放交互**：点击排行榜项直接播放音乐预览

## 注意事项

1. 页面采用固定宽度375px设计，确保在模拟器中正确显示
2. 粒子动画使用原生JavaScript实现，确保性能和兼容性
3. 组件加载使用fetch API，需要在支持现代浏览器的环境中运行
4. 深色模式切换逻辑需要与其他页面保持一致 