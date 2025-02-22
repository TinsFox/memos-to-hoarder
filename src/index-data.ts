import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

interface PostData {
  slug: string;          // 文件名（不含扩展名）
  title: string;         // 文章标题
  content: string;       // 文章内容
  createdAt: string;     // 创建时间
  frontmatter: any;      // markdown frontmatter数据
}

/**
 * 从 memos-mdfile 目录读取所有 markdown 文件并解析
 * 解析包括：frontmatter、content、创建时间等信息
 * @returns {PostData[]} 解析后的文章数据数组
 * @throws {Error} 当 memos-mdfile 目录不存在时抛出错误
 */
function parseMarkdownFiles(): PostData[] {
  // 获取 memos-mdfile 目录下所有的.md文件
  const memosDir = path.join(process.cwd(), 'memos-mdfile');
  const tmpDir = path.join(process.cwd(), 'tmp');

  // 确保目录存在
  if (!fs.existsSync(memosDir)) {
    throw new Error('memos-mdfile directory does not exist');
  }

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const files = fs.readdirSync(memosDir)
    .filter(file => file.endsWith('.md'));

  const posts = files.map(filename => {
    // 读取文件内容
    const filePath = path.join(memosDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // 使用gray-matter解析frontmatter和内容
    const { data, content } = matter(fileContents);

    // 获取文件状态以读取创建时间
    const stats = fs.statSync(filePath);

    return {
      slug: filename.replace('.md', ''),
      title: data.title || filename,
      content: content.trim(),
      createdAt: stats.birthtime.toISOString(),
      frontmatter: data
    };
  });

  return posts;
}

/**
 * 将 markdown 文件转换为 JSON 格式并保存
 * @returns {Promise<string>} 返回生成的 JSON 文件路径
 * @throws {Error} 当文件处理过程中出现错误时抛出
 */
export async function convertMarkdownToJson() {
  try {
    const posts = parseMarkdownFiles();
    const outputPath = path.join(process.cwd(), 'tmp', 'memos.json');

    fs.writeFileSync(
      outputPath,
      JSON.stringify(posts, null, 2),
      'utf8'
    );
    console.log('Successfully converted markdown files to JSON');
    return outputPath;
  } catch (error) {
    console.error('Error processing markdown files:', error);
    throw error;
  }
}