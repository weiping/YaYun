# 雅韵(YaYun) - 专辑详情页面说明文档

## 页面概述

专辑详情页面是雅韵应用的核心内容展示页面，为用户提供专辑完整信息、曲目列表和相关推荐。页面采用精致的视觉设计，突出专辑封面和内容信息，使用卡片上浮效果创造视觉层次，为用户提供沉浸式的专辑浏览体验。页面设计注重信息架构和视觉层级，使用品牌色调和衬线字体强调古典音乐的优雅氛围。

## 页面结构

专辑详情页面采用自上而下的垂直滚动布局，主要由以下部分组成：

1. **状态栏**：顶部iOS风格状态栏
2. **专辑封面区**：大尺寸专辑封面图片，带有返回按钮和渐变叠加层
3. **专辑信息区**：上浮卡片式设计，包含专辑标题、艺术家、元数据和简介
4. **操作按钮区**：主播放按钮和辅助功能按钮（收藏、添加、下载）
5. **曲目列表区**：专辑内所有曲目的列表，包含序号、标题、作曲家和时长信息
6. **专辑详情区**：展示专辑的详细信息（指挥、演奏者、录音时间等）
7. **相关推荐区**：横向滚动的相关专辑推荐
8. **底部导航栏**：固定在底部的应用主导航

## 设计规格

### 整体视觉

- **主色调**：深红色(#8B0000)与金色(#D4AF37)点缀
- **背景色**：
  - 浅色模式：白色(#FFFFFF)
  - 深色模式：深灰色(#1E1E1E)
- **字体**：
  - 专辑标题：New York衬线字体，22px，500字重
  - 艺术家名称：SF Pro Display，15px，500字重，品牌色
  - 内容文本：SF Pro Display，14px，400字重
  - 辅助文本：SF Pro Text，13px，400字重

### 关键模块

#### 专辑封面区

- **尺寸**：正方形，宽度等于视口宽度（最大375px）
- **返回按钮**：左上角，36px圆形半透明黑色背景
- **渐变叠加**：底部60%透明渐变至黑色渐变，增强文字可读性

#### 专辑信息卡片

- **形状**：上部圆角24px的卡片
- **位置**：相对于封面上移50px，创造上浮效果
- **阴影**：轻微上投影，增强层次感
- **内边距**：上下24px，左右20px
- **元数据**：水平排列的发行日期、CD数量、曲目数量，加黄金色Hi-Res标志

#### 操作按钮区

- **主按钮**：品牌红色背景，白色文字，圆角24px，带阴影
- **辅助按钮**：标准iOS风格垂直排列的图标+文字按钮
- **按钮点击效果**：轻微缩放及粒子动画效果

#### 曲目列表

- **项目高度**：约56px
- **分隔线**：浅灰色1px线条
- **布局**：序号(30px) → 信息(弹性增长) → 时长(45px) → 更多按钮(40px)
- **曲目序号**：衬线字体，灰色
- **曲目标题**：500字重，正常颜色
- **作曲家**：小号灰色字体

#### 相关推荐区

- **卡片尺寸**：120px x 120px
- **卡片间距**：12px
- **卡片圆角**：8px
- **标题文字**：13px，500字重，单行显示
- **艺术家名称**：12px，灰色，单行显示

### Hi-Res徽章

- **背景**：金色(#D4AF37)
- **形状**：圆角4px
- **尺寸**：适应文本大小，内边距2px 6px
- **字体**：10px，600字重，搭配音乐图标

## 交互设计

### 导航交互

- **返回按钮**：点击返回上一页
- **主播放按钮**：点击播放专辑所有曲目
- **曲目点击**：点击单曲播放对应曲目
- **更多按钮**：点击显示曲目操作菜单（尚未实现）
- **相关专辑**：点击跳转到对应专辑详情页

### 视觉反馈

- **按钮效果**：
  - 主播放按钮：点击时轻微缩放(scale: 0.98)和阴影减小
  - 曲目列表项：点击时轻微背景色变化

- **粒子效果**：
  - 所有可交互元素点击时产生粒子扩散效果
  - 5-8个粒子从点击位置向四周扩散
  - 粒子动画时长：600ms

### 滚动行为

- **页面滚动**：
  - 专辑信息区域支持垂直滚动
  - 无滚动条设计，提供更沉浸式体验

- **相关推荐**：
  - 水平滚动容器
  - 支持触摸滑动
  - 平滑滚动效果（-webkit-overflow-scrolling: touch）

## 功能实现

### 组件加载

动态加载状态栏、播放条和导航栏组件：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 加载状态栏
  fetch('../components/status-bar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('status-bar-container').innerHTML = html;
      updateStatusTime();
    });
  
  // 加载导航栏和播放条
  fetch('../components/navigation-bar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navigation-bar-container').innerHTML = html;
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

交互元素点击时产生粒子动画：

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
    
    // 随机属性设置...
    
    // 添加到容器并设置自动移除
    container.appendChild(particle);
    setTimeout(() => { particle.remove(); }, 600);
  }
}
```

### 播放功能接口

为曲目播放提供接口：

```javascript
function playTrack(trackNumber) {
  // 播放逻辑
  console.log(`播放第${trackNumber}首曲目`);
  
  // 显示播放条
  const playerBar = document.getElementById('player-bar');
  if (playerBar) {
    playerBar.classList.remove('hidden');
  }
}
```

### 深色模式适配

支持系统深色模式切换：

```javascript
// 检测系统主题偏好
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (e.matches) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
```

## 用户体验优化

### 视觉层次设计

- **卡片上浮效果**：专辑信息卡片上浮于封面之上，创造清晰的视觉层次
- **渐变叠加**：封面底部的渐变增强文字可读性
- **小元素强调**：金色Hi-Res标志突出显示音质信息
- **衬线/无衬线字体混合**：增强古典音乐的优雅感和现代UI的清晰度

### 内容组织

- **信息分块**：将专辑信息分为简介、曲目、详情、推荐四个主要区块
- **简洁表达**：简洁表达专辑信息，避免信息过载
- **视觉扫描优化**：曲目列表的序号和标题对齐，方便快速浏览

### 交互细节

- **触摸友好**：所有交互元素尺寸不小于44px，便于触控
- **粒子反馈**：所有可点击元素都提供粒子特效反馈
- **视觉一致性**：与其他页面保持一致的交互模式和视觉元素

## 可访问性

- **高对比度**：文本与背景保持足够对比度，符合WCAG AA级标准
- **深色模式**：完整支持系统深色模式，减少屏幕亮度和眼睛疲劳
- **文本大小**：主要内容使用中等以上字号，确保可读性
- **返回按钮**：明确的返回导航，避免用户迷失

## 注意事项

1. 专辑详情页面需要根据实际专辑数据动态生成内容
2. 曲目列表项的"更多"按钮尚未实现下拉菜单功能
3. 主播放按钮应连接实际的音频播放功能
4. 相关推荐区应实现基于算法的个性化推荐
5. 页面采用固定宽度375px设计，确保在iPhone模拟器中正确显示 