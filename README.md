# Markdown Notes Importer

一个用于将 Markdown 笔记批量导入到 Hoarder 书签系统的工具。本工具可以自动识别并分类笔记中的链接和文本内容，然后分别导入到书签系统中。

## 功能特点

- 自动读取并解析 Markdown 文件
- 智能识别纯链接和文本内容
- 批量导入到 Hoarder 书签系统
- 支持自定义配置
- 详细的导入日志
- 错误处理和重试机制

## 安装

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd markdown-notes-importer
   ```
2. 安装依赖：
   ```bash
   pnpm  install
   ```
3. 配置：
   ```bash
   cp conf.template.ts conf.ts
   ```
   然后编辑 `conf.ts` 文件，填入你的配置信息。

## 配置说明

在 `app-config.ts` 中配置以下内容：

```typescript
export const API_CONFIG = {
  BASE_URL: "your-api-url", // API 基础 URL
  TOKEN: "your-token", // API 认证 Token
  HEADERS: {
    // API 请求头
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
export const PATH_CONFIG = {
  MEMOS_DIR: "memos-mdfile", // Markdown 文件目录
  TMP_DIR: "tmp", // 临时文件目录
};
export const IMPORT_CONFIG = {
  BATCH_SIZE: 5, // 批量导入时的批次大小
  REQUEST_DELAY: 1000, // 请求间隔时间(毫秒)
};
```

## 使用方法

1. 准备 Markdown 文件：

   - 将需要导入的 Markdown 文件放入 `memos-mdfile` 目录

2. 运行导入程序：

   ```bash
   pnpm start
   ```

3. 查看结果：
   - 导入结果将保存在 `tmp/import-results.json` 文件中
   - 控制台会显示导入进度和统计信息

## 工作流程

1. 读取 Markdown：

   - 从 `memos-mdfile` 目录读取所有 `.md` 文件
   - 解析文件的 frontmatter 和内容
   - 生成初始 JSON 数据

2. 内容分类：

   - 将内容分为纯链接和文本内容
   - 分别生成链接数据和文本数据文件

3. 导入处理：

   - 链接内容：逐个导入到书签系统
   - 文本内容：批量导入，每批次 5 条
   - 导入间隔 1 秒，避免请求过于频繁

4. 结果记录：
   - 生成详细的导入日志
   - 统计成功和失败数量
   - 保存导入结果到 JSON 文件

## 目录结构

```plaintext
.
├── memos-mdfile/ # Markdown 文件目录
├── tmp/ # 临时文件和日志目录
├── src/
│ ├── index.ts # 主入口文件
│ ├── data-processor.ts # 数据处理
│ ├── link-importer.ts # 链接导入
│ ├── text-importer.ts # 文本导入
│ └── index-data.ts # 数据转换
└── conf.template.ts # 配置模板
```

## 注意事项

1. 确保 `app-config.ts` 中的 API Token 正确
2. 不要修改 `app-config.template.ts`
3. `app-config.ts` 已添加到 `.gitignore`，不会被提交到版本控制
4. 导入大量数据时，可以适当调整 `BATCH_SIZE` 和 `REQUEST_DELAY`

## 错误处理

- 程序会自动创建必要的目录
- 导入失败的项目会被记录在日志中
- 单个项目的失败不会影响整体导入流程
- 所有错误都会在控制台显示详细信息

## License

MIT
