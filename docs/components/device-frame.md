# 雅韵(YaYun) - iPhone 15 Pro设备框架组件说明文档

## 组件概述

iPhone 15 Pro设备框架组件是高保真模拟iPhone 15 Pro物理外观的容器组件，用于在浏览器环境中展示移动应用界面原型。该组件精确再现了iPhone 15 Pro的物理尺寸、外观特征、边框材质以及灵动岛等细节，为应用界面提供了真实的展示环境。

## 设备规格

- **物理尺寸**：146.6 x 70.6 x 8.25mm
- **屏幕尺寸**：375px x 812px（视觉尺寸，实际像素是2796 x 1290，460ppi）
- **边框材质**：钛金属拉丝效果，深空黑色(#1A1A1A)
- **边角弧度**：45px（大圆角）
- **灵动岛尺寸**：114px x 32px
- **屏幕边缘光晕**：2px，半透明白色(rgba(255,255,255,0.1))

## 组件结构

```html
<div class="device-frame">
  <!-- 侧边按钮 -->
  <div class="device-button power-button"></div>
  <div class="device-button volume-up"></div>
  <div class="device-button volume-down"></div>
  <div class="device-button action-button"></div>
  
  <!-- 屏幕区域 -->
  <div class="device-screen">
    <!-- 灵动岛 -->
    <div class="dynamic-island"></div>
    
    <!-- 屏幕内容 -->
    <div class="content-frame">
      <div class="screen-content">
        <!-- 屏幕内容区域 -->
      </div>
    </div>
    
    <!-- 底部手势条 -->
    <div class="home-indicator"></div>
    
    <!-- 屏幕边缘光晕 -->
    <div class="screen-edge-glow"></div>
  </div>
  
  <!-- 底部接口 -->
  <div class="lightning-port"></div>
</div>
```

## 视觉实现

### 设备框架

设备框架采用CSS精确模拟iPhone 15 Pro的外观：

```css
.device-frame {
  position: relative;
  width: var(--device-frame-width); /* 417px */
  height: calc(var(--device-height) + var(--bezel-size) * 2); /* 812px + 32px */
  margin: 0 auto;
  border-radius: var(--corner-radius); /* 45px */
  background-color: var(--device-color); /* #1A1A1A */
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12), 0 10px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  /* 钛金属拉丝效果 */
  background-image: 
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.025),
      rgba(255, 255, 255, 0.025) 1px,
      transparent 1px,
      transparent 2px
    );
}
```

### 屏幕区域

屏幕区域包含内容显示区和灵动岛：

```css
.device-screen {
  position: absolute;
  top: var(--bezel-size); /* 16px */
  left: var(--bezel-size); /* 16px */
  width: var(--device-width); /* 375px */
  height: var(--device-height); /* 812px */
  border-radius: 38px;
  overflow: hidden;
  background-color: #000;
}

.dynamic-island {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: var(--dynamic-island-width); /* 114px */
  height: var(--dynamic-island-height); /* 32px */
  background-color: #000;
  border-radius: 20px;
  z-index: 10;
}

.home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  background-color: #fff;
  border-radius: 100px;
  opacity: 0.5;
  z-index: 10;
}
```

### 侧边按钮

模拟设备侧边按钮：

```css
.device-button {
  position: absolute;
  background-color: #111111;
  border-radius: 2px;
}

.power-button {
  top: 150px;
  right: -3px;
  width: 3px;
  height: 80px;
}

.volume-up {
  top: 150px;
  left: -3px;
  width: 3px;
  height: 40px;
}

.volume-down {
  top: 200px;
  left: -3px;
  width: 3px;
  height: 40px;
}

.action-button {
  top: 120px;
  left: -3px;
  width: 3px;
  height: 20px;
}
```

### 底部接口

模拟Lightning接口：

```css
.lightning-port {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 6px;
  background-color: #111;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.lightning-port::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 4px;
  background-color: #222;
  border-radius: 2px;
}
```

## 功能实现

### 内容嵌入

设备框架支持通过iframe嵌入内容：

```javascript
function embedContent(url) {
  if (!url) return;
  
  const contentFrame = document.querySelector('.content-frame');
  contentFrame.innerHTML = '';
  
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.classList.add('debug-frame');
  contentFrame.appendChild(iframe);
}
```

### 设备尺寸自适应

组件能够根据浏览器窗口大小自动调整尺寸：

```javascript
function resizeDeviceFrame() {
  const windowHeight = window.innerHeight;
  const deviceFrame = document.querySelector('.device-frame');
  const deviceHeight = parseFloat(getComputedStyle(deviceFrame).height);
  
  if (deviceHeight > windowHeight * 0.9) {
    // 如果设备高度超过窗口高度的90%，按比例缩小
    const scale = (windowHeight * 0.9) / deviceHeight;
    deviceFrame.style.transform = `scale(${scale})`;
  } else {
    deviceFrame.style.transform = 'scale(1)';
  }
}

// 窗口大小变化时重新调整
window.addEventListener('resize', resizeDeviceFrame);
```

### URL参数内容加载

支持通过URL参数加载内容页面：

```javascript
// 检查URL参数中是否有content参数，如果有则嵌入外部内容
const urlParams = new URLSearchParams(window.location.search);
const contentUrl = urlParams.get('content');
if (contentUrl) {
  embedContent(contentUrl);
}
```

## 使用方法

### 基本使用

1. 在HTML页面中引入设备框架组件代码
2. 通过iframe或内容注入的方式展示应用界面

### 内容嵌入方式

#### 方式一：直接在HTML中嵌入内容

```html
<div class="device-frame">
  <!-- 设备框架结构... -->
  <div class="device-screen">
    <!-- 直接嵌入内容 -->
    <div class="content-frame">
      <div class="screen-content">
        <h1>应用标题</h1>
        <p>应用内容</p>
      </div>
    </div>
    <!-- 其他设备元素... -->
  </div>
</div>
```

#### 方式二：使用iframe嵌入页面

```html
<div class="device-frame">
  <!-- 设备框架结构... -->
  <div class="device-screen">
    <iframe src="pages/home.html" class="device-iframe"></iframe>
    <!-- 其他设备元素... -->
  </div>
</div>
```

#### 方式三：JavaScript动态加载内容

```javascript
// 在主入口页面加载不同的应用页面
function loadPage(pageName) {
  const deviceScreen = document.querySelector('.device-screen');
  const iframe = document.createElement('iframe');
  iframe.src = `pages/${pageName}.html`;
  iframe.classList.add('device-iframe');
  
  // 清除现有内容
  deviceScreen.innerHTML = '';
  
  // 添加灵动岛和手势条
  const dynamicIsland = document.createElement('div');
  dynamicIsland.classList.add('dynamic-island');
  deviceScreen.appendChild(dynamicIsland);
  
  // 添加iframe
  deviceScreen.appendChild(iframe);
  
  const homeIndicator = document.createElement('div');
  homeIndicator.classList.add('home-indicator');
  deviceScreen.appendChild(homeIndicator);
}
```

### 参数配置

可以通过修改CSS变量自定义设备外观：

```css
:root {
  --device-width: 375px;
  --device-height: 812px;
  --device-frame-width: 417px;
  --device-color: #1A1A1A;
  --bezel-size: 16px;
  --corner-radius: 45px;
  --dynamic-island-width: 114px;
  --dynamic-island-height: 32px;
  --screen-edge-glow: rgba(255, 255, 255, 0.1);
}
```

## 高级功能

### 灵动岛交互模拟

可以为灵动岛添加交互动画：

```javascript
function setupDynamicIslandInteraction() {
  const dynamicIsland = document.querySelector('.dynamic-island');
  
  // 点击展开
  dynamicIsland.addEventListener('click', function() {
    this.classList.toggle('expanded');
    if (this.classList.contains('expanded')) {
      this.style.width = '340px';
      this.style.height = '120px';
      // 添加展开内容
      this.innerHTML = `
        <div class="island-content">
          <div class="island-nowplaying">
            <img src="album-cover.jpg" class="island-album">
            <div class="island-track-info">
              <div class="island-title">正在播放：莫扎特小夜曲</div>
              <div class="island-artist">维也纳爱乐乐团</div>
            </div>
          </div>
        </div>
      `;
    } else {
      this.style.width = '114px';
      this.style.height = '32px';
      this.innerHTML = '';
    }
  });
  
  // 长按显示菜单
  let pressTimer;
  dynamicIsland.addEventListener('mousedown', function() {
    pressTimer = setTimeout(() => {
      // 显示控制菜单
      alert('显示灵动岛控制菜单');
    }, 500);
  });
  
  dynamicIsland.addEventListener('mouseup', function() {
    clearTimeout(pressTimer);
  });
}
```

### 屏幕旋转模拟

支持横屏模式切换：

```javascript
function toggleOrientation() {
  const deviceFrame = document.querySelector('.device-frame');
  deviceFrame.classList.toggle('landscape');
  
  if (deviceFrame.classList.contains('landscape')) {
    // 交换宽高
    deviceFrame.style.width = `${812 + 32}px`;
    deviceFrame.style.height = `${375 + 32}px`;
    // 旋转内容
    document.querySelector('.device-screen').style.transform = 'rotate(90deg)';
  } else {
    // 恢复竖屏
    deviceFrame.style.width = `${375 + 32}px`;
    deviceFrame.style.height = `${812 + 32}px`;
    document.querySelector('.device-screen').style.transform = 'rotate(0)';
  }
  
  // 重新调整大小
  resizeDeviceFrame();
}
```

## 最佳实践

1. **保持比例一致**：确保嵌入的内容页面设计为375px宽度，与设备屏幕尺寸匹配
2. **关注细节**：添加阴影、反光和纹理细节，增强真实感
3. **适配环境**：在不同大小的显示器上测试，确保设备框架始终可见
4. **避免冲突**：确保iframe内容不会尝试控制父页面
5. **性能考虑**：合理使用CSS效果，避免过度使用高耗能特效

## 注意事项

1. 设备框架仅用于展示原型，不应替代真机测试
2. 在实际移动设备上查看时，应隐藏设备框架
3. 为不同设备型号准备不同的框架组件
4. 考虑为横屏模式提供支持 