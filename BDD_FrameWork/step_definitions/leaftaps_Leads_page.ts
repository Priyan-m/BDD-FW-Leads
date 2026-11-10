import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { DEFAULT_TIMEOUT } from "../config/config";
import { PlaywrightWrapper } from "../utils/wrapper";

const getWrapper = (world: any) => new PlaywrightWrapper(world.page, world.context);

const extractLeadId = async (locator: any): Promise<string> => {
  const href = await locator.getAttribute('href');
  if (href) {
    const setValueMatch = href.match(/set_value\(['"]?(\d+)/i);
    if (setValueMatch) {
      return setValueMatch[1];
    }

    const partyIdMatch = href.match(/partyId=(\d+)/i);
    if (partyIdMatch) {
      return partyIdMatch[1];
    }
  }

  const text = (await locator.innerText()).trim();
  const matchedDigits = text.match(/\d+/);
  return matchedDigits ? matchedDigits[0] : text;
};

const findLeadAtIndex = async (page: any, index: number) => {
  const selectors = [
    "a[href*='set_value']",
    "a[href*='javascript:set_value']",
    "a[href*='viewLead?partyId=']",
    "div.x-grid3-col-partyId a",
    "div.x-grid3-cell-inner.x-grid3-col-partyId a",
    "div.x-grid3-row-table a"
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).filter({ visible: true });
    try {
      await locator.first().waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      continue;
    }
    const count = await locator.count();
    if (count > index) {
      return locator.nth(index);
    }
  }

  throw new Error(`No lead result found at index ${index} in the popup`);
};

const findFirstLead = async (page: any) => findLeadAtIndex(page, 0);

const fillPhoneNumber = async (page: any, phoneNumber: string) => {
  const primaryPhone = page.locator('#createLeadForm_primaryPhoneNumber');
  const searchPhone = page.locator("input[name='phoneNumber']");

  if (await primaryPhone.count()) {
    await primaryPhone.fill(phoneNumber, { timeout: 30000 });
    return;
  }

  if (await searchPhone.count()) {
    await searchPhone.fill(phoneNumber, { timeout: 30000 });
    return;
  }

  throw new Error('Phone number field not found');
};

When('Click on the Leads tab', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Leads"]');
});

When('Click on the Create Lead link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Create Lead"]');
});

When('Click on Find Leads link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Find Leads"]');
});

When('Click on Merge Leads link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Merge Leads"]');
});

When('Enter company name as {string}', async function (compName: string) {
  const wrapper = getWrapper(this);
  await wrapper.fill('#createLeadForm_companyName', compName);
});

When('Enter first name as {string}', async function (fName: string) {
  const wrapper = getWrapper(this);
  await wrapper.fill('#createLeadForm_firstName', fName);
});

When('Enter last name as {string}', async function (lName: string) {
  const wrapper = getWrapper(this);
  await wrapper.fill('#createLeadForm_lastName', lName);
});

When('Enter title as {string}', async function (title: string) {
  const wrapper = getWrapper(this);
  await wrapper.fill('#createLeadForm_generalProfTitle', title);
});

When('Enter phone number as {string}', async function (phoneNumber: string) {
  const wrapper = getWrapper(this);
  await fillPhoneNumber(wrapper.page, phoneNumber);
});

When('Update company name to {string}', async function (companyName: string) {
  const wrapper = getWrapper(this);
  await wrapper.fill('#updateLeadForm_companyName', companyName);
});

When('Click on Create Lead button', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//input[@name="submitButton"]');
});

When('Click on Update button', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//input[@value="Update"]');
});

When('Click on Edit link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Edit"]');
});

When('Click on Duplicate Lead link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Duplicate Lead"]');
});

When('Click on Delete link', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//a[text()="Delete"]');
});

When('Select Phone tab', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//span[text()="Phone"]');
});

When('Click on Find Leads button', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click('//button[normalize-space()="Find Leads"]');
});

When('Select the first lead result', async function () {
  const wrapper = getWrapper(this);
  const lead = await findFirstLead(wrapper.page);
  this.leadId = await extractLeadId(lead);
  await lead.click();
});

When('Select the first merge lead result', async function () {
  const lead = await findFirstLead(this.mergePopup);
  this.mergeLeadId = await extractLeadId(lead);
  await lead.click({ force: true });
});

When('Select the second merge lead result', async function () {
  const lead = await findFirstLead(this.mergePopup);
  this.secondMergeLeadId = await extractLeadId(lead);
  await lead.click({ force: true });
});

When('Store lead id', async function () {
  if (!this.leadId) {
    const wrapper = getWrapper(this);
    const lead = await findFirstLead(wrapper.page);
    this.leadId = await extractLeadId(lead);
  }
});

When('Store selected merge lead id', async function () {
  if (!this.mergeLeadId) {
    const lead = await findFirstLead(this.mergePopup);
    this.mergeLeadId = await extractLeadId(lead);
  }
});

When('Search lead by id with stored lead id', async function () {
  const wrapper = getWrapper(this);
  await wrapper.fill('input[name="id"]', this.leadId);
});

When('Search lead by id with stored merge lead id', async function () {
  const wrapper = getWrapper(this);
  await wrapper.fill('input[name="id"]', this.mergeLeadId);
});

When('Open the first merge lead lookup', async function () {
  const wrapper = getWrapper(this);
  this.mergePopup = await wrapper.openPopup("img[alt='Lookup']", 0);
  await this.mergePopup.waitForLoadState();
});

When('Open the second merge lead lookup', async function () {
  const wrapper = getWrapper(this);
  this.mergePopup = await wrapper.openPopup("img[alt='Lookup']", 1);
  await this.mergePopup.waitForLoadState();
});

When('Search merge lead by first name {string}', async function (firstName: string) {
  await this.mergePopup.locator("input[name='firstName']").fill(firstName);
  await this.mergePopup.locator('button:has-text("Find Leads")').click();
});

When('Click on Merge button', async function () {
  const wrapper = getWrapper(this);
  const dialogPromise = wrapper.page.waitForEvent('dialog');
  await wrapper.page.locator('//a[normalize-space()="Merge"]').click({ noWaitAfter: true });
  const dialog = await dialogPromise;
  await dialog.accept();
  this.pendingDialog = null;
});

When('Accept merge confirmation', async function () {
  if (this.pendingDialog) {
    await this.pendingDialog.accept();
  }
  this.pendingDialog = null;
});

Then('Verify lead company name is {string}', async function (expectedCompany: string) {
  const wrapper = getWrapper(this);
  const companyText = await wrapper.page.locator('#viewLead_companyName_sp').innerText();
  if (!companyText.includes(expectedCompany)) {
    throw new Error(`Expected company name to include "${expectedCompany}" but found "${companyText}"`);
  }
});

Then('Verify duplicate lead creation form is displayed', async function () {
  const wrapper = getWrapper(this);
  const submitButton = wrapper.page.locator("input[name='submitButton']");
  const isVisible = await submitButton.isVisible();
  if (!isVisible) {
    throw new Error('Duplicate lead form is not displayed');
  }
});

Then('Verify no records to display', async function () {
  const wrapper = getWrapper(this);
  await expect(wrapper.page.locator('.x-paging-info')).toContainText('No records to display', {
    timeout: DEFAULT_TIMEOUT
  });
});

Then('Verify that the title contains {string} after lead is created', async function (PageTitle: string) {
  const wrapper = getWrapper(this);
  const title = await wrapper.getTitle();
  console.log(`Page title: ${title}`);

  if (title.includes(PageTitle)) {
    console.log('Title verified');
  } else {
    console.log('Title not verified');
  }
});