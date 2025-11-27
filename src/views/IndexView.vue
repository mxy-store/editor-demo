<template>
  <div class="index-container">
    <div class="header">
      <h1>📚 项目导航</h1>
      <p class="subtitle">Editor Demo - 富文本编辑器集合</p>
    </div>

    <div class="navigation-grid">
      <!-- 公式组件对比表格 -->
      <div class="comparison-section">
        <h2 class="section-title">
          <span class="icon">📊</span>
          数学公式组件深度对比
        </h2>

        <div class="comparison-card">
          <div class="comparison-intro">
            <p>本项目集成了6种主流的数学公式编辑方案，每种方案都有其独特的优势和适用场景。以下是详细的对比分析：</p>
          </div>

          <!-- 对比表格 -->
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th class="feature-col">特性/方案</th>
                  <th>WangEditor + KaTeX</th>
                  <th>WangEditor + MathJax</th>
                  <th>WangEditor + MathLive</th>
                  <th>WangEditor + MathQuill</th>
                  <th>vue-mathjax-beautiful</th>
                  <th>UEditor + KityFormula</th>
                </tr>
              </thead>
              <tbody>
                <!-- 渲染性能 -->
                <tr>
                  <td class="feature-name">⚡ 渲染性能</td>
                  <td><span class="rating excellent">★★★★★</span><br>极快，适合大量公式</td>
                  <td><span class="rating good">★★★☆☆</span><br>较慢，首次加载重</td>
                  <td><span class="rating excellent">★★★★★</span><br>流畅，实时渲染</td>
                  <td><span class="rating excellent">★★★★☆</span><br>流畅，jQuery依赖</td>
                  <td><span class="rating good">★★★☆☆</span><br>中等，依赖KaTeX</td>
                  <td><span class="rating good">★★★☆☆</span><br>中等，SVG渲染</td>
                </tr>

                <!-- 编辑体验 -->
                <tr>
                  <td class="feature-name">✏️ 编辑体验</td>
                  <td><span class="rating good">★★★☆☆</span><br>LaTeX代码输入</td>
                  <td><span class="rating good">★★★☆☆</span><br>LaTeX代码输入</td>
                  <td><span class="rating excellent">★★★★★</span><br>可视化编辑，最佳</td>
                  <td><span class="rating excellent">★★★★★</span><br>可视化编辑，直观</td>
                  <td><span class="rating excellent">★★★★☆</span><br>符号面板选择</td>
                  <td><span class="rating good">★★★☆☆</span><br>可视化拖拽</td>
                </tr>

                <!-- 功能完整度 -->
                <tr>
                  <td class="feature-name">🎯 功能完整度</td>
                  <td><span class="rating excellent">★★★★★</span><br>LaTeX完整支持</td>
                  <td><span class="rating excellent">★★★★★</span><br>最全面，化学式</td>
                  <td><span class="rating excellent">★★★★★</span><br>现代化，功能丰富</td>
                  <td><span class="rating excellent">★★★★☆</span><br>基础功能完善</td>
                  <td><span class="rating good">★★★☆☆</span><br>常用公式充足</td>
                  <td><span class="rating good">★★★★☆</span><br>基础+扩展公式</td>
                </tr>

                <!-- 学习成本 -->
                <tr>
                  <td class="feature-name">📚 学习成本</td>
                  <td><span class="rating fair">★★☆☆☆</span><br>需学习LaTeX语法</td>
                  <td><span class="rating fair">★★☆☆☆</span><br>需学习LaTeX语法</td>
                  <td><span class="rating excellent">★★★★★</span><br>零门槛，所见即所得</td>
                  <td><span class="rating excellent">★★★★★</span><br>零门槛，可视化</td>
                  <td><span class="rating excellent">★★★★☆</span><br>点选输入，易上手</td>
                  <td><span class="rating good">★★★☆☆</span><br>拖拽操作，较简单</td>
                </tr>

                <!-- 移动端支持 -->
                <tr>
                  <td class="feature-name">📱 移动端支持</td>
                  <td><span class="rating excellent">★★★★★</span><br>完美适配</td>
                  <td><span class="rating excellent">★★★★☆</span><br>良好支持</td>
                  <td><span class="rating excellent">★★★★★</span><br>虚拟键盘优化</td>
                  <td><span class="rating good">★★★☆☆</span><br>基本支持</td>
                  <td><span class="rating good">★★★☆☆</span><br>基本支持</td>
                  <td><span class="rating fair">★★☆☆☆</span><br>较弱，桌面优先</td>
                </tr>

                <!-- 体积大小 -->
                <tr>
                  <td class="feature-name">📦 体积大小</td>
                  <td><span class="rating excellent">★★★★★</span><br>~100KB (gzip)</td>
                  <td><span class="rating fair">★★☆☆☆</span><br>~500KB+ (重)</td>
                  <td><span class="rating good">★★★☆☆</span><br>~300KB</td>
                  <td><span class="rating good">★★★☆☆</span><br>~150KB + jQuery</td>
                  <td><span class="rating good">★★★☆☆</span><br>依赖KaTeX</td>
                  <td><span class="rating good">★★★☆☆</span><br>~200KB</td>
                </tr>

                <!-- 维护状态 -->
                <tr>
                  <td class="feature-name">🔧 维护状态</td>
                  <td><span class="rating excellent">★★★★★</span><br>活跃维护中</td>
                  <td><span class="rating excellent">★★★★★</span><br>活跃维护中</td>
                  <td><span class="rating excellent">★★★★★</span><br>活跃，商业支持</td>
                  <td><span class="rating good">★★★☆☆</span><br>社区维护</td>
                  <td><span class="rating good">★★★☆☆</span><br>社区项目</td>
                  <td><span class="rating fair">★★☆☆☆</span><br>维护较少</td>
                </tr>

                <!-- 浏览器兼容性 -->
                <tr>
                  <td class="feature-name">🌐 浏览器兼容</td>
                  <td><span class="rating excellent">★★★★★</span><br>全面兼容</td>
                  <td><span class="rating excellent">★★★★★</span><br>全面兼容</td>
                  <td><span class="rating excellent">★★★★★</span><br>现代浏览器</td>
                  <td><span class="rating excellent">★★★★☆</span><br>IE9+</td>
                  <td><span class="rating excellent">★★★★☆</span><br>现代浏览器</td>
                  <td><span class="rating good">★★★☆☆</span><br>IE10+</td>
                </tr>

                <!-- 特色功能 -->
                <tr>
                  <td class="feature-name">✨ 特色功能</td>
                  <td>快速渲染<br>化学式支持<br>自动编号</td>
                  <td>化学方程式<br>物理单位<br>多行公式</td>
                  <td>手写识别<br>语音输入<br>虚拟键盘</td>
                  <td>实时预览<br>光标操作<br>选择编辑</td>
                  <td>可视化面板<br>分类清晰<br>模板丰富</td>
                  <td>图形化编辑<br>拖拽组合<br>本地化</td>
                </tr>

                <!-- 适用场景 -->
                <tr>
                  <td class="feature-name">🎓 适用场景</td>
                  <td>高性能需求<br>简单公式<br>数学文档</td>
                  <td>化学论文<br>复杂排版<br>学术文档</td>
                  <td>教育平台<br>在线考试<br>交互学习</td>
                  <td>博客编辑<br>笔记应用<br>轻量场景</td>
                  <td>新手友好<br>快速输入<br>常规公式</td>
                  <td>已有项目<br>百度生态<br>中文优先</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 详细分析 -->
          <div class="detailed-analysis">
            <h3>💡 详细分析与推荐</h3>

            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">🏆</span>
                  <h4>最佳综合选择</h4>
                </div>
                <p><strong>WangEditor + KaTeX</strong></p>
                <ul>
                  <li>性能出色，渲染速度快</li>
                  <li>体积小，加载迅速</li>
                  <li>LaTeX标准支持</li>
                  <li>适合对性能有要求的项目</li>
                </ul>
              </div>

              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">🎯</span>
                  <h4>最佳用户体验</h4>
                </div>
                <p><strong>WangEditor + MathLive</strong></p>
                <ul>
                  <li>所见即所得编辑体验</li>
                  <li>虚拟键盘，移动端友好</li>
                  <li>手写识别，创新交互</li>
                  <li>适合教育和培训场景</li>
                </ul>
              </div>

              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">🧪</span>
                  <h4>最佳化学支持</h4>
                </div>
                <p><strong>WangEditor + MathJax</strong></p>
                <ul>
                  <li>mhchem化学式扩展</li>
                  <li>复杂化学方程式</li>
                  <li>物理单位完美支持</li>
                  <li>适合理工科学术写作</li>
                </ul>
              </div>

              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">🚀</span>
                  <h4>快速上手</h4>
                </div>
                <p><strong>vue-mathjax-beautiful</strong></p>
                <ul>
                  <li>可视化符号面板</li>
                  <li>无需学习LaTeX</li>
                  <li>分类清晰，查找方便</li>
                  <li>适合新手和非专业用户</li>
                </ul>
              </div>

              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">⚡</span>
                  <h4>轻量快速</h4>
                </div>
                <p><strong>WangEditor + MathQuill</strong></p>
                <ul>
                  <li>体积相对较小</li>
                  <li>可视化编辑体验</li>
                  <li>实时预览反馈</li>
                  <li>适合博客和笔记应用</li>
                </ul>
              </div>

              <div class="analysis-card">
                <div class="analysis-header">
                  <span class="analysis-icon">🏢</span>
                  <h4>企业级方案</h4>
                </div>
                <p><strong>UEditor + KityFormula</strong></p>
                <ul>
                  <li>百度出品，稳定可靠</li>
                  <li>中文文档完善</li>
                  <li>功能全面，工具栏丰富</li>
                  <li>适合已有UEditor项目</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 技术栈对比 -->
          <!-- <div class="tech-comparison">
            <h3>🔧 技术栈依赖对比</h3>
            <div class="tech-grid">
              <div class="tech-item">
                <h4>KaTeX</h4>
                <div class="tech-badge modern">现代</div>
                <p>纯JavaScript，无依赖，体积小</p>
              </div>
              <div class="tech-item">
                <h4>MathJax</h4>
                <div class="tech-badge mature">成熟</div>
                <p>功能最全，体积较大，配置灵活</p>
              </div>
              <div class="tech-item">
                <h4>MathLive</h4>
                <div class="tech-badge innovative">创新</div>
                <p>Web Components，现代架构</p>
              </div>
              <div class="tech-item">
                <h4>MathQuill</h4>
                <div class="tech-badge classic">经典</div>
                <p>依赖jQuery，社区活跃</p>
              </div>
              <div class="tech-item">
                <h4>vue-mathjax-beautiful</h4>
                <div class="tech-badge vue">Vue生态</div>
                <p>Vue组件，集成便捷</p>
              </div>
              <div class="tech-item">
                <h4>KityFormula</h4>
                <div class="tech-badge chinese">国产</div>
                <p>百度出品，中文友好</p>
              </div>
            </div>
          </div> -->

          <!-- 性能数据对比 -->
          <!-- <div class="performance-comparison">
            <h3>📊 性能数据参考</h3>
            <div class="performance-grid">
              <div class="performance-item">
                <h4>首次加载时间</h4>
                <div class="bar-chart">
                  <div class="bar" style="width: 20%"><span>KaTeX</span><em>~50ms</em></div>
                  <div class="bar" style="width: 40%"><span>MathQuill</span><em>~150ms</em></div>
                  <div class="bar" style="width: 60%"><span>MathLive</span><em>~200ms</em></div>
                  <div class="bar" style="width: 70%"><span>vue-mathjax</span><em>~250ms</em></div>
                  <div class="bar" style="width: 80%"><span>KityFormula</span><em>~300ms</em></div>
                  <div class="bar" style="width: 100%"><span>MathJax</span><em>~500ms</em></div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <!-- 编辑器页面 -->
      <div class="nav-section">
        <h2 class="section-title">
          <span class="icon">✏️</span>
          富文本编辑器
        </h2>
        <div class="nav-cards">
          <div v-for="route in editorRoutes" :key="route.path" class="nav-card" @click="navigateTo(route.path)">
            <div class="card-icon">{{ route.icon }}</div>
            <div class="card-content">
              <h3>{{ route.title }}</h3>
              <p>{{ route.description }}</p>
              <div class="card-tags">
                <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 其他功能页面 -->
      <!-- <div class="nav-section">
        <h2 class="section-title">
          <span class="icon">🛠️</span>
          其他功能
        </h2>
        <div class="nav-cards">
          <div v-for="route in otherRoutes" :key="route.path" class="nav-card" @click="navigateTo(route.path)">
            <div class="card-icon">{{ route.icon }}</div>
            <div class="card-content">
              <h3>{{ route.title }}</h3>
              <p>{{ route.description }}</p>
              <div class="card-tags">
                <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="footer">
      <p>共 {{ totalRoutes }} 个页面</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface RouteInfo {
  path: string
  title: string
  description: string
  icon: string
  tags: string[]
}

const router = useRouter()

// 编辑器相关页面
const editorRoutes: RouteInfo[] = [
  {
    path: '/ketex',
    title: 'WangEditor + KaTeX',
    description: '轻量高性能的LaTeX渲染引擎，毫秒级渲染速度，完美支持化学式和数学公式，适合对性能有严格要求的场景',
    icon: '⚡',
    tags: ['高性能', 'LaTeX', '轻量级', '化学式']
  },
  {
    path: '/mathjax',
    title: 'WangEditor + MathJax',
    description: '功能最全面的数学公式渲染库，支持mhchem化学方程式、物理单位、多行公式等复杂排版，学术文档首选',
    icon: '🧪',
    tags: ['全面', '化学方程', '学术级', '物理公式']
  },
  {
    path: '/mathlive',
    title: 'WangEditor + MathLive',
    description: '革命性的可视化数学编辑器，支持手写识别、语音输入、虚拟键盘，零门槛所见即所得，教育场景最佳选择',
    icon: '🎯',
    tags: ['可视化', '手写识别', '零门槛', '教育友好']
  },
  {
    path: '/mathquill',
    title: 'WangEditor + MathQuill',
    description: '经典的交互式数学公式编辑器，实时预览、光标精准操作，轻量且稳定，适合博客、笔记等轻量应用',
    icon: '✍️',
    tags: ['交互式', '实时预览', '稳定', '博客首选']
  },
  {
    path: '/beautiful',
    title: 'WangEditor + vue-mathjax-beautiful',
    description: '创新的可视化符号面板，分类清晰、点选输入，无需记忆LaTeX语法，新手友好的快速公式输入方案',
    icon: '🎨',
    tags: ['符号面板', '新手友好', 'Vue组件', '快速输入']
  },
  {
    path: '/ueditor',
    title: 'UEditor + KityFormula',
    description: '百度出品的企业级编辑器方案，功能全面、中文文档完善、工具栏丰富，适合已有UEditor生态的项目迁移',
    icon: '🏢',
    tags: ['企业级', '百度出品', '中文友好', '生态完善']
  },
]

// // 其他功能页面
// const otherRoutes: RouteInfo[] = [
//   {
//     path: '/home',
//     title: 'antvX6组件-图谱',
//     description: '',
//     icon: '🏠',
//     tags: ['antvX6', '图谱','demo']
//   },
//   {
//     path: '/canvas',
//     title: '模拟业务需求',
//     description: '',
//     icon: '🎯',
//     tags: ['Canvas', '图形']
//   }
// ]

// 总页面数
//const totalRoutes = computed(() => editorRoutes.length + otherRoutes.length)
const totalRoutes = computed(() => editorRoutes.length)

// 导航跳转
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease-out;
}

.header h1 {
  font-size: 48px;
  margin: 0 0 16px 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 20px;
  opacity: 0.95;
  margin: 0;
  font-weight: 300;
}

.navigation-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.nav-section {
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  color: white;
  font-size: 28px;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.section-title .icon {
  font-size: 32px;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.nav-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-card:hover::before {
  transform: scaleX(1);
}

.nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
}

.card-icon {
  font-size: 40px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.nav-card:hover .card-icon {
  transform: scale(1.2) rotate(5deg);
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.card-content p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.card-arrow {
  font-size: 24px;
  color: #667eea;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  align-self: center;
}

.nav-card:hover .card-arrow {
  transform: translateX(8px);
}

.footer {
  text-align: center;
  margin-top: 48px;
  color: white;
  font-size: 16px;
  opacity: 0.9;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .nav-cards {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 36px;
  }

  .subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .comparison-table-wrapper {
    overflow-x: auto;
  }

  .analysis-grid,
  .tech-grid {
    grid-template-columns: 1fr;
  }
}

/* 对比部分样式 */
.comparison-section {
  animation: fadeInUp 0.6s ease-out;
}

.comparison-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.comparison-intro {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%);
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.comparison-intro p {
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1.8;
}

.comparison-table-wrapper {
  overflow-x: auto;
  margin: 24px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1200px;
}

.comparison-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.comparison-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.comparison-table th.feature-col {
  position: sticky;
  left: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 2;
  min-width: 140px;
}

.comparison-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.comparison-table tbody tr:hover {
  background-color: #f8f9fa;
}

.comparison-table td {
  padding: 16px 12px;
  color: #555;
  line-height: 1.6;
  vertical-align: top;
}

.comparison-table td.feature-name {
  font-weight: 600;
  color: #333;
  background: #f8f9fa;
  position: sticky;
  left: 0;
  z-index: 1;
  white-space: nowrap;
}

.rating {
  display: inline-block;
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: bold;
}

.rating.excellent {
  color: #52c41a;
}

.rating.good {
  color: #1890ff;
}

.rating.fair {
  color: #faad14;
}

/* 详细分析样式 */
.detailed-analysis {
  margin-top: 40px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.detailed-analysis h3 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.analysis-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.2);
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.analysis-icon {
  font-size: 32px;
}

.analysis-card h4 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.analysis-card p {
  margin: 8px 0;
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
}

.analysis-card ul {
  margin: 12px 0 0 0;
  padding-left: 20px;
  color: #666;
}

.analysis-card li {
  margin: 6px 0;
  line-height: 1.6;
}

/* 技术栈对比 */
.tech-comparison {
  margin-top: 40px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 12px;
}

.tech-comparison h3 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tech-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-4px);
}

.tech-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.tech-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tech-badge.modern {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.tech-badge.mature {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  color: white;
}

.tech-badge.innovative {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: white;
}

.tech-badge.classic {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
}

.tech-badge.vue {
  background: linear-gradient(135deg, #42b883, #35495e);
  color: white;
}

.tech-badge.chinese {
  background: linear-gradient(135deg, #fa541c, #ff7a45);
  color: white;
}

.tech-item p {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 13px;
  line-height: 1.4;
}

/* 性能对比 */
.performance-comparison {
  margin-top: 40px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
}

.performance-comparison h3 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.performance-grid {
  max-width: 800px;
  margin: 0 auto;
}

.performance-item h4 {
  margin: 0 0 16px 0;
  color: #555;
  font-size: 16px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  position: relative;
  height: 40px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.bar span {
  color: white;
  font-weight: 600;
  font-size: 14px;
  position: absolute;
  left: 12px;
}

.bar em {
  color: white;
  font-style: normal;
  font-size: 12px;
  position: absolute;
  right: 12px;
  opacity: 0.9;
}
</style>
