---
date: 2026-05-16 12:36:43
url: 
tags:
  - claude
  - deepseek
  - AI
  - 教程
title: Claude Code 接入 DeepSeek API
en-title: Connect Claude Code to DeepSeek
---

# Claude Code 接入 DeepSeek 完全指南

Claude Code 是 Anthropic 官方的命令行 AI 编程助手，但它并不强制绑定 Anthropic 的 API。通过配置，你可以将其后端模型切换为 DeepSeek，享受更低的成本和同样强大的编码能力。

本文将介绍三种主流接入方式：**环境变量法**（最简单）、**CC Switch GUI 工具**（可视化切换）、**直接修改配置文件**（一劳永逸）。

---

## 方法一：环境变量法（推荐新手）

这是 DeepSeek 官方文档中推荐的方式，无需安装任何额外工具。

### 1. 获取 DeepSeek API Key

前往 <span style="color:#00C2FF">[DeepSeek 开发者平台](https://platform.deepseek.com/)</span> 注册并创建 API Key。

### 2. 设置环境变量

根据 <span style="color:#00C2FF">[DeepSeek 官方 API 文档](https://api-docs.deepseek.com/zh-cn/guides/agent_integrations/claude_code)，</span>Claude Code 兼容接口地址为：

```bash
# 日常使用推荐 Flash 模型（速度快、成本低）
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="sk-你的API-Key"
export ANTHROPIC_MODEL="deepseek-v4-flash"

# 启动 Claude Code
claude
```

如果需要更强的推理能力，改用 Pro 模型：

```bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="sk-你的API-Key"
export ANTHROPIC_MODEL="deepseek-v4-pro"
```

### 3. 创建启动脚本（推荐）

每次都敲一遍环境变量太麻烦，建议做成脚本：

```bash
mkdir -p ~/.local/bin

cat > ~/.local/bin/claude-deepseek << 'EOF'
#!/usr/bin/env bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="sk-你的API-Key"
export ANTHROPIC_MODEL="deepseek-v4-flash"
exec claude "$@"
EOF

chmod +x ~/.local/bin/claude-deepseek
```

之后直接运行 `claude-deepseek` 即可，不影响原生 `claude` 命令的使用。

### 4. 验证是否生效

启动 Claude Code 后，输入任意问题，观察响应速度和模型名称。如果返回正常，说明接入成功。

---

## 方法二：CC Switch（GUI 可视化切换）

[CC Switch](https://github.com/farion1231/cc-switch) 是一个开源的桌面应用，提供图形界面来管理 Claude Code 的多供应商配置，支持一键切换。

### 安装

| 平台 | 下载方式 |
|------|---------|
| Windows | `CC-Switch-Setup-x.x.x.exe` 或绿色版 |
| macOS | `CC Switch-x.x.x-mac.zip` |
| Linux | `.AppImage` 文件 |

### 配置 DeepSeek

1. 打开 CC Switch
2. 点击右上角 「+」按钮添加新配置
3. 选择预设 **DeepSeek**
4. 填写你的 API Key
5. 设置模型名称（全部改为 `deepseek-v4-pro` 或 `deepseek-v4-flash`）
6. 点击「添加」→ 再点击「启用」

### 注意事项

CC Switch 底层本质上是修改 `~/.claude/settings.json` 配置文件。如果你在 CC Switch 中开启了**本地路由/代理模式**，模型名后**不要**加 `[1m]` 后缀（用于开启 1M 上下文），否则会导致 fallback 到 flash 模型。

---

## 方法三：直接修改配置文件（最彻底）

Claude Code 的配置文件位于 `~/.claude/settings.json`，直接编辑它即可永久生效。

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_API_KEY": "sk-你的API-Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro"
  }
}
```

修改保存后，重启 Claude Code 即可生效。此方法的好处是**一次配置，永久生效**，无需每次手动设置环境变量。

如果你的项目需要单独配置，也可以在项目根目录创建 `.claude/settings.json`，只对该项目生效。

---

## 方法四：cc-model-switcher（CLI 工具）

如果你喜欢命令行操作，可以使用 `cc-model-switcher` 这个 npm 包：

```bash
npm install -g cc-model-switcher
# 切换到 DeepSeek
cc_switch deepseek
# 交互式选择
cc_switch --interactive
# 查看所有可用模型
cc_switch -l
```

配置文件位于 `~/.models.json`，可自定义：

```json
{
  "models": {
    "deepseek": {
      "description": "DeepSeek V4",
      "env": {
        "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
        "ANTHROPIC_AUTH_TOKEN": "your-api-key",
        "ANTHROPIC_MODEL": "deepseek-v4-pro"
      }
    }
  }
}
```

---

## 方法五：ccenv-cli / ccx（环境变量管理器）

另一个轻量级选择，同样是 npm 包：

```bash
npm install -g ccenv-cli

# 创建 DeepSeek 配置
ccx create budget --template deepseek --api-key sk-xxxxx

# 直接启动
ccx run budget

# 在当前 shell 激活
eval "$(ccx use budget)"
claude
```

---

## 模型选择建议

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 日常编码、脚本、Bug 修复 | `deepseek-v4-flash` | 速度快、成本低 |
| 多文件重构、架构设计 | `deepseek-v4-pro` | 推理能力更强 |
| 超长文档/大项目分析 | `deepseek-v4-pro[1m]` | 支持 1M 上下文 |

**推荐策略**：日常用 Flash 当主力省钱，复杂任务临时切到 Pro。

---

## 总结

| 方法 | 适用人群 | 特点 |
|------|---------|------|
| 环境变量法 | 所有人 | 最简单，临时切换 |
| CC Switch | 需要多供应商切换 | GUI 可视化，一键切换 |
| 修改 settings.json | 固定使用 DeepSeek | 一劳永逸 |
| cc-model-switcher | CLI 爱好者 | 命令行快速切换 |
| ccenv-cli / ccx | 环境管理需求 | 多配置管理 |

以上所有方法的核心原理都是一样的——修改 Claude Code 的 `ANTHROPIC_BASE_URL` 指向 DeepSeek 的兼容接口 `https://api.deepseek.com/anthropic`。选择最适合你的方式即可。
