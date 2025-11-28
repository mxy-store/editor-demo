<template>
  <div class="ueditor-mathlive-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>正在初始化 UEditor + MathLive 编辑器...</p>
      </div>
    </div>

    <!-- 主内容 -->
    <div v-else class="main-content">
      <div class="header">
        <h2>富文本编辑器（UEditor + MathLive）</h2>
        <div class="actions">
          <el-button type="success" @click="openMathLiveDialog">
            <span style="font-size: 16px; font-weight: bold;">∫</span> 打开 MathLive 公式编辑器
          </el-button>
          <el-button type="primary" @click="getContent">获取内容</el-button>
          <el-button @click="setContent">设置内容</el-button>
          <el-button @click="clearContent">清空</el-button>
          <el-button @click="getHtml">获取 HTML</el-button>
        </div>
      </div>

      <div class="editor-wrapper">
        <div id="ueditor-mathlive-container" ref="editorContainer"></div>
      </div>

      <!-- MathLive 公式编辑器对话框 -->
      <el-dialog v-model="mathLiveDialogVisible" title="MathLive 公式编辑器" width="800px" :close-on-click-modal="false">
        <div class="mathlive-dialog">
          <div class="mathlive-editor-wrapper">
            <div class="mathlive-label">输入 LaTeX 公式：</div>
            <math-field ref="mathFieldRef" class="mathlive-input" v-model="currentFormula" @input="handleMathLiveInput"
              @change="handleMathLiveChange" virtual-keyboard-mode="off" smart-fence="on" inline-shortcut-timeout="0" />
          </div>
          <div class="formula-preview">
            <div class="preview-label">实时预览：</div>
            <div class="preview-content" v-html="formulaPreview"></div>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="mathLiveDialogVisible = false">取消</el-button>
            <el-button @click="clearFormula" type="warning">清空</el-button>
            <el-button @click="insertMathLiveFormula" type="primary">插入公式</el-button>
          </div>
        </template>
      </el-dialog>

      <div class="preview">
        <h3>内容预览：</h3>
        <el-card>
          <div v-html="previewContent"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'mathlive'

// 声明 UE 全局变量
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UE: any
    UEDITOR_HOME_URL: string
  }
}

// 加载状态
const isLoading = ref(true)

const editorContainer = ref<HTMLElement>()
const mathFieldRef = ref<HTMLElement>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editorInstance: any = null
const previewContent = ref('')
const mathLiveDialogVisible = ref(false)
const currentFormula = ref('')
const formulaPreview = ref('')

// 处理 MathLive 输入
const handleMathLiveInput = (event: Event) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target = event.target as any
  const latex = target.value || ''
  currentFormula.value = latex
  updateFormulaPreview(latex)
}

// 处理 MathLive 变化
const handleMathLiveChange = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const latex = (mathFieldRef.value as any)?.value || ''
  currentFormula.value = latex
  updateFormulaPreview(latex)
}

// 更新公式预览
const updateFormulaPreview = (latex: string) => {
  if (latex.trim()) {
    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true
      })
      formulaPreview.value = html
    } catch (error) {
      console.error('公式渲染失败:', error)
      formulaPreview.value = '<span style="color: red;">公式格式错误</span>'
    }
  } else {
    formulaPreview.value = '<span style="color: #999;">请输入公式...</span>'
  }
}

// 打开 MathLive 对话框
const openMathLiveDialog = () => {
  currentFormula.value = ''
  formulaPreview.value = '<span style="color: #999;">请输入公式...</span>'
  mathLiveDialogVisible.value = true

  nextTick(() => {
    if (mathFieldRef.value) {
      mathFieldRef.value.focus()
    }
  })
}

// 清空公式
const clearFormula = () => {
  currentFormula.value = ''
  formulaPreview.value = '<span style="color: #999;">请输入公式...</span>'
  if (mathFieldRef.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mathFieldRef.value as any).value = ''
  }
}

// 插入 MathLive 公式
const insertMathLiveFormula = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  const latex = currentFormula.value.trim()
  if (!latex) {
    ElMessage.warning('请输入公式内容')
    return
  }

  try {
    // 渲染公式为HTML
    const formulaHtml = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true
    })

    // 创建包含公式信息的HTML
    const formulaElement = `<span class="math-formula" data-latex="${latex}">${formulaHtml}</span>`

    // 插入到编辑器
    editorInstance.execCommand('insertHtml', formulaElement)

    // 关闭对话框
    mathLiveDialogVisible.value = false

    ElMessage.success('公式已插入')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入公式失败，请检查公式格式')
  }
}

// 初始化 UEditor
const initUEditor = () => {
  // 设置 UEditor 资源路径
  window.UEDITOR_HOME_URL = '/editor-demo/UEditor/'

  // 加载 UEditor 配置文件
  loadScript('/editor-demo/UEditor/ueditor.config.js', () => {
    // 加载 UEditor 主文件
    loadScript('/editor-demo/UEditor/ueditor.all.min.js', () => {
      // 创建编辑器实例
      editorInstance = window.UE.getEditor('ueditor-mathlive-container', {
        // 编辑器宽高
        initialFrameWidth: '100%',
        initialFrameHeight: 500,
        // 工具栏配置
        toolbars: [
          [
            'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
          ]
        ],
        // 自动高度
        autoHeightEnabled: false,
        // 关闭字数统计
        wordCount: true,
        // 最大字数
        maximumWords: 100000,
        // 关闭元素路径
        elementPathEnabled: true,
        // 默认语言
        lang: 'zh-cn',
        // 主题
        theme: 'default'
      })

      // 编辑器准备就绪
      editorInstance.ready(() => {
        ElMessage.success('UEditor + MathLive 编辑器加载完成')
        console.log('UEditor 已准备就绪，MathLive 已配置')
        isLoading.value = false  // 编辑器创建完成后关闭加载状态
      })
    })
  })
}

// 动态加载脚本
const loadScript = (src: string, callback: () => void) => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = src
  script.onload = callback
  script.onerror = () => {
    console.error('脚本加载失败:', src)
  }
  document.head.appendChild(script)
}

// 获取内容
const getContent = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  const content = editorInstance.getContent()
  console.log('编辑器内容：', content)
  previewContent.value = content
  ElMessage.success('内容已获取，请查看控制台和预览区域')
}

// 设置内容
const setContent = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  const sampleContent = `
    <h2>UEditor + MathLive 示例</h2>
    <p>这是一个结合了 <strong>UEditor</strong> 和 <strong>MathLive</strong> 的富文本编辑器。</p>
    <p>可以输入各种数学公式，例如：</p>
    <p>二次公式：<span class="math-formula" data-latex="x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}">${katex.renderToString('x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}', { throwOnError: false, displayMode: false })}</span></p>
    <p>欧拉公式：<span class="math-formula" data-latex="e^{i\\pi} + 1 = 0">${katex.renderToString('e^{i\\\\pi} + 1 = 0', { throwOnError: false, displayMode: false })}</span></p>
  `
  editorInstance.setContent(sampleContent)
  ElMessage.success('内容已设置')
}

// 清空内容
const clearContent = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  editorInstance.setContent('')
  previewContent.value = ''
  ElMessage.success('内容已清空')
}

// 获取 HTML
const getHtml = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  const html = editorInstance.getContent()
  console.log('HTML:', html)
  alert('HTML 已输出到控制台')
}

// 组件挂载
onMounted(() => {
  initUEditor()

  // 超时保护：如果15秒后编辑器仍未加载完成，则强制关闭加载状态
  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
      ElMessage.warning('UEditor + MathLive 加载超时，已强制显示界面')
    }
  }, 15000)
})

// 组件卸载
onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy()
    editorInstance = null
  }
})
</script>

<style scoped>
/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
}

.loading-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 20px;
    border: 3px solid #e4e7ed;
    border-top: 3px solid #8b5cf6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    margin: 0;
    color: #606266;
    font-size: 16px;
    font-weight: 500;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.ueditor-mathlive-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.editor-wrapper {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  background: white;
}

.preview {
  margin-top: 20px;
}

.preview h3 {
  margin-bottom: 10px;
  color: #333;
}

/* MathLive 对话框样式 */
.mathlive-dialog {
  padding: 0;
}

.mathlive-editor-wrapper {
  margin-bottom: 20px;
}

.mathlive-label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.mathlive-input {
  width: 100%;
  min-height: 60px;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 18px;
  transition: border-color 0.3s ease;
}

.mathlive-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

.formula-preview {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.preview-label {
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
}

.preview-content {
  min-height: 80px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
}

.preview-content:hover {
  border-color: #8b5cf6;
  background: #f3f4ff;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* 编辑器样式 */
:deep(#ueditor-mathlive-container) {
  width: 100%;
}

:deep(.edui-default) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* 预览区域样式 */
:deep(.el-card__body) {
  min-height: 100px;
  line-height: 1.6;
}

:deep(.el-card__body) {

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 16px 0 8px;
    color: #333;
  }

  p {
    margin: 8px 0;
    line-height: 1.8;
  }

  .math-formula {
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    display: inline-block;
    margin: 0 2px;
  }

  ul,
  ol {
    padding-left: 24px;
    margin: 12px 0;
  }

  li {
    margin: 4px 0;
  }

  a {
    color: #8b5cf6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}

/* MathLive 组件样式优化 */
:deep(math-field) {
  --hue: 265;
  --primary: #8b5cf6;
  --primary-variant: #a855f7;
  --on-primary: white;
  --secondary: #64748b;
  --secondary-variant: #475569;
  --on-secondary: white;
}

/* 对话框样式优化 */
:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  margin: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 24px;
}
</style>
