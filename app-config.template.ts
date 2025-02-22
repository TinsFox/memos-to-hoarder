/**
 * API配置
 */
export const API_CONFIG = {
  /**
   * API基础URL
   */
  BASE_URL: 'https://your-api-domain.com/api/v1',

  /**
   * API认证Token
   */
  TOKEN: 'your_api_token_here',

  /**
   * API请求头
   */
  HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

/**
 * 文件路径配置
 */
export const PATH_CONFIG = {
  /**
   * Markdown文件目录
   */
  MEMOS_DIR: 'memos-mdfile',

  /**
   * 临时文件目录
   */
  TMP_DIR: 'tmp'
};

/**
 * 导入配置
 */
export const IMPORT_CONFIG = {
  /**
   * 批量导入时的批次大小
   */
  BATCH_SIZE: 5,

  /**
   * 请求间隔时间(毫秒)
   */
  REQUEST_DELAY: 1000
};