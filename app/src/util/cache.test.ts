import { CachedFunctionCall } from "./cache"
import { CommonUtil } from "./common.util"

describe('CachedFunctionCall.getAsync', () => {
  it('should execute the function just once', async () => {
    let count = 0
    const cached = new CachedFunctionCall(100, async (): Promise<number> => {
      count++
      return count
    })
    expect(await cached.getAsync()).toBe(1)
    expect(await cached.getAsync()).toBe(1)
    expect(await cached.getAsync()).toBe(1)
    await CommonUtil.timeout(100)
    expect(await cached.getAsync()).toBe(2)
    expect(await cached.getAsync()).toBe(2)
    expect(await cached.getAsync()).toBe(2)
  })
})