# PCB Resource Map for DeepSeek Harness

中文 | [English](README.md)

独立的 `.resmap` 查看插件，读取 UTF-8 SVG。支持网络悬停高亮、单选、Ctrl/Meta
多选、鼠标或键盘切换 Relay ON/OFF、适应窗口、100%、按钮和 Ctrl/Meta 滚轮缩放。
没有交互标记的文件按静态 SVG 显示。

此仓库与 DeepSeek Harness 分开维护。无需修改 DSH 或 SideTest，不写回源文件。
继电器切换只改变预览，不控制硬件。

## 安装

当前验证版本：DeepSeek Harness **0.2.2-rc.1**，Node **24.9 或更新版本**。
DSH 插件接口尚未稳定，其他版本未验证，兼容声明暂时固定为该版本。

在 **插件 → 添加插件** 中输入已构建 `.tgz` 包的 URL，或使用命令：

```powershell
dsh plugin --profile web add "C:/path/to/dsh-pcb-resource-map-0.1.0.tgz"
```

仓库提交 `lib/` 构建产物，也可以直接安装 GitHub 版本源码压缩包：

```powershell
dsh plugin --profile web add "https://github.com/jiexingluo/dsh-pcb-resource-map/archive/refs/tags/v0.1.0.tar.gz"
```

若要跟随开发版本，可用 `archive/refs/heads/main.tar.gz`。若 DSH 提示需要重启，重启后刷新页面。
在“已安装插件”中找到 **PCB Resource Map**，从工作区 Files 打开 `.resmap`。
预览菜单保留纯文本回退和重新加载。

npm 包名拟用 `dsh-pcb-resource-map`，但**尚未发布到 npm registry**。
维护者发布后，才可以直接按名称安装：

```powershell
dsh plugin --profile web add dsh-pcb-resource-map
```

请先禁用或移除旧版原型 `@deepseek-ai/dsh-client-ui-resmap`，避免注册两个渲染器。

## 开发与发布

```powershell
npm install --global pnpm@11.28.5
pnpm install --frozen-lockfile
npm run check
npm test
npm run build
npm run verify:package
npm pack
```

开发和 CI 均使用已提交的 pnpm 锁文件。
构建脚本独立生成 Node 入口、DSH 浏览器模块工厂和 CSS，不依赖 DSH 单仓构建脚本。
React 与共享 UI primitives 由运行中的 DSH 提供，DOMPurify 随插件打包并保留许可证。
配置插入自己的 `pcb-resource-map` 行，不要求上游预先添加对应配置。

修改后重新构建并提交 `lib/`，使 GitHub 压缩包无需安装脚本即可使用。
`npm pack` 会先构建。CI 运行构建和测试，并上传 `.tgz` 产物。
npm 发布工作流需手动触发，并要求仓库设置有发布权限的 `NPM_TOKEN`；push 不会自动发布。

在已构建的 DSH 源码目录上运行真实、无需模型密钥的浏览器集成测试：

```powershell
$env:DSH_CHECKOUT = "D:/CodeBase/deepseek-harness-master"
node scripts/test-dsh.mjs
```

## 格式与限制

- NET 支持 `data-type="NET"`，或 `data-role="wire"` 与 `data-net`。
- Relay 支持 `data-type="Relay"` 或 `data-role="relay"`，通过唯一匹配的
  `_ON`/`_OFF` 子节点切换状态。有歧义的配对保持静态。
- 要求有效 viewBox 或正数绝对宽高，不支持仅百分比尺寸。
- 清理 SVG 后置于禁止脚本的沙箱 iframe，隔离 CSS 和 ID，阻止外部资源、脚本、
  链接及动画。两种主题均保留白色图纸背景。受 Host 完整文件读取大小上限约束。
- 重新加载重置查看状态；不提供编辑、导出和硬件连接。

## 来源与许可证

从 DSH 原型提交 `7f18821d` 提取，上游基线为
`fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`。保留上游 [MIT 许可证](LICENSE)，
DOMPurify 声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
不包含私有样本或本地认证信息。
