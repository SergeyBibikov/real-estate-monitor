//https://www.4zida.rs/prodaja-kuca?jeftinije_od=20000eur&skuplje_od=10000eur&uknjizeno=da
import { Browser, chromium, Locator, Page } from 'playwright';

class Client {
  private baseUrl = 'https://www.4zida.rs';
  url: string;
  browser?: Browser;
  page?: Page;

  constructor(
    readonly from: number,
    readonly to: number,
  ) {
    this.url = `${this.baseUrl}/prodaja-kuca?uknjizeno=da&jeftinije_od=${this.to}eur&skuplje_od=${this.from}eur`;
  }
  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser!.newPage();
    return this;
  }

  async close() {
    await this.browser!.close();
  }

  async getLastPageNum(): Promise<number> {
    await this.page!.goto(this.url);
    const res = await this.page!.getByText('Novi oglasi na mejl')
      .locator('xpath=/ancestor::button')
      .locator('xpath=/..')
      .locator('xpath=/following-sibling::div')
      .locator('a span')
      .last()
      .textContent();
    return Number(String(res));
  }

  async getAdsOnPage(pageNum = 1) {
    const url = `${this.url}&strana=${pageNum}`;
    if (!this.page) throw new Error();
    await this.page.goto(url);
    const card = this.page.locator('[test-data="ad-search-card"]');
    const result = [];
    for (let i = 0; i < (await card.count()); i++) {
      const baseLocator = card
        .nth(i)
        .locator('> div')
        .nth(1)
        .locator('> a')
        .first();

      const location = String(
        await baseLocator
          .locator('> div')
          .first()
          .locator('>p')
          .nth(1)
          .textContent(),
      )
        .split(',')
        .at(-1)!
        .trim();

      const price = String(
        await baseLocator
          .locator('> div')
          .nth(1)
          .locator('>p')
          .first()
          .textContent(),
      ).replace(/\.|\s|€/g, '');

      const link = await baseLocator.getAttribute('href');

      result.push([location, price, this.baseUrl + link]);
    }

    return result;
  }
}
export default Client;
