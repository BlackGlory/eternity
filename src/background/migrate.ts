import { pipeAsync } from 'extra-utils'

export async function migrate(previousVersion: string): Promise<void> {
  await pipeAsync(previousVersion)
}
