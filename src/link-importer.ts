import fs from 'fs/promises';
import { API_CONFIG, IMPORT_CONFIG } from '../app-config';


interface LinkData {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  frontmatter: Record<string, unknown>;
}

/**
 * 将链接数据导入到书签系统
 * @param linkDataPath 包含链接数据的JSON文件路径
 * @throws {Error} 当导入过程中出现错误时抛出
 */
export async function importLinksToBookmarks(linkDataPath: string) {
  try {
    // Read the JSON file
    const data = await fs.readFile(linkDataPath, 'utf-8');
    const links: LinkData[] = JSON.parse(data);

    // Process links sequentially to avoid overwhelming the API
    for (const link of links) {
      const options = {
        method: 'POST',
        headers: {
          ...API_CONFIG.HEADERS,
          Authorization: `Bearer ${API_CONFIG.TOKEN}`
        },
        body: JSON.stringify({
          url: link.content,
          type: 'link'
        })
      };

      try {
        console.log(`Importing: ${link.content}`);
        const response = await fetch(`${API_CONFIG.BASE_URL}/bookmarks`, options);
        const result = await response.json();

        await new Promise(resolve => setTimeout(resolve, IMPORT_CONFIG.REQUEST_DELAY));
        console.log(`Imported successfully: ${link.content}`);
      } catch (error) {
        console.error(`Failed to import ${link.content}:`, error);
      }
    }

    console.log('Import completed!');
  } catch (error) {
    console.error('Failed to read or parse the JSON file:', error);
    throw error;
  }
}
