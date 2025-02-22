import fs from 'fs/promises';
import path from 'path';
import { API_CONFIG, IMPORT_CONFIG, PATH_CONFIG } from '../app-config';

interface BookmarkItem {
  slug: string;
  content: string;
}

interface ImportResult {
  success: boolean;
  slug: string;
  result?: any;
  error?: any;
}

/**
 * 将文本内容导入到书签系统
 * @param contentPath 包含文本内容的JSON文件路径
 * @throws {Error} 当导入过程中出现错误时抛出
 */
export async function importTextToBookmarks(contentPath: string) {
  try {
    // Read the JSON file
    const data = await fs.readFile(contentPath, 'utf-8');
    const bookmarks: BookmarkItem[] = JSON.parse(data);

    // Filter out empty content
    const validBookmarks = bookmarks.filter(item => item.content.trim().length > 0);
    console.log(`Found ${validBookmarks.length} bookmarks to import`);

    // Process in batches
    const results: ImportResult[] = [];

    for (let i = 0; i < validBookmarks.length; i += IMPORT_CONFIG.BATCH_SIZE) {
      const batch = validBookmarks.slice(i, i + IMPORT_CONFIG.BATCH_SIZE);
      const batchPromises = batch.map(async (item) => {
        try {
          const options = {
            method: 'POST',
            headers: {
              ...API_CONFIG.HEADERS,
              Authorization: `Bearer ${API_CONFIG.TOKEN}`
            },
            body: JSON.stringify({
              type: 'text',
              text: item.content
            })
          };

          const response = await fetch(`${API_CONFIG.BASE_URL}/bookmarks`, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(`✓ Imported: ${item.content.slice(0, 50)}...`);
          return { success: true, slug: item.slug, result };
        } catch (error) {
          console.error(`✗ Failed to import ${item.slug}:`, error);
          return { success: false, slug: item.slug, error };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      if (i + IMPORT_CONFIG.BATCH_SIZE < validBookmarks.length) {
        await new Promise(resolve => setTimeout(resolve, IMPORT_CONFIG.REQUEST_DELAY));
      }
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    console.log('\nImport Summary:');
    console.log(`Successfully imported: ${successful}`);
    console.log(`Failed: ${results.length - successful}`);

    // Save results to a log file in tmp directory
    const logPath = path.join(process.cwd(), PATH_CONFIG.TMP_DIR, 'import-results.json');
    await fs.writeFile(logPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results saved to: ${logPath}`);

  } catch (error) {
    console.error('Fatal error:', error);
    throw error;
  }
}