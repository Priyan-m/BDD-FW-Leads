import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../hooks/custom-world';

Given('the lead paging message is {string}', async function (this: CustomWorld, message: string) {
  await this.page!.setContent('<div class="x-paging-info"></div>');
  await this.page!.locator('.x-paging-info').evaluate((element, text) => {
    element.textContent = text;
  }, message);
});

When('the lead paging message becomes {string} after {int} milliseconds', async function (this: CustomWorld, message: string, delay: number) {
  await this.page!.evaluate(({ text, timeout }) => {
    setTimeout(() => {
      document.querySelector('.x-paging-info')!.textContent = text;
    }, timeout);
  }, { text: message, timeout: delay });
});
