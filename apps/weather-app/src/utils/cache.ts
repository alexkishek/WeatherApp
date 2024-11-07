import { Cache } from 'cache-manager';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';

const logger = new Logger('CacheUtility');

export async function getCachedData<T>(
  cacheManager: Cache,
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cachedData = await cacheManager.get<T>(cacheKey);
    if (cachedData) {
      logger.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    logger.log(`Cache miss for ${cacheKey}, fetching new data.`);
    const freshData = await fetchFunction();

    await cacheManager.set(cacheKey, freshData, ttl);
    return freshData;

  } catch (error) {
    logger.error(`Failed to fetch data for ${cacheKey}`, error);
    throw new HttpException('Failed to retrieve data', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
