/**
 * rotateVinyl.js - 控制黑胶唱片旋转的全局函数
 * 这个文件用于在雅韵App的播放页面中控制黑胶唱片的旋转动画
 * 版本：1.2 - 增强旋转功能的可靠性
 */

/**
 * 控制唱片旋转
 * @param {boolean} shouldRotate - 是否应该旋转唱片
 */
function rotateVinyl(shouldRotate) {
  console.log("[rotateVinyl.js] 调用旋转控制函数:", shouldRotate);
  
  try {
    // 增强元素选择器，提高查找可靠性
    const vinylOptions = [
      document.querySelector('.vinyl-record'),
      document.getElementById('vinyl'),
      document.querySelector('[class*="vinyl"]'),
      document.querySelectorAll('div[class*="vinyl"]')[0]
    ];
    
    // 找到第一个存在的元素
    const vinyl = vinylOptions.find(el => el !== null);
    
    if (!vinyl) {
      console.error("[rotateVinyl.js] 找不到唱片元素 - 所有选择器都失败");
      return false;
    }
    
    console.log("[rotateVinyl.js] 找到唱片元素:", vinyl);
    
    // 确保动画定义存在
    ensureAnimationStyles();
    
    // 应用旋转逻辑
    if (shouldRotate) {
      // === 开始旋转 ===
      console.log("[rotateVinyl.js] 开始旋转唱片");
      
      // 1. 添加playing类
      vinyl.classList.add('playing');
      
      // 2. 应用内联样式
      vinyl.style.setProperty('animation', 'rotateDisk 20s linear infinite', 'important');
      vinyl.style.setProperty('animation-play-state', 'running', 'important');
      vinyl.style.removeProperty('transform'); // 清除可能有的transform停止状态
      
      // 3. 强制重新计算样式
      void vinyl.offsetWidth;
      
      // 4. 二次确认 - 在短暂延迟后检查动画是否确实应用
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(vinyl);
        if (computedStyle.animationName !== 'rotateDisk' || 
            computedStyle.animationPlayState !== 'running') {
          
          console.warn("[rotateVinyl.js] 动画未正确应用，再次尝试");
          
          // 更激进地应用样式
          vinyl.style.cssText = `
            animation: rotateDisk 20s linear infinite !important;
            animation-play-state: running !important;
            animation-delay: 0s !important;
          `;
          
          // 再次强制重新计算样式
          void vinyl.offsetWidth;
        }
        
        // 记录最终状态
        logVinylStatus(vinyl);
      }, 20);
      
      return true;
    } else {
      // === 停止旋转 ===
      console.log("[rotateVinyl.js] 停止旋转唱片");
      
      // 1. 移除playing类
      vinyl.classList.remove('playing');
      
      // 2. 停止动画并重置旋转
      vinyl.style.setProperty('animation', 'none', 'important');
      vinyl.style.setProperty('animation-play-state', 'paused', 'important');
      vinyl.style.setProperty('transform', 'rotate(0deg)', 'important');
      
      // 3. 二次确认 - 在短暂延迟后检查动画是否确实停止
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(vinyl);
        if (computedStyle.animationName === 'rotateDisk' && 
            computedStyle.animationPlayState === 'running') {
            
          console.warn("[rotateVinyl.js] 动画未正确停止，使用更激进的方法");
          
          // 更激进地应用停止样式
          vinyl.style.cssText = `
            animation: none !important;
            animation-play-state: paused !important;
            transform: rotate(0deg) !important;
          `;
        }
        
        // 记录最终状态
        logVinylStatus(vinyl);
      }, 20);
      
      return true;
    }
  } catch (error) {
    console.error("[rotateVinyl.js] 控制唱片旋转出错:", error);
    return false;
  }
}

/**
 * 确保动画样式已添加到文档中
 */
function ensureAnimationStyles() {
  // 检查是否已存在样式元素
  if (!document.querySelector('style#vinyl-animations-external')) {
    console.log("[rotateVinyl.js] 添加动画样式定义");
    
    // 创建样式元素
    const styleEl = document.createElement('style');
    styleEl.id = 'vinyl-animations-external';
    styleEl.textContent = `
      @keyframes rotateDisk {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .vinyl-record.playing {
        animation-name: rotateDisk !important;
        animation-duration: 20s !important;
        animation-timing-function: linear !important;
        animation-iteration-count: infinite !important;
        animation-play-state: running !important;
        animation-delay: 0s !important;
      }
    `;
    
    // 添加到文档头部
    document.head.appendChild(styleEl);
  }
}

/**
 * 记录唱片元素状态
 */
function logVinylStatus(vinyl) {
  if (!vinyl) return;
  
  const computedStyle = window.getComputedStyle(vinyl);
  console.log("[rotateVinyl.js] 唱片状态:", {
    "类名": vinyl.className,
    "内联样式": vinyl.style.cssText,
    "animation": computedStyle.animation,
    "animationPlayState": computedStyle.animationPlayState,
    "transform": computedStyle.transform
  });
}

// 确保函数在window对象上可用
window.rotateVinyl = rotateVinyl;

// 监听消息，支持iframe通信
window.addEventListener('message', function(event) {
  // 处理来自父窗口或iframe的控制消息
  if (event.data && typeof event.data === 'object') {
    // 处理唱片控制消息
    if (event.data.type === 'vinylControl') {
      console.log("[rotateVinyl.js] 收到唱片控制消息:", event.data.shouldRotate);
      rotateVinyl(event.data.shouldRotate);
    }
  }
});

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log("[rotateVinyl.js] 已加载 (版本1.2)");
  ensureAnimationStyles();
  
  // 导出控制函数到页面上下文
  if (window.directRotateVinyl && typeof window.directRotateVinyl === 'function') {
    console.log("[rotateVinyl.js] 检测到页面已定义directRotateVinyl函数");
  } else {
    console.log("[rotateVinyl.js] 导出rotateVinyl作为directRotateVinyl的备用");
    window.directRotateVinyl = rotateVinyl;
  }
}); 