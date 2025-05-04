/**
 * keyboard-accessibility.js
 * 雅韵(YaYun)应用键盘可访问性支持
 * 提高应用对键盘用户和屏幕阅读器的支持
 */

(function() {
  console.log('正在初始化键盘可访问性支持...');
  
  // 焦点管理
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  // 添加键盘可访问性支持到元素
  function makeElementKeyboardAccessible(element) {
    if (!element) return;
    
    // 确保可聚焦
    if (!element.getAttribute('tabindex') && 
        !element.tagName.match(/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/i)) {
      element.setAttribute('tabindex', '0');
    }
    
    // 确保有正确的角色
    if (!element.getAttribute('role')) {
      if (element.classList.contains('control-button') || 
          element.classList.contains('action-button')) {
        element.setAttribute('role', 'button');
      } else if (element.classList.contains('progress-bar')) {
        element.setAttribute('role', 'progressbar');
        
        // 添加必要的ARIA属性
        if (!element.hasAttribute('aria-valuenow')) {
          const progressCurrent = element.querySelector('.progress-current');
          if (progressCurrent) {
            const width = progressCurrent.style.width;
            const value = parseInt(width) || 0;
            element.setAttribute('aria-valuenow', value);
            element.setAttribute('aria-valuemin', '0');
            element.setAttribute('aria-valuemax', '100');
          }
        }
      }
    }
    
    // 确保有可访问名称
    if (!element.getAttribute('aria-label') && 
        !element.getAttribute('aria-labelledby') && 
        element.tagName !== 'INPUT' && 
        element.tagName !== 'TEXTAREA') {
      
      // 尝试从内容中获取标签
      let label = '';
      
      if (element.querySelector('i.fas')) {
        // 尝试从Font Awesome图标类名获取标签
        const iconElement = element.querySelector('i.fas');
        const iconClass = Array.from(iconElement.classList)
          .find(cls => cls.startsWith('fa-'));
        
        if (iconClass) {
          label = iconClass.replace('fa-', '').replace(/-/g, ' ');
        }
      } else if (element.textContent.trim()) {
        // 从文本内容获取标签
        label = element.textContent.trim();
      } else if (element.title) {
        // 从title属性获取
        label = element.title;
      } else if (element.classList.contains('play-button')) {
        label = '播放/暂停';
      } else if (element.classList.contains('vinyl-record')) {
        label = '黑胶唱片';
      }
      
      if (label) {
        element.setAttribute('aria-label', label);
      }
    }
    
    // 为可点击元素添加键盘事件
    if (element.getAttribute('role') === 'button' || 
        element.classList.contains('control-button') || 
        element.classList.contains('action-button') || 
        element.classList.contains('quality-option')) {
      
      if (!element.hasAttribute('data-keyboard-enhanced')) {
        element.addEventListener('keydown', function(e) {
          // 空格键或回车键激活按钮
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            element.click();
            
            // 添加可视反馈
            element.classList.add('keyboard-active');
            setTimeout(() => {
              element.classList.remove('keyboard-active');
            }, 200);
          }
        });
        
        // 添加键盘焦点样式
        enhanceElementWithFocusStyles(element);
        
        element.setAttribute('data-keyboard-enhanced', 'true');
      }
    }
  }
  
  // 增强元素的焦点样式
  function enhanceElementWithFocusStyles(element) {
    if (!element) return;
    
    // 创建全局样式（如果不存在）
    if (!document.querySelector('#keyboard-focus-styles')) {
      const style = document.createElement('style');
      style.id = 'keyboard-focus-styles';
      style.textContent = `
        .keyboard-focus-visible:focus {
          outline: 2px solid #D4AF37 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.7) !important;
        }
        
        .keyboard-focus-visible:focus:not(:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .keyboard-focus-visible:focus-visible {
          outline: 2px solid #D4AF37 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.7) !important;
        }
        
        .keyboard-active {
          transform: scale(0.95) !important;
          transition: transform 0.2s !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 添加焦点可见类
    element.classList.add('keyboard-focus-visible');
  }
  
  // 添加跳转链接
  function addSkipLinks() {
    // 检查是否已存在跳转链接
    if (document.querySelector('.skip-link')) return;
    
    // 创建跳转到主内容的链接
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = '跳转到主要内容';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #8B0000;
      color: white;
      padding: 8px;
      z-index: 9999;
      transition: top 0.3s;
    `;
    
    // 焦点时显示链接
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    // 确保有主内容标记
    let mainContent = document.querySelector('.vinyl-player, .main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
    
    // 如果找不到主内容，创建一个锚点
    if (!document.getElementById('main-content')) {
      const mainAnchor = document.createElement('div');
      mainAnchor.id = 'main-content';
      mainAnchor.style.position = 'absolute';
      mainAnchor.setAttribute('tabindex', '-1');
      
      const mainElement = document.querySelector('main') || 
                         document.querySelector('.player-container') || 
                         document.body.children[1];
      
      if (mainElement) {
        mainElement.parentNode.insertBefore(mainAnchor, mainElement);
      } else {
        document.body.appendChild(mainAnchor);
      }
    }
    
    // 添加到文档
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // 为播放页面增强键盘控制
  function enhancePlayerKeyboardControls() {
    // 检查是否为播放页面
    if (!document.querySelector('.vinyl-record')) return;
    
    // 键盘快捷键帮助提示
    const createKeyboardHelpTooltip = () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'keyboard-help-tooltip';
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        transition: opacity 0.3s;
        opacity: 0;
        pointer-events: none;
      `;
      
      tooltip.innerHTML = `
        <div style="text-align: center; margin-bottom: 5px;">键盘快捷键</div>
        <div>空格: 播放/暂停</div>
        <div>← →: 上一曲/下一曲</div>
        <div>↑ ↓: 歌词/详情</div>
        <div>M: 静音</div>
      `;
      
      document.body.appendChild(tooltip);
      return tooltip;
    };
    
    // 创建提示
    const helpTooltip = createKeyboardHelpTooltip();
    
    // 添加键盘事件监听
    document.addEventListener('keydown', function(e) {
      // 避免在输入框中触发
      if (e.target.tagName.match(/^(INPUT|TEXTAREA)$/i)) return;
      
      // 针对播放器的键盘控制
      switch (e.key) {
        case ' ': // 空格：播放/暂停
          e.preventDefault();
          const playButton = document.querySelector('.play-button');
          if (playButton) playButton.click();
          break;
          
        case 'ArrowLeft': // 左箭头：上一曲
          e.preventDefault();
          const prevButton = document.getElementById('prevButton');
          if (prevButton) prevButton.click();
          break;
          
        case 'ArrowRight': // 右箭头：下一曲
          e.preventDefault();
          const nextButton = document.getElementById('nextButton');
          if (nextButton) nextButton.click();
          break;
          
        case 'ArrowUp': // 上箭头：查看歌词
          e.preventDefault();
          const sections = ['player', 'lyrics', 'info'];
          let currentIndex = 0;
          
          // 查找当前激活的部分
          const currentSection = document.querySelector('.lyrics-panel[style*="opacity: 1"], .info-panel[style*="opacity: 1"]');
          if (currentSection) {
            if (currentSection.classList.contains('lyrics-panel')) {
              currentIndex = 1;
            } else {
              currentIndex = 2;
            }
          }
          
          // 切换到上一个部分
          const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
          if (window.showSection) window.showSection(sections[prevIndex]);
          break;
          
        case 'ArrowDown': // 下箭头：查看详情
          e.preventDefault();
          const sectionsDown = ['player', 'lyrics', 'info'];
          let currentIndexDown = 0;
          
          // 查找当前激活的部分
          const currentSectionDown = document.querySelector('.lyrics-panel[style*="opacity: 1"], .info-panel[style*="opacity: 1"]');
          if (currentSectionDown) {
            if (currentSectionDown.classList.contains('lyrics-panel')) {
              currentIndexDown = 1;
            } else {
              currentIndexDown = 2;
            }
          }
          
          // 切换到下一个部分
          const nextIndex = (currentIndexDown + 1) % sectionsDown.length;
          if (window.showSection) window.showSection(sectionsDown[nextIndex]);
          break;
          
        case 'm': // M键：静音
        case 'M':
          // 实际产品中可以实现静音功能
          break;
          
        case '?': // 问号键：显示帮助
          e.preventDefault();
          helpTooltip.style.opacity = '1';
          setTimeout(() => {
            helpTooltip.style.opacity = '0';
          }, 5000);
          break;
      }
    });
    
    // 显示初始帮助提示
    setTimeout(() => {
      helpTooltip.style.opacity = '1';
      setTimeout(() => {
        helpTooltip.style.opacity = '0';
      }, 5000);
    }, 2000);
    
    // 导出showSection函数以供外部使用
    if (window.showSection) {
      const originalShowSection = window.showSection;
      window.showSection = function(section) {
        originalShowSection(section);
        
        // 更新ARIA状态
        document.querySelectorAll('.lyrics-panel, .info-panel').forEach(panel => {
          panel.setAttribute('aria-hidden', panel.style.opacity !== '1');
        });
      };
    }
  }
  
  // ARIA增强
  function enhanceWithARIA() {
    // 为主要区域添加ARIA角色
    const mainContainer = document.querySelector('.player-container, .main-container');
    if (mainContainer && !mainContainer.getAttribute('role')) {
      mainContainer.setAttribute('role', 'main');
    }
    
    // 为导航条添加角色
    const navBar = document.querySelector('.navigation-bar, .navbar');
    if (navBar && !navBar.getAttribute('role')) {
      navBar.setAttribute('role', 'navigation');
    }
    
    // 状态栏
    const statusBar = document.querySelector('#status-bar, .status-bar');
    if (statusBar) {
      statusBar.setAttribute('role', 'status');
      statusBar.setAttribute('aria-live', 'polite');
    }
    
    // 进度条
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      const progressCurrent = progressBar.querySelector('.progress-current');
      const timeInfo = document.querySelector('.time-info');
      
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      
      if (progressCurrent) {
        const width = progressCurrent.style.width;
        const value = parseInt(width) || 0;
        progressBar.setAttribute('aria-valuenow', value);
      }
      
      if (timeInfo) {
        progressBar.setAttribute('aria-labelledby', 'currentTimeEl');
      }
    }
    
    // 为唱片区域添加标签
    const vinylRecord = document.querySelector('.vinyl-record');
    if (vinylRecord) {
      vinylRecord.setAttribute('role', 'img');
      vinylRecord.setAttribute('aria-label', '正在播放的黑胶唱片');
    }
    
    // 为播放控制按钮添加可访问性描述
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
      const icon = button.querySelector('i.fas');
      if (icon) {
        let label = '';
        
        if (icon.classList.contains('fa-backward-step')) {
          label = '上一曲';
        } else if (icon.classList.contains('fa-forward-step')) {
          label = '下一曲';
        } else if (icon.classList.contains('fa-backward')) {
          label = '快退';
        } else if (icon.classList.contains('fa-forward')) {
          label = '快进';
        } else if (icon.classList.contains('fa-play') || icon.classList.contains('fa-pause')) {
          label = '播放/暂停';
        }
        
        if (label) {
          button.setAttribute('aria-label', label);
        }
      }
    });
  }
  
  // 为所有相关元素添加可访问性支持
  function enhanceAllElements() {
    // 添加跳转链接
    addSkipLinks();
    
    // 增强ARIA支持
    enhanceWithARIA();
    
    // 查找所有需要添加键盘支持的元素
    document.querySelectorAll(
      '.control-button, .action-button, .quality-option, .play-button, .progress-bar, .vinyl-record'
    ).forEach(makeElementKeyboardAccessible);
    
    // 增强播放器键盘控制
    enhancePlayerKeyboardControls();
    
    console.log('键盘可访问性增强已完成');
  }
  
  // DOM加载完成后应用增强
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAllElements);
  } else {
    enhanceAllElements();
  }
  
  // 导出API
  window.yaYunKeyboardAccessibility = {
    makeAccessible: makeElementKeyboardAccessible,
    enhanceWithARIA: enhanceWithARIA,
    enhanceAll: enhanceAllElements
  };
})(); 