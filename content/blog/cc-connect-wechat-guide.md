---
date: 2026-05-18 12:00:00
url:
tags:
  - cc-connect
  - wechat
  - claude
  - AI
  - 教程
title: 用 cc-connect 将微信接入 Claude Code
en-title: Connect WeChat to Claude Code with cc-connect
---

# 用 cc-connect 将微信接入 Claude Code

[cc-connect](https://github.com/chenhg5/cc-connect) 是一个开源的消息桥接工具，支持将微信、飞书、Telegram、Slack、Discord、LINE、企业微信等十余个平台连接到本地 AI 编程助手（Claude Code、Codex、Cursor 等）。

本文以**微信个人号（Weixin ilink）接入 Claude Code** 为例，介绍配置过程和常见故障处理方法。

---

## 前置准备

- macOS / Linux 系统
- Claude Code 已安装并配置好
- 一个微信个人号（用于接收消息）

---

## 一、安装 cc-connect

cc-connect 可以通过 Homebrew 安装：

```bash
brew install chenhg5/tap/cc-connect
```

其他安装方式请参考[官方文档](https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md)。

## 二、配置微信机器人

### 1. 创建配置文件

cc-connect 的全局配置文件位于 `~/.cc-connect/config.toml`，首次启动时会自动创建默认配置。也可以手动创建：

```bash
mkdir -p ~/.cc-connect
cc-connect config example > ~/.cc-connect/config.toml
```

### 2. 编写配置

以下是一个微信 + Claude Code 的最小配置：

```toml
language = "zh"

[log]
level = "info"

[[projects]]
name = "wechat-ai"
work_dir = "/path/to/your/project"
admin_from = "你的微信ID@im.wechat"

  [projects.agent]
  type = "claudecode"

  [[projects.platforms]]
  type = "weixin"

  [projects.platforms.options]
  token = "你的ilink token"
  base_url = "https://ilinkai.weixin.qq.com"
  account_id = "你的ilink账号"
  allow_from = "你的微信ID@im.wechat"
```

参数说明：

| 参数 | 说明 |
|------|------|
| `work_dir` | Claude Code 的工作目录 |
| `admin_from` | 管理员用户 ID，有最高权限 |
| `allow_from` | 允许使用机器人的用户 ID |
| `type = "weixin"` | 使用微信个人号（ilink）协议 |
| `token` | ilink 机器人的 token |

### 3. 配置微信 ilink 机器人

cc-connect 支持通过扫码快速配置微信 ilink 机器人：

```bash
cc-connect weixin setup
```

按照提示扫码即可完成绑定。如果已有 token，可以直接绑定：

```bash
cc-connect weixin bind --token "你的token"
```

## 三、启动

直接运行即可：

```bash
cc-connect
```

看到以下输出说明启动成功：

```
INFO config loaded
INFO platform ready  project=wechat-ai platform=weixin
INFO engine started  project=wechat-ai agent=claudecode
INFO cc-connect is running  projects=1
```

之后通过微信给机器人发消息，就会自动转发给 Claude Code 处理。

---

## 四、常见崩溃处理

cc-connect 目前是 v1.3.3-beta.2，仍属于测试版，偶尔会出现 session 映射丢失导致报错：

```
❌ 错误: No conversation found with session ID: xxxxxx
```

之后所有消息都返回空响应。这是因为 cc-connect 内部维护的 session 映射文件出现了问题。

按以下步骤依次尝试修复：

### 第一步：重启 cc-connect

```bash
cc-connect --force
```

`--force` 会杀掉旧实例再启动，多数临时问题可解决。

### 第二步：清理 session 映射

如果重启无效，删除 cc-connect 的 session 映射文件：

```bash
rm ~/.cc-connect/sessions/wechat-ai.json
```

然后重启 cc-connect。

### 第三步：清理 Claude Code 会话

如果以上两步还不行，删除对应项目的 Claude Code 会话记录：

```bash
rm -f ~/.claude/projects/-你的项目目录/*.jsonl
```

然后重启 cc-connect。

### 一句话应急

```bash
rm ~/.cc-connect/sessions/wechat-ai.json && cc-connect --force
```

---

## 五、持久化运行

### 后台运行

另开一个终端窗口运行 `cc-connect`，关掉 Claude Code 也不影响。

### 安装为系统服务（开机自启）

```bash
cc-connect daemon install
```

macOS 下会注册为 launchd 服务，系统重启后自动启动。

---

## 总结

cc-connect 是一个强大的消息桥接工具，配置简单，支持平台丰富。虽然目前还是 beta 版本，偶尔会有 session 映射问题，但修复步骤很明确，不影响日常使用。
