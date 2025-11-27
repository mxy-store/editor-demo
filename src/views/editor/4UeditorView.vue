<template>
  <div class="ueditor-container">
    <div class="header">
      <h2>富文本编辑器（UEditor + KityFormula）</h2>
      <div class="actions">
        <el-button type="success" @click="insertFormula">
          <span style="font-size: 16px; font-weight: bold;">f(x)</span> 插入公式
        </el-button>
        <el-button type="primary" @click="getContent">获取内容</el-button>
        <el-button @click="setContent">设置内容</el-button>
        <el-button @click="clearContent">清空</el-button>
        <el-button @click="getHtml">获取 HTML</el-button>
        <el-button @click="getPlainText">获取纯文本</el-button>
      </div>
    </div>

    <div class="editor-wrapper">
      <div id="ueditor-container" ref="editorContainer"></div>
    </div>

    <div class="preview">
      <h3>内容预览：</h3>
      <el-card>
        <div v-html="previewContent"></div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

// 声明 UE 全局变量
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UE: any
    UEDITOR_HOME_URL: string
  }
}

const editorContainer = ref<HTMLElement>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editorInstance: any = null
const previewContent = ref('')

// 插入公式
const insertFormula = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  // 调用 UEditor 的公式插入命令
  try {
    editorInstance.execCommand('kityformula')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('公式功能加载失败，请检查 KityFormula 插件是否正确安装')
  }
}

// 初始化 UEditor
const initUEditor = () => {
  // 设置 UEditor 资源路径 - 添加 base 路径前缀
  window.UEDITOR_HOME_URL = '/edtior-demo/UEditor/'

  // 加载 UEditor 配置文件
  loadScript('/edtior-demo/UEditor/ueditor.config.js', () => {
    // 加载 UEditor 主文件
    loadScript('/edtior-demo/UEditor/ueditor.all.min.js', () => {
      // 加载 KityFormula 插件的所有必需文件
      loadScript('/edtior-demo/UEditor/kityformula-plugin/addKityFormulaDialog.js', () => {
        loadScript('/edtior-demo/UEditor/kityformula-plugin/getKfContent.js', () => {
          loadScript('/edtior-demo/UEditor/kityformula-plugin/defaultFilterFix.js', () => {
            // 创建编辑器实例
            editorInstance = window.UE.getEditor('ueditor-container', {
              // 编辑器宽高
              initialFrameWidth: '100%',
              initialFrameHeight: 500,
              // 工具栏配置 - 添加公式按钮
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
                  'kityformula', '|', // 添加公式按钮
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
              theme: 'default',
              // 上传图片配置
              serverUrl: '', // 服务器统一请求接口路径
              imageUrlPrefix: '', // 图片路径前缀
              // 允许的图片格式
              imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
              // 图片上传大小限制（字节）
              imageMaxSize: 2048000,
              // 编辑区域背景色
              iframeUrlMap: {
                'link': '/edtior-demo/UEditor/dialogs/link/link.html',
                'insertimage': '/edtior-demo/UEditor/dialogs/image/image.html',
                'insertvideo': '/edtior-demo/UEditor/dialogs/video/video.html',
                'attachment': '/edtior-demo/UEditor/dialogs/attachment/attachment.html',
                'emotion': '/edtior-demo/UEditor/dialogs/emotion/emotion.html'
              }
            })

            // 编辑器准备就绪
            editorInstance.ready(() => {
              ElMessage.success('UEditor 编辑器加载完成（含 KityFormula 公式功能）')
              console.log('UEditor 已准备就绪，KityFormula 已加载')
            })
          })
        })
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
    <h2>这是一个示例标题</h2>
    <p>这是一段<strong>加粗</strong>的文字，这是一段<em>斜体</em>的文字。</p>
    <ul>
      <li>列表项 1</li>
      <li>列表项 2</li>
      <li>列表项 3</li>
    </ul>
    <p>这是一段包含<a href="https://www.baidu.com" target="_blank">超链接</a>的文字。</p>
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

// 获取纯文本
const getPlainText = () => {
  if (!editorInstance) {
    ElMessage.warning('编辑器尚未初始化')
    return
  }

  const text = editorInstance.getContentTxt()
  console.log('纯文本:', text)
  alert(`纯文本内容：\n${text}`)
}

// 组件挂载
onMounted(() => {
  initUEditor()
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
.ueditor-container {
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

:deep(.el-card__body) {
  min-height: 100px;
  line-height: 1.6;
}

/* UEditor 编辑器样式调整 */
:deep(#ueditor-container) {
  width: 100%;
}

:deep(.edui-default) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* 优化预览区域样式 */
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

  ul,
  ol {
    padding-left: 24px;
    margin: 12px 0;
  }

  li {
    margin: 4px 0;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
  }

  table td,
  table th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  table th {
    background: #f5f5f5;
    font-weight: 600;
  }

  blockquote {
    border-left: 4px solid #409eff;
    padding-left: 16px;
    margin: 12px 0;
    color: #666;
  }

  code {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }

  pre {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
}
</style>
