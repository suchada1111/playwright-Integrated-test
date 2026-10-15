import { test, expect, BrowserContext, Page } from '@playwright/test';

// =====================================================
// 2: สร้าง Driver สำหรับเปิดหน้า cart.html
// =====================================================
async function driverOpenCart(context: BrowserContext): Promise<Page> {
  // จำลอง Cookie สำหรับล็อกอิน
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/cart.html');
  return page;
}

// =====================================================
// 1: สร้าง Stub (cart.html) และทดสอบชื่อ-นามสกุล
// =====================================================
test('Homework: Integration Test with Stub and Driver', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await driverOpenCart(context);

  try {
    // Inject Stub HTML เข้าไปในหน้า cart.html พร้อมเพิ่มชื่อ-นามสกุล
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Stub Cart</title>
        </head>
        <body>
          <h1>Stub Cart Page</h1>
          <div class="cart_list" data-test="cart-stub-info">
            <span class="user-owner">สุชาดา บุบผา</span>
            <div class="inventory_item_name">Sauce Labs Backpack</div>
          </div>
        </body>
      </html>
    `);

    // เขียน Assert ตรวจสอบว่ามีชื่อ-นามสกุลอยู่ใน Stub จริงหรือไม่
    await expect(page.locator('[data-test="cart-stub-info"] .user-owner'))
      .toHaveText('สุชาดา บุบผา');

    // ตรวจสอบข้อมูลสินค้าใน Stub
    await expect(page.locator('.inventory_item_name'))
      .toHaveText('Sauce Labs Backpack');

  } finally {
    await context.close();
  }
});