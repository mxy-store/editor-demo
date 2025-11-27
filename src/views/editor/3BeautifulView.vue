<template>
  <div class="mathjax-editor-container">
    <div class="header">
      <h2>富文本编辑器 (WangEditor + vue-mathjax-beautiful)</h2>
      <div class="actions">
        <el-button type="success" @click="openFormulaEditor">
          <span style="font-size: 16px; font-weight: bold;">f(x)</span> 打开公式编辑器
        </el-button>
        <el-button type="primary" @click="getContent">获取内容</el-button>
        <el-button @click="setContent">设置内容</el-button>
        <el-button @click="clearContent">清空</el-button>
        <el-button @click="getHtml">获取 HTML</el-button>
      </div>
    </div>

    <div class="editor-wrapper">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 300px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>

    <!-- vue-mathjax-beautiful 公式编辑器 -->
    <VueMathjaxBeautiful v-model="showDialog" :existing-latex="currentFormula" theme="light" :show-symbols="true"
      :show-preview="true" :show-theme-toggle="true" :show-clear-button="true" :show-language-toggle="true"
      :show-formula-examples="true" :readonly="false" :auto-focus="true" placeholder="输入 LaTeX 公式或点击下方符号..."
      :max-length="2000" :rows="4" :enabled-categories="['basic', 'greek', 'advanced', 'matrices', 'calculus']"
      @insert="handleFormulaInsert" @change="handleFormulaChange" @clear="handleFormulaClear"
      @theme-change="handleThemeChange" />

    <div class="preview">
      <h3>内容预览：</h3>
      <el-card>
        <div v-html="previewContent"></div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, nextTick } from 'vue'
// @ts-expect-error - wangeditor vue wrapper does not have type definitions
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import formulaModule from '@wangeditor/plugin-formula'
import { VueMathjaxBeautiful } from 'vue-mathjax-beautiful'
import 'vue-mathjax-beautiful/dist/style.css'
import { ElMessage } from 'element-plus'
import katex from 'katex'
import '@wangeditor/editor/dist/css/style.css'
import 'katex/dist/katex.min.css'

// 注册公式插件
Boot.registerModule(formulaModule)

// 编辑器实例
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>欢迎使用富文本编辑器！点击工具栏的公式按钮可以打开专业的公式编辑器。</p>')
const previewContent = ref('')

// 模式
const mode = ref('default')

// vue-mathjax-beautiful 对话框状态
const showDialog = ref(false)
const currentFormula = ref('')

// 工具栏配置
const toolbarConfig = {
  excludeKeys: [], // 排除的工具栏按钮
  insertKeys: {
    index: 25, // 插入的位置
    keys: ['insertFormula', 'editFormula'] // 插入公式按钮
  }
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          insertFn(url, '', '')
        }
        reader.readAsDataURL(file)
      }
    },
    // 自定义公式插入
    formulaConfig: {
      onInsertFormula: (value: string) => {
        // 打开 vue-mathjax-beautiful 编辑器
        currentFormula.value = value || ''
        showDialog.value = true
        return false // 阻止默认行为
      },
      onEditFormula: (value: string) => {
        // 编辑公式时也打开 vue-mathjax-beautiful 编辑器
        currentFormula.value = value || ''
        showDialog.value = true
        return false
      }
    }
  }
}

// 处理公式插入
const handleFormulaInsert = (latex: string) => {
  const editor = editorRef.value
  if (!editor || !latex) {
    showDialog.value = false
    return
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any

    // 创建公式节点
    const formulaNode = {
      type: 'formula',
      value: latex,
      children: [{ text: '' }]
    }

    // 插入节点
    editorInstance.insertNode(formulaNode)

    // 关闭对话框
    showDialog.value = false

    ElMessage.success('公式已插入')

    // 重新渲染预览区域的公式
    nextTick(() => {
      renderFormulas()
    })
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入失败，请重试')
  }
}

// 手动打开公式编辑器
const openFormulaEditor = () => {
  currentFormula.value = ''
  showDialog.value = true
}

// 处理公式变化
const handleFormulaChange = (latex: string) => {
  console.log('公式内容变化:', latex)
  currentFormula.value = latex
}

// 处理清空公式
const handleFormulaClear = () => {
  console.log('公式已清空')
  currentFormula.value = ''
  ElMessage.info('公式已清空')
}

// 处理主题变化
const handleThemeChange = (theme: string) => {
  console.log('主题切换为:', theme)
  ElMessage.success(`已切换到${theme === 'dark' ? '深色' : '浅色'}主题`)
}

// 渲染公式（用于预览区域）
const renderFormulas = () => {
  nextTick(() => {
    const preview = document.querySelector('.preview .el-card__body')
    if (!preview) return

    const formulaElements = preview.querySelectorAll('[data-w-e-type="formula"]')
    formulaElements.forEach((element) => {
      const formulaValue = element.getAttribute('data-value')
      if (formulaValue && element instanceof HTMLElement) {
        try {
          katex.render(formulaValue, element, {
            throwOnError: false,
            displayMode: true
          })
        } catch (error) {
          console.error('公式渲染失败:', error)
        }
      }
    })
  })
}

// 监听编辑器按钮点击事件
const setupFormulaButtonListener = () => {
  nextTick(() => {
    // 查找插入公式按钮
    const insertButtons = document.querySelectorAll('[data-menu-key="insertFormula"]')
    insertButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        currentFormula.value = ''
        showDialog.value = true
      })
    })

    // 查找编辑公式按钮
    const editButtons = document.querySelectorAll('[data-menu-key="editFormula"]')
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        currentFormula.value = ''
        showDialog.value = true
      })
    })
  })
}

// 编辑器创建完成
const handleCreated = (editor: unknown) => {
  editorRef.value = editor
  console.log('编辑器已创建', editor)
  ElMessage.success('编辑器加载完成')

  // 设置公式按钮监听器
  setupFormulaButtonListener()
}

// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).destroy()
})

// 获取内容
const getContent = () => {
  const editor = editorRef.value
  if (editor == null) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = (editor as any).children
  console.log('编辑器内容：', content)

  // 更新预览
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = (editor as any).getHtml()
  previewContent.value = html

  // 渲染预览区域的公式
  renderFormulas()

  ElMessage.success('内容已获取，请查看控制台和预览区域')
}

// 设置内容
const setContent = () => {
  const editor = editorRef.value
  if (editor == null) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).setHtml('<p>这是一个示例内容</p><p>包含公式：</p>')

  ElMessage.success('内容已设置')
}

// 清空内容
const clearContent = () => {
  const editor = editorRef.value
  if (editor == null) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).clear()

  previewContent.value = ''
  ElMessage.success('内容已清空')
}

// 获取 HTML
const getHtml = () => {
  const editor = editorRef.value
  if (editor == null) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = (editor as any).getHtml()
  console.log('HTML:', html)
  alert('HTML 已输出到控制台')
}
</script>

<style scoped>
.mathjax-editor-container {
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
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.editor-wrapper {
  border: 1px solid #ccc;
  z-index: 100;
  margin-bottom: 20px;
}

.preview {
  margin-top: 20px;
}

.preview h3 {
  margin-bottom: 10px;
  color: #333;
}

:deep(.el-card__body) {
  min-height: 100px;
}

/* VueMathjaxBeautiful 组件样式优化 */
:deep(.mathjax-beautiful-container) {

  /* 对话框样式 */
  .mathjax-dialog {
    border-radius: 12px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  }

  .mathjax-dialog-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    padding: 20px 24px !important;
    border-radius: 12px 12px 0 0 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
  }

  .mathjax-dialog-body {
    padding: 24px !important;
    background: #fafafa !important;
  }

  /* 输入区域样式 */
  .latex-input-area {
    textarea {
      border: 2px solid #e0e0e0 !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      font-family: 'Courier New', 'Monaco', monospace !important;
      font-size: 15px !important;
      line-height: 1.6 !important;
      transition: all 0.3s ease !important;
      background: white !important;

      &:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        outline: none !important;
      }

      &::placeholder {
        color: #999 !important;
        font-style: italic !important;
      }
    }
  }

  /* 预览区域样式 */
  .formula-preview-area {
    background: white !important;
    border: 2px dashed #ddd !important;
    border-radius: 8px !important;
    padding: 20px !important;
    margin-top: 16px !important;
    min-height: 80px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s ease !important;

    &:hover {
      border-color: #667eea !important;
      background: #f8f9ff !important;
    }
  }

  /* 符号面板样式 */
  .symbols-panel {
    background: white !important;
    border-radius: 8px !important;
    padding: 16px !important;
    margin-top: 16px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  }

  .symbol-category {
    margin-bottom: 16px !important;

    h4 {
      color: #333 !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      margin-bottom: 12px !important;
      padding-bottom: 8px !important;
      border-bottom: 2px solid #f0f0f0 !important;
    }
  }

  .symbol-button {
    background: white !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 6px !important;
    padding: 8px 12px !important;
    margin: 4px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    font-size: 16px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 40px !important;

    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border-color: #667eea !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
    }

    &:active {
      transform: translateY(0) !important;
    }
  }

  /* 示例公式样式 */
  .formula-examples {
    background: white !important;
    border-radius: 8px !important;
    padding: 16px !important;
    margin-top: 16px !important;

    .example-item {
      padding: 10px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      border: 1px solid transparent !important;

      &:hover {
        background: #f8f9ff !important;
        border-color: #667eea !important;
        transform: translateX(4px) !important;
      }
    }
  }

  /* 按钮组样式 */
  .action-buttons {
    display: flex !important;
    gap: 12px !important;
    justify-content: flex-end !important;
    padding: 20px 24px !important;
    background: #fafafa !important;
    border-radius: 0 0 12px 12px !important;
    border-top: 1px solid #e0e0e0 !important;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    padding: 12px 32px !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;

    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }

    &:active {
      transform: translateY(0) !important;
    }
  }

  .btn-secondary {
    background: white !important;
    border: 2px solid #ddd !important;
    padding: 10px 30px !important;
    border-radius: 8px !important;
    color: #333 !important;
    font-weight: 600 !important;
    font-size: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: #f8f9fa !important;
      border-color: #667eea !important;
      color: #667eea !important;
    }
  }

  .btn-clear {
    background: #fff !important;
    border: 2px solid #ef4444 !important;
    color: #ef4444 !important;
    padding: 10px 24px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: #ef4444 !important;
      color: white !important;
      transform: translateY(-2px) !important;
    }
  }

  /* 主题切换按钮 */
  .theme-toggle {
    position: absolute !important;
    top: 20px !important;
    right: 60px !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 20px !important;
    padding: 6px 12px !important;
    color: white !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  }

  /* 语言切换 */
  .language-toggle {
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    color: white !important;
    font-size: 12px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  }
}

/* 公式编辑器弹窗样式优化 */
.formula-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    padding: 0;
    background: #f8f9fa;
  }
}

.formula-editor-wrapper {
  min-height: 70vh;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  /* 优化 vue-mathjax-beautiful 的样式 */
  :deep(.mathjax-editor) {
    padding: 20px;
  }

  :deep(.formula-preview) {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
    border: 2px dashed #ddd;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.symbol-panel) {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  :deep(.symbol-button) {
    transition: all 0.3s ease;
  }

  :deep(.symbol-button:hover) {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }

  :deep(.latex-input) {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }

  :deep(.latex-input:focus) {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  :deep(.action-buttons) {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 0 0 8px 8px;
  }

  :deep(.btn-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 10px 30px;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  :deep(.btn-primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  :deep(.btn-secondary) {
    background: white;
    border: 2px solid #ddd;
    padding: 10px 30px;
    border-radius: 6px;
    color: #333;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  :deep(.btn-secondary:hover) {
    background: #f8f9fa;
    border-color: #667eea;
  }
}

/* 滚动条美化 */
.formula-editor-wrapper::-webkit-scrollbar {
  width: 8px;
}

.formula-editor-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.formula-editor-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.formula-editor-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>
