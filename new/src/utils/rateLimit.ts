import LRU from "lru-cache";

type Options = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export default function rateLimit(options: Options) {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: (res: any, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);

        if (tokenCount[0] > limit) {
          reject();
        } else {
          resolve();
        }
      }),
  };
}
