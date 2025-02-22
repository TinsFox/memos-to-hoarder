import * as fs from 'fs';
import * as path from 'path';

// 定义数据类型
interface Post {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  frontmatter: Record<string, any>;
}

/**
 * 检查给定的内容是否为单个URL
 * @param content 要检查的内容
 * @returns {boolean} 如果内容仅包含一个URL则返回true
 */
function isOnlyUrl(content: string): boolean {
  // 移除首尾空格
  const trimmed = content.trim();

  // URL 正则匹配模式
  const urlPattern = /^https?:\/\/[^\s]+$/;

  return urlPattern.test(trimmed);
}

/**
 * 将JSON数据分类为链接和文本内容
 * @param inputPath JSON文件的路径
 * @returns {Promise<{linkDataPath: string, contentDataPath: string}>} 分类后的文件路径
 * @throws {Error} 当处理过程中出现错误时抛出
 */
export async function separateLinksAndContent(inputPath: string): Promise<{ linkDataPath: string, contentDataPath: string }> {
  try {
    const tmpDir = path.join(process.cwd(), 'tmp');

    // 确保 tmp 目录存在
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // 读取源数据
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const posts: Post[] = JSON.parse(rawData);

    // 分类数据
    const linkPosts: Post[] = [];
    const contentPosts: Post[] = [];

    posts.forEach(post => {
      if (isOnlyUrl(post.content)) {
        linkPosts.push(post);
      } else {
        contentPosts.push(post);
      }
    });

    // 写入分类后的数据到 tmp 目录
    const linkDataPath = path.join(tmpDir, 'link-memos-data.json');
    const contentDataPath = path.join(tmpDir, 'content-memos-data.json');

    fs.writeFileSync(linkDataPath, JSON.stringify(linkPosts, null, 2));
    fs.writeFileSync(contentDataPath, JSON.stringify(contentPosts, null, 2));

    console.log(`处理完成:
- ${linkPosts.length} 条链接数据已写入 ${linkDataPath}
- ${contentPosts.length} 条内容数据已写入 ${contentDataPath}`);

    return { linkDataPath, contentDataPath };
  } catch (error) {
    console.error('处理数据时出错:', error);
    throw error;
  }
}
