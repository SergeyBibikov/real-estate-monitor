import ZidaClient from './Client';

type AdData = { price: string; link: string };

export async function collectData(from: number, to: number) {
  const client = new ZidaClient(from, to);
  await client.init();

  const lastPage = await client.getLastPageNum();
  const res: Record<string, AdData[]> = {};

  for (let i = 1; i <= lastPage; i++) {
    const adsOnPage = await client.getAdsOnPage(i);
    for (const [location, price, link] of adsOnPage) {
      if (res[location]) res[location].push({ price, link });
      else res[location] = [{ price, link }];
    }
  }

  const final: any = {};
  Object.keys(res).forEach(
    (key) =>
      (final[key] = {
        count: res[key].length,
        ads: res[key],
      }),
  );
  await client.browser!.close();

  return final;
}
