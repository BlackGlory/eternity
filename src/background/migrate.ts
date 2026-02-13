import { pipeAsync } from 'extra-utils'

export async function migrate(previousVersion: string): Promise<void> {
  // 尚无需要迁移的用户数据, 此处代码仅为占位符.
  await pipeAsync(previousVersion)
}
