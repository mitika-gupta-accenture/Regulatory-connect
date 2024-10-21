type AsyncMapFunc<T, U> = (item: T) => Promise<U>;

export function mapAsync<T, U>(arr: T[], mapFunc: AsyncMapFunc<T, U>) {
  const promises = arr.map(mapFunc);
  return Promise.all(promises);
}

type AsyncForEachFunc<T> = (item: T) => Promise<void>;

export function forEachAsync<T>(arr: T[], forEachFunc: AsyncForEachFunc<T>) {
  return new Promise<void>((resolve, reject) => {
    const promises = arr.map(forEachFunc);
    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
}
