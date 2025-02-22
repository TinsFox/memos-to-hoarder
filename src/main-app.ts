import { separateLinksAndContent } from "./data-processor";
import { importLinksToBookmarks } from "./link-importer";
import { importTextToBookmarks } from "./text-importer";
import { convertMarkdownToJson } from "./index-data";

/**
 * 主程序入口
 * 执行流程：
 * 1. 将 markdown 文件转换为 JSON
 * 2. 将数据分离为链接和文本内容
 * 3. 导入链接到书签系统
 * 4. 导入文本内容到书签系统
 */
async function main() {
  try {
    // 1. 处理 markdown 文件生成初始 JSON
    console.log('Step 1: Processing markdown files...');
    const postsJsonPath = await convertMarkdownToJson();

    // 2. 分离链接和文本内容
    console.log('\nStep 2: Separating links and content...');
    const { linkDataPath, contentDataPath } = await separateLinksAndContent(postsJsonPath);
    console.log('{ linkDataPath, contentDataPath }: ', { linkDataPath, contentDataPath });

    // 3. 导入链接
    console.log('\nStep 3: Importing links...');
    await importLinksToBookmarks(linkDataPath);

    // 4. 导入文本内容
    console.log('\nStep 4: Importing text content...');
    await importTextToBookmarks(contentDataPath);

    console.log('\nAll operations completed successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();
