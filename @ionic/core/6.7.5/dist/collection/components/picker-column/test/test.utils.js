/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { expect } from '@playwright/test';
/**
 * Visual regression tests for picker-column.
 * @param page - The page to run the tests on.
 * @param buttonSelector - The selector for the button that opens the picker.
 * @param description - The description to amend to the screenshot names (typically 'single' or 'multiple').
 */
export async function testPickerColumn(page, buttonSelector, description) {
  const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');
  await page.click(buttonSelector);
  await ionPickerDidPresentSpy.next();
  await page.waitForChanges();
  await expect(page).toHaveScreenshot(`picker-${description}-column-initial-${page.getSnapshotSettings()}.png`);
  // TODO FW-3403
  /*
  const columns = page.locator('.picker-opt-selected');
  const spy = await page.spyOnEvent('ionPickerColChange');

  const screenshots = [];

  for (let i = 0; i < (await columns.count()); i++) {
    const column = columns.nth(i);

    await dragElementBy(column, page, 0, -100);
    await spy.next();

    await page.waitForChanges();

    screenshots.push({
      name: `picker-${description}-column-diff-${i}-${page.getSnapshotSettings()}.png`,
      screenshot: await page.screenshot(),
    });
  }

  for (const screenshot of screenshots) {
    expect(screenshot.screenshot).toMatchSnapshot(screenshot.name);
  }
  */
}
