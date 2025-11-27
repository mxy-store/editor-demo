<template>
  <div class="mathlive-container">
    <div class="header">
      <h2>富文本编辑器 (WangEditor + MathLive)</h2>
      <p class="subtitle">集成 MathLive 的专业数学公式编辑能力</p>
      <div class="actions">
        <el-button type="primary" @click="getContent">获取内容</el-button>
        <el-button @click="setContent">设置示例</el-button>
        <el-button @click="clearContent">清空</el-button>
        <el-button type="success" @click="openFormulaDialog">
          <span style="font-size: 16px; font-weight: bold;">∫</span> 插入公式
        </el-button>
      </div>
    </div>

    <div class="editor-wrapper">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 300px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>

    <!-- MathLive 公式对话框 -->
    <el-dialog v-model="formulaDialogVisible" title="插入数学公式 (MathLive)" width="1000px" :close-on-click-modal="false"
      :append-to-body="true" :modal-append-to-body="false" :z-index="3000">
      <div class="mathlive-dialog">
        <el-row :gutter="20">
          <el-col :span="14">
            <div class="editor-section">
              <h4>公式编辑器：</h4>
              <div ref="mathfieldRef" class="mathfield-wrapper"></div>
              <div class="editor-tips">
                <p><strong>快捷键：</strong></p>
                <ul>
                  <li><code>^</code> 上标 | <code>_</code> 下标 | <code>/</code> 分数</li>
                  <li><code>sqrt</code> 根号 | <code>int</code> 积分 | <code>sum</code> 求和</li>
                </ul>
              </div>
            </div>

            <el-tabs v-model="activeTemplateTab" type="card" class="template-tabs">
              <el-tab-pane label="数学" name="math">
                <div class="template-section">
                  <el-button v-for="item in mathTemplates.basic" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="物理" name="physics">
                <div class="template-section">
                  <el-button v-for="item in physicsTemplates.mechanics" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="化学" name="chemistry">
                <div class="template-section">
                  <el-button v-for="item in chemistryTemplates.molecules" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="医学" name="medical">
                <div class="template-section">
                  <h5>基础指标</h5>
                  <el-button v-for="item in medicalTemplates.bmi" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
                <div class="template-section">
                  <h5>呼吸系统</h5>
                  <el-button v-for="item in medicalTemplates.respiratory" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>

          <el-col :span="10">
            <div class="output-section">
              <h4>LaTeX 代码：</h4>
              <el-input v-model="latexOutput" type="textarea" :rows="4" readonly />

              <h4 style="margin-top: 16px">渲染预览：</h4>
              <div class="render-preview" v-html="renderedFormula"></div>

              <h4 style="margin-top: 16px">ASCII Math：</h4>
              <el-input v-model="asciiMathOutput" type="textarea" :rows="3" readonly />
            </div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="formulaDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertFormula">确定插入</el-button>
      </template>
    </el-dialog>

    <div class="preview">
      <h3>内容预览：</h3>
      <el-card>
        <div v-html="previewContent"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, nextTick, onMounted } from 'vue'
// @ts-expect-error - wangeditor vue wrapper does not have type definitions
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import formulaModule from '@wangeditor/plugin-formula'
import { ElMessage } from 'element-plus'
import { MathfieldElement } from 'mathlive'
import '@wangeditor/editor/dist/css/style.css'

// 注册公式插件
Boot.registerModule(formulaModule)

// 编辑器实例
const editorRef = shallowRef()
const valueHtml = ref('<p>欢迎使用富文本编辑器！点击上方按钮插入 MathLive 公式。</p>')
const previewContent = ref('')
const mode = ref('default')

// MathLive 相关
const mathfieldRef = ref<HTMLElement>()
let mathfield: MathfieldElement | null = null
const formulaDialogVisible = ref(false)
const latexOutput = ref('')
const asciiMathOutput = ref('')
const mathMLOutput = ref('')
const renderedFormula = ref('')
const activeTemplateTab = ref('math')

// 公式模板数据
const mathTemplates = {
  basic: [
    { latex: '\\frac{a}{b}', name: '分数' },
    { latex: '\\sqrt{x}', name: '平方根' },
    { latex: 'x^{n}', name: '幂' },
    { latex: '\\int_{a}^{b} f(x) dx', name: '定积分' },
    { latex: '\\sum_{i=1}^{n} x_i', name: '求和' },
    { latex: '\\lim_{x \\to \\infty} f(x)', name: '极限' },
    { latex: '\\alpha', name: 'α' },
    { latex: '\\beta', name: 'β' },
    { latex: '\\pi', name: 'π' },
    { latex: '\\infty', name: '∞' }
  ]
}

const physicsTemplates = {
  mechanics: [
    { latex: 'F = ma', name: '牛顿第二定律' },
    { latex: 'E_k = \\frac{1}{2}mv^2', name: '动能' },
    { latex: 'E = mc^2', name: '质能方程' },
    { latex: 'p = mv', name: '动量' },
    { latex: 'W = Fs\\cos\\theta', name: '功' }
  ]
}

const chemistryTemplates = {
  molecules: [
    { latex: '\\text{H}_2\\text{O}', name: '水' },
    { latex: '\\text{CO}_2', name: '二氧化碳' },
    { latex: '\\text{NH}_3', name: '氨气' },
    { latex: '\\text{NaCl}', name: '氯化钠' }
  ]
}

const medicalTemplates = {
  bmi: [
    { latex: '\\text{BMI} = \\frac{\\text{体重}}{\\text{身高}^2}', name: 'BMI指数' },
    { latex: '\\text{MAP} = \\text{DBP} + \\frac{1}{3}(\\text{SBP} - \\text{DBP})', name: '平均动脉压' },
    { latex: '\\text{CO} = \\text{HR} \\times \\text{SV}', name: '心输出量' }
  ],
  respiratory: [
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}}', name: '通气血流比' },
    { latex: '\\dot{V}_A = 4.2\\text{ L/min}', name: '肺泡通气量' },
    { latex: '\\dot{Q} = 5.0\\text{ L/min}', name: '肺血流量' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} \\approx 0.8', name: '正常V̇A/Q̇比值' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = 0', name: '分流状态' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = \\infty', name: '死腔状态' },
    { latex: 'Q_s = 5.0\\text{ L/min}', name: '心输出量' },
    { latex: 'P_{O_2} = 40\\text{ mmHg}', name: '静脉血氧分压' },
    { latex: 'P_{CO_2}', name: '二氧化碳分压' }
  ]
}

// 工具栏配置
const toolbarConfig = {
  excludeKeys: []
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

// 初始化 MathLive
const initMathfield = () => {
  if (!mathfieldRef.value) return

  mathfield = new MathfieldElement()
  mathfield.mathModeSpace = '\\,'
  mathfield.smartMode = true
  mathfield.smartFence = true
  mathfield.smartSuperscript = true
  mathfield.value = 'f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}'
  mathfield.style.fontSize = '28px'
  mathfield.style.padding = '16px'
  mathfield.style.border = '2px solid #409eff'
  mathfield.style.borderRadius = '8px'
  mathfield.style.minHeight = '100px'

  mathfield.addEventListener('input', () => {
    updateOutputs()
  })

  mathfieldRef.value.appendChild(mathfield)
  updateOutputs()
}

// 更新输出
const updateOutputs = () => {
  if (!mathfield) return

  latexOutput.value = mathfield.value
  asciiMathOutput.value = mathfield.getValue('ascii-math')
  mathMLOutput.value = mathfield.getValue('math-ml')

  const latex = mathfield.value
  renderedFormula.value = `<math-field read-only style="font-size: 20px;">${latex}</math-field>`
}

// 设置公式
const setFormula = (latex: string) => {
  if (mathfield) {
    mathfield.value = latex
    mathfield.focus()
    updateOutputs()
  }
}

// 打开公式对话框
const openFormulaDialog = () => {
  formulaDialogVisible.value = true
  nextTick(() => {
    if (!mathfield) {
      initMathfield()
    }
  })
}

// 确认插入公式
const confirmInsertFormula = () => {
  if (!latexOutput.value.trim()) {
    ElMessage.warning('请输入公式')
    return
  }

  const editor = editorRef.value
  if (!editor) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any

    const formulaNode = {
      type: 'formula',
      value: latexOutput.value,
      children: [{ text: '' }]
    }

    editorInstance.insertNode(formulaNode)

    formulaDialogVisible.value = false
    ElMessage.success('公式已插入')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入失败，请重试')
  }
}

// 编辑器创建完成
const handleCreated = (editor: unknown) => {
  editorRef.value = editor
  ElMessage.success('编辑器加载完成')
}

// 获取内容
const getContent = () => {
  previewContent.value = valueHtml.value
  ElMessage.success('内容已更新到预览区域')
  console.log('编辑器内容：', valueHtml.value)
}

// 设置内容
const setContent = () => {
  const sampleContent = `
    <h2>这是一个示例标题</h2>
    <p>这是一段示例文本，展示了富文本编辑器的基本功能。</p>
    <p>数学公式示例：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="E=mc^2"></span></p>
    <p>行内公式：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="\\frac{\\dot{V}_A}{\\dot{Q}} \\approx 0.8"></span></p>
  `
  valueHtml.value = sampleContent
  previewContent.value = sampleContent
  ElMessage.success('已设置示例内容')
}

// 清空内容
const clearContent = () => {
  valueHtml.value = ''
  previewContent.value = ''
  ElMessage.info('内容已清空')
}

// 组件挂载
onMounted(() => {
  // MathLive 会在对话框打开时初始化
})

// 组件销毁
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).destroy()

  if (mathfield && mathfieldRef.value) {
    mathfieldRef.value.removeChild(mathfield)
    mathfield = null
  }
})
</script>

<style lang="scss" scoped>
.mathlive-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 0 0 8px 0;
    color: #303133;
    font-size: 24px;
  }

  .subtitle {
    margin: 0 0 16px 0;
    color: #606266;
    font-size: 14px;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.editor-wrapper {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0 0 15px 0;
    color: #303133;
    font-size: 18px;
  }

  :deep(.el-card__body) {
    min-height: 200px;

    p {
      margin: 8px 0;
      line-height: 1.8;
    }
  }
}

.mathlive-dialog {
  .editor-section {
    margin-bottom: 20px;

    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 15px;
      font-weight: 600;
    }

    .mathfield-wrapper {
      margin-bottom: 12px;
    }

    .editor-tips {
      padding: 12px;
      background: #f0f9ff;
      border-radius: 6px;
      border-left: 4px solid #409eff;

      p {
        margin: 0 0 8px 0;
        color: #303133;
        font-weight: 600;
        font-size: 13px;
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
          color: #606266;
          font-size: 12px;
        }
      }

      code {
        background: #e1e3e5;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        color: #e83e8c;
        font-size: 12px;
      }
    }
  }

  .template-tabs {
    :deep(.el-tabs__content) {
      max-height: 200px;
      overflow-y: auto;
    }

    .template-section {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;

      .el-button {
        font-size: 12px;
      }
    }
  }

  .output-section {
    h4 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 14px;
      font-weight: 600;
    }

    .render-preview {
      padding: 16px;
      background: #f8f9fa;
      border: 2px dashed #ddd;
      border-radius: 6px;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(math-field) {
        background: transparent;
        border: none;
      }
    }
  }
}

:deep(math-field) {
  --hue: 215;
  --highlight: rgba(64, 158, 255, 0.2);
}

// MathLive 虚拟键盘层级设置
:deep(.ML__keyboard) {
  z-index: 3100 !important;
}

// 确保对话框不会遮挡键盘
:deep(.el-dialog__wrapper) {
  z-index: 3000 !important;
}

:deep(.el-overlay) {
  z-index: 2999 !important;
}

@media (max-width: 768px) {
  .header {
    h2 {
      font-size: 20px;
    }

    .actions {
      flex-direction: column;
    }
  }
}
</style>
