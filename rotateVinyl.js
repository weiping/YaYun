/**
 * rotateVinyl.js - 控制黑胶唱片旋转的全局函数
 * 这个文件用于在雅韵App的播放页面中控制黑胶唱片的旋转动画
 */

/**
 * 控制唱片旋转
 * @param {boolean} shouldRotate - 是否应该旋转唱片
 */
function rotateVinyl(shouldRotate) {
  // 使用querySelector查找唱片元素，提高兼容性
  const vinyl = document.querySelector('.vinyl-record') || document.getElementById('vinyl');
  
  if (!vinyl) {
    console.error("唱片元素不存在");
    return;
  }
  
  try {
    console.log("控制唱片旋转:", shouldRotate);
    
    if (shouldRotate) {
      // 开始旋转 - 添加多重保险确保动画生效
      vinyl.classList.add('playing');
      
      // 强制内联样式设置动画
      vinyl.style.animation = 'rotateDisk 20s linear infinite';
      vinyl.style.animationPlayState = 'running';
      
      // 强制重新触发动画
      void vinyl.offsetWidth;
      
      // 确保动画样式具有高优先级并生效
      setTimeout(() => {
        if (!vinyl.classList.contains('playing')) {
          vinyl.classList.add('playing');
        }
        // 二次确认动画已应用
        if (vinyl.style.animationName !== 'rotateDisk') {
          vinyl.style.animation = 'rotateDisk 20s linear infinite';
          void vinyl.offsetWidth;
        }
      }, 10);
      
      console.log("已设置唱片旋转");
    } else {
      // 停止旋转
      vinyl.classList.remove('playing');
      
      // 清除动画
      vinyl.style.animation = 'none';
      vinyl.style.animationPlayState = 'paused';
      vinyl.style.transform = 'rotate(0deg)';
      
      // 确保动画确实停止
      setTimeout(() => {
        if (vinyl.classList.contains('playing')) {
          vinyl.classList.remove('playing');
        }
        if (vinyl.style.animationName === 'rotateDisk') {
          vinyl.style.animation = 'none';
          vinyl.style.transform = 'rotate(0deg)';
        }
      }, 10);
      
      console.log("已停止唱片旋转");
    }
    
    // 验证是否成功应用样式
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(vinyl);
      console.log("唱片样式检查:", {
        "animation": computedStyle.animation,
        "animationPlayState": computedStyle.animationPlayState,
        "transform": computedStyle.transform,
        "playing类": vinyl.classList.contains('playing')
      });
    }, 50);
  } catch (error) {
    console.error("控制唱片旋转出错:", error);
  }
}

// 添加全局事件监听，确保在iframe中也能正常工作
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'vinylControl') {
    console.log("收到唱片控制消息:", event.data.shouldRotate);
    rotateVinyl(event.data.shouldRotate);
  }
});

// 确保函数在全局作用域可用
window.rotateVinyl = rotateVinyl;
