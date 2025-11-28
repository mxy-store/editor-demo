<template>
  <div class="swiper-container-page">

    <div class="content-wrapper">

      <!-- 单条文本持续滚动 -->
      <div class="demo-section">
        <h3>单条文本持续滚动（循环播放）</h3>
        <div class="swiper-wrapper-container continuous">
          <div class="swiper continuous-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <span class="text-item long-text">
                  🌟 这是一条很长的文本内容，用于演示单条文本的持续滚动效果。
                  Swiper.js 可以实现流畅的横向滚动，支持循环播放、自动播放、暂停等功能。
                  无论文本多长，都能实现完美的滚动效果。适用于新闻滚动、通知公告、广告轮播等多种场景。
                  📱 支持触摸滑动、鼠标拖拽、键盘控制等多种交互方式。
                  💻 兼容 PC 端、移动端、平板等各种设备。
                  ⚙️ 提供丰富的配置选项和 API 接口，可灵活定制。
                </span>
              </div>
              <div class="swiper-slide">
                <span class="text-item long-text">
                  🌟 这是一条很长的文本内容，用于演示单条文本的持续滚动效果。
                  Swiper.js 可以实现流畅的横向滚动，支持循环播放、自动播放、暂停等功能。
                  无论文本多长，都能实现完美的滚动效果。适用于新闻滚动、通知公告、广告轮播等多种场景。
                  📱 支持触摸滑动、鼠标拖拽、键盘控制等多种交互方式。
                  💻 兼容 PC 端、移动端、平板等各种设备。
                  ⚙️ 提供丰富的配置选项和 API 接口，可灵活定制。
                </span>
              </div>
              <div class="swiper-slide">
                <span class="text-item long-text">
                  🌟 这是一条很长的文本内容，用于演示单条文本的持续滚动效果。
                  Swiper.js 可以实现流畅的横向滚动，支持循环播放、自动播放、暂停等功能。
                  无论文本多长，都能实现完美的滚动效果。适用于新闻滚动、通知公告、广告轮播等多种场景。
                  📱 支持触摸滑动、鼠标拖拽、键盘控制等多种交互方式。
                  💻 兼容 PC 端、移动端、平板等各种设备。
                  ⚙️ 提供丰富的配置选项和 API 接口，可灵活定制。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
onMounted(() => {

  // 单条文本持续滚动
  new Swiper('.continuous-swiper', {
    modules: [Autoplay],
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 15000,
    slidesPerView: 'auto',
    spaceBetween: 0,
    freeMode: true,
  })
})
</script>

<style scoped>
.swiper-container-page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h2 {
  font-size: 32px;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.demo-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.swiper-wrapper-container {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px 0;
  position: relative;
}

.swiper-wrapper-container.fast {
  background: linear-gradient(90deg, #ffe5e5 0%, #fff5e5 100%);
}

.swiper-wrapper-container.continuous {
  background: linear-gradient(90deg, #e5f5ff 0%, #f0e5ff 100%);
  padding: 20px 0;
}

.swiper-wrapper-container.news {
  background: #fff;
  border: 2px solid #e0e0e0;
  padding: 12px 0 12px 120px;
}

.swiper-wrapper-container.controlled {
  background: linear-gradient(90deg, #e5ffe5 0%, #e5f5ff 100%);
}

.news-label {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  z-index: 10;
}

.swiper {
  width: 100%;
  height: auto;
}

.swiper-slide {
  width: auto !important;
  height: auto;
}

.text-item {
  display: inline-block;
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.text-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.text-item.long-text {
  padding: 12px 24px;
  line-height: 1.6;
  max-width: none;
}

.news-swiper .text-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  background: transparent;
  box-shadow: none;
}

.news-swiper .icon {
  font-size: 20px;
  flex-shrink: 0;
}

.news-swiper .news-title {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.news-swiper .news-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.demo-section {
  animation: slideIn 0.5s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .swiper-container-page {
    padding: 20px 10px;
  }

  .header h2 {
    font-size: 24px;
  }

  .demo-section {
    padding: 16px;
  }

  .text-item {
    font-size: 14px;
    padding: 6px 12px;
  }

  .swiper-wrapper-container.news {
    padding-left: 80px;
  }

  .news-label {
    width: 70px;
    font-size: 14px;
  }
}

/* Swiper 自定义样式 */
:deep(.swiper-wrapper) {
  transition-timing-function: linear !important;
}
</style>
