# System Testing ด้วย Playwright บน SauceDemo

เอกสารนี้จัดทำขึ้นสำหรับนักศึกษาเพื่อเรียนรู้ **System Testing** โดยใช้เว็บไซต์

https://www.saucedemo.com/

เป็นระบบตัวอย่าง และใช้ **Playwright** ควบคุม Browser เพื่อทดสอบระบบจากมุมมองของผู้ใช้จริง

> เอกสารนี้เน้น **Functional System Testing แบบ Black-box** คือทดสอบพฤติกรรมของระบบที่ประกอบเสร็จแล้ว โดยไม่เข้าไปทดสอบ Module ภายในทีละส่วน

---

# 1\. System Testing คืออะไร

System Testing คือการทดสอบ **ระบบที่ประกอบทุกส่วนเข้าด้วยกันแล้ว** เพื่อดูว่าระบบทั้งหมดสามารถทำงานตามความต้องการได้หรือไม่

สำหรับ SauceDemo เราไม่ได้สนใจเฉพาะว่า Login ทำงานหรือ Cart ทำงาน แต่สนใจว่า **ผู้ใช้สามารถเริ่มจาก Login แล้วทำงานต่อเนื่องจนซื้อสินค้าสำเร็จได้หรือไม่**

User

 |

 v

Login

 |

 v

Inventory

 |

 v

Cart

 |

 v

Checkout

 |

 v

Checkout Overview

 |

 v

Finish Order

 |

 v

Order Complete

## จุดสำคัญ

Unit Test

\= ทดสอบ Function / Class เล็ก ๆ

Integration Test

\= ทดสอบการเชื่อมต่อระหว่าง Module / Layer

System Test

\= ทดสอบระบบทั้งหมดจากภายนอก

---

# 2\. Diagram ของ System Testing บน SauceDemo

                         SYSTEM TESTING

                     \+----------------+

                     |   Playwright   |

                     |  Test Script   |

                     \+----------------+

                             |

                             v

                     \+----------------+

                     |    Browser     |

                     \+----------------+

                             |

                             v

\+----------------------------------------------------------------+

|                     SauceDemo System                           |

|                                                                |

|   \+---------+     \+-----------+     \+------+     \+-----------+ |

|   |  Login  | \--\> | Inventory | \--\> | Cart | \--\> | Checkout  | |

|   \+---------+     \+-----------+     \+------+     \+-----------+ |

|                                                      |         |

|                                                      v         |

|                                              \+---------------+ |

|                                              |   Overview    | |

|                                              \+---------------+ |

|                                                      |         |

|                                                      v         |

|                                              \+---------------+ |

|                                              | Finish Order  | |

|                                              \+---------------+ |

|                                                      |         |

|                                                      v         |

|                                              \+---------------+ |

|                                              | Order Complete| |

|                                              \+---------------+ |

\+----------------------------------------------------------------+

## อธิบาย Diagram

1. **Playwright** ทำหน้าที่เป็นเครื่องมือทดสอบจากภายนอกระบบ  
2. Playwright ควบคุม **Browser** เหมือนผู้ใช้จริง  
3. Browser ติดต่อ SauceDemo จริง  
4. Test เดินผ่านระบบจริงตั้งแต่ Login ไปจนถึง Order Complete  
5. เราไม่แทน Login, Inventory, Cart หรือ Checkout ด้วย Stub  
6. เราตรวจผลที่ผู้ใช้สามารถสังเกตได้ เช่น URL, ข้อความ, จำนวนสินค้า และสถานะของ Cart

---

# 3\. System Test ต่างจาก Integration Test อย่างไร

## Integration Testing

             Integration Test

        \+---------+     \+-----------+

        |  Login  | \--\> | Inventory |

        \+---------+     \+-----------+

สนใจว่า Login เชื่อมกับ Inventory ถูกหรือไม่

หรือ

        \+-----------+     \+------+

        | Inventory | \--\> | Cart |

        \+-----------+     \+------+

สนใจว่า Inventory ส่งสถานะสินค้าไป Cart ถูกหรือไม่

## System Testing

                    System Test

START

  |

  v

Login

  |

  v

Inventory

  |

  v

Cart

  |

  v

Checkout

  |

  v

Overview

  |

  v

Finish

  |

  v

END

System Test จึงมองระบบทั้งหมดเป็น **กล่องดำ (Black-box)**

---

# 4\. Driver และ Stub ใน System Testing

ใน Classical Integration Testing เราอาจมี

Driver

  |

  v

Real Module

  |

  v

Stub

แต่ในการทำ System Test ของ SauceDemo ในเอกสารนี้ เราจะ **ไม่ใช้ Driver หรือ Stub เพื่อแทน Module ภายในระบบ** เพราะต้องการทดสอบระบบจริงทั้งหมด

                    SYSTEM TEST

Playwright Test Harness

        |

        v

     Browser

        |

        v

\+-------------------------------+

|       SauceDemo REAL          |

|                               |

| Login                         |

|   |                           |

|   v                           |

| Inventory                     |

|   |                           |

|   v                           |

| Cart                          |

|   |                           |

|   v                           |

| Checkout                      |

|   |                           |

|   v                           |

| Finish                        |

\+-------------------------------+

> Playwright ในที่นี้เป็น **External Test Harness** หรือผู้ควบคุมการทดสอบจากภายนอก ไม่ใช่ Driver test double ที่นำไปแทน Module ภายในระบบ

---

# 5\. เตรียม Project Playwright

## 5.1 ตรวจสอบ Node.js

node \-v

npm \-v

## 5.2 สร้าง Project

mkdir saucedemo-system-test

cd saucedemo-system-test

## 5.3 ติดตั้ง Playwright

npm init playwright@latest

แนะนำให้เลือก

TypeScript

Tests folder: tests

Install Playwright browsers: Yes

## 5.4 ตรวจสอบการติดตั้ง

npx playwright \--version

---

# 6\. ตั้งค่า playwright.config.ts

เปิดไฟล์

playwright.config.ts

แล้วใช้ Code นี้ได้เลย

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  use: {

    baseURL: 'https://www.saucedemo.com',

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

  },

  projects: \[

    {

      name: 'chromium',

      use: { ...devices\['Desktop Chrome'\] },

    },

  \],

});

ข้อดีของ `baseURL` คือใน Test สามารถเขียน

await page.goto('/');

แทน

await page.goto('https://www.saucedemo.com/');

---

# 7\. โครงสร้างไฟล์ที่ใช้ในบทเรียน

saucedemo-system-test/

|

\+-- playwright.config.ts

|

\+-- tests/

    |

    \+-- system/

        |

        \+-- 01-full-purchase.spec.ts

        \+-- 02-locked-user.spec.ts

        \+-- 03-checkout-validation.spec.ts

        \+-- 04-cart-state.spec.ts

แต่ละไฟล์ด้านล่างสามารถ **Copy-Paste แล้ว Run แยกได้ทันที**

---

# 8\. System Test 1: Full Purchase Flow

## 8.1 วัตถุประสงค์

ทดสอบ Happy Path ของระบบทั้งหมด ตั้งแต่ผู้ใช้เปิดเว็บไซต์จนซื้อสินค้าสำเร็จ

## 8.2 Diagram

START

  |

  v

\+---------+

|  Login  |

\+---------+

  |

  v

\+-------------+

|  Inventory  |

\+-------------+

  |

  | Add Product

  v

\+---------+

|  Cart   |

\+---------+

  |

  v

\+-------------+

|  Checkout   |

\+-------------+

  |

  | Customer Information

  v

\+-------------+

|  Overview   |

\+-------------+

  |

  | Finish

  v

\+----------------+

| Order Complete |

\+----------------+

  |

  v

END

## 8.3 สิ่งที่ Test ตรวจ

1\. เปิดเว็บไซต์ได้

2\. Login สำเร็จ

3\. Inventory แสดงสินค้า

4\. เพิ่มสินค้าเข้า Cart ได้

5\. Cart เก็บสินค้าที่เลือกไว้

6\. Checkout รับข้อมูลลูกค้า

7\. Overview ยังแสดงสินค้าที่เลือก

8\. Finish Order สำเร็จ

9\. ระบบแสดง Thank you message

## 8.4 สร้างไฟล์

tests/system/01-full-purchase.spec.ts

## 8.5 Playwright Code

import { test, expect } from '@playwright/test';

test('ST-01: User ซื้อสินค้าตั้งแต่ Login จน Finish ได้สำเร็จ', async ({ page }) \=\> {

  // \=====================================================

  // Step 1: Open System

  // \=====================================================

  await page.goto('/');

  await expect(page).toHaveTitle(/Swag Labs/);

  await expect(page.locator('\#user-name')).toBeVisible();

  // \=====================================================

  // Step 2: Login

  // \=====================================================

  await page.locator('\#user-name').fill('standard\_user');

  await page.locator('\#password').fill('secret\_sauce');

  await page.locator('\#login-button').click();

  await expect(page).toHaveURL(/inventory\\.html/);

  await expect(page.locator('.inventory\_list')).toBeVisible();

  // \=====================================================

  // Step 3: Check Inventory

  // \=====================================================

  await expect(page.locator('.inventory\_item')).toHaveCount(6);

  // \=====================================================

  // Step 4: Add Product to Cart

  // \=====================================================

  await page

    .locator('\[data-test="add-to-cart-sauce-labs-backpack"\]')

    .click();

  await expect(page.locator('.shopping\_cart\_badge')).toHaveText('1');

  // \=====================================================

  // Step 5: Open Cart

  // \=====================================================

  await page.locator('.shopping\_cart\_link').click();

  await expect(page).toHaveURL(/cart\\.html/);

  await expect(page.locator('.inventory\_item\_name'))

    .toHaveText('Sauce Labs Backpack');

  // \=====================================================

  // Step 6: Start Checkout

  // \=====================================================

  await page.locator('\[data-test="checkout"\]').click();

  await expect(page).toHaveURL(/checkout-step-one\\.html/);

  // \=====================================================

  // Step 7: Fill Customer Information

  // \=====================================================

  await page.locator('\#first-name').fill('John');

  await page.locator('\#last-name').fill('Doe');

  await page.locator('\#postal-code').fill('50000');

  await page.locator('\[data-test="continue"\]').click();

  // \=====================================================

  // Step 8: Check Checkout Overview

  // \=====================================================

  await expect(page).toHaveURL(/checkout-step-two\\.html/);

  await expect(page.locator('.inventory\_item\_name'))

    .toHaveText('Sauce Labs Backpack');

  await expect(page.locator('.summary\_info')).toBeVisible();

  // \=====================================================

  // Step 9: Finish Order

  // \=====================================================

  await page.locator('\[data-test="finish"\]').click();

  // \=====================================================

  // Step 10: Verify Final Result

  // \=====================================================

  await expect(page).toHaveURL(/checkout-complete\\.html/);

  await expect(page.locator('.complete-header'))

    .toHaveText('Thank you for your order\!');

});

## 8.6 Run

npx playwright test tests/system/01-full-purchase.spec.ts

ดู Browser ขณะ Run

npx playwright test tests/system/01-full-purchase.spec.ts \--headed

## 8.7 Expected Result

1 passed

## 8.8 ทำไมตัวอย่างนี้เป็น System Test

เพราะ Test ไม่ได้หยุดแค่ Login หรือ Cart แต่เดินผ่านหลายความสามารถของระบบจริงใน Scenario เดียว

Login

 \+

Inventory

 \+

Cart

 \+

Checkout

 \+

Order Complete

\= System Behavior

---

# 9\. System Test 2: Locked User

System Testing ต้องมีทั้ง **Happy Path** และ **Error / Negative Path**

## 9.1 วัตถุประสงค์

ตรวจสอบว่าระบบปฏิเสธผู้ใช้ที่ถูก Lock และไม่อนุญาตให้เข้าสู่ Inventory

## 9.2 Diagram

START

  |

  v

\+------------------+

| Enter Locked User|

\+------------------+

  |

  v

\+------------------+

| Click Login      |

\+------------------+

  |

  v

        \+-----------------------+

        | Authentication Check  |

        \+-----------------------+

                 |

                 v

              \[DENIED\]

                 |

          \+------+------+

          |             |

          v             v

   Error Message    Stay at Login

          |

          v

         END

## 9.3 สร้างไฟล์

tests/system/02-locked-user.spec.ts

## 9.4 Playwright Code

import { test, expect } from '@playwright/test';

test('ST-02: Locked User ไม่สามารถเข้าใช้งานระบบได้', async ({ page }) \=\> {

  // Arrange

  await page.goto('/');

  // Act

  await page.locator('\#user-name').fill('locked\_out\_user');

  await page.locator('\#password').fill('secret\_sauce');

  await page.locator('\#login-button').click();

  // Assert: ระบบต้องแสดง Error

  await expect(page.locator('\[data-test="error"\]'))

    .toContainText('Sorry, this user has been locked out');

  // Assert: ระบบต้องไม่เข้าสู่ Inventory

  await expect(page).not.toHaveURL(/inventory\\.html/);

  // Assert: Login form ยังอยู่

  await expect(page.locator('\#user-name')).toBeVisible();

});

## 9.5 Run

npx playwright test tests/system/02-locked-user.spec.ts

## 9.6 Expected Result

1 passed

---

# 10\. System Test 3: Checkout Validation

## 10.1 วัตถุประสงค์

ตรวจสอบว่าเมื่อผู้ใช้ผ่าน Login, เลือกสินค้า และเข้าสู่ Checkout แล้ว ระบบไม่อนุญาตให้ไปต่อหากข้อมูลลูกค้าไม่ครบ

## 10.2 Diagram

Login

  |

  v

Inventory

  |

  | Add Product

  v

Cart

  |

  v

Checkout Form

  |

  | ไม่กรอก First Name

  v

Click Continue

  |

  v

\+-----------------------+

| System Validation     |

\+-----------------------+

  |

  \+------------------------------+

  |                              |

  v                              v

Show Error                 Stay on Checkout

## 10.3 สร้างไฟล์

tests/system/03-checkout-validation.spec.ts

## 10.4 Playwright Code

import { test, expect } from '@playwright/test';

test('ST-03: Checkout ต้องตรวจสอบข้อมูลที่จำเป็น', async ({ page }) \=\> {

  // \=====================================================

  // Login

  // \=====================================================

  await page.goto('/');

  await page.locator('\#user-name').fill('standard\_user');

  await page.locator('\#password').fill('secret\_sauce');

  await page.locator('\#login-button').click();

  await expect(page).toHaveURL(/inventory\\.html/);

  // \=====================================================

  // Add Product

  // \=====================================================

  await page

    .locator('\[data-test="add-to-cart-sauce-labs-backpack"\]')

    .click();

  await expect(page.locator('.shopping\_cart\_badge')).toHaveText('1');

  // \=====================================================

  // Cart

  // \=====================================================

  await page.locator('.shopping\_cart\_link').click();

  await expect(page).toHaveURL(/cart\\.html/);

  // \=====================================================

  // Checkout

  // \=====================================================

  await page.locator('\[data-test="checkout"\]').click();

  await expect(page).toHaveURL(/checkout-step-one\\.html/);

  // \=====================================================

  // ไม่กรอกข้อมูล แล้วกด Continue

  // \=====================================================

  await page.locator('\[data-test="continue"\]').click();

  // \=====================================================

  // Validation Result

  // \=====================================================

  await expect(page.locator('\[data-test="error"\]'))

    .toContainText('First Name is required');

  // ต้องยังอยู่หน้า Checkout Step One

  await expect(page).toHaveURL(/checkout-step-one\\.html/);

});

## 10.5 Run

npx playwright test tests/system/03-checkout-validation.spec.ts

## 10.6 Expected Result

1 passed

---

# 11\. System Test 4: Cart State

## 11.1 วัตถุประสงค์

ตรวจสอบว่าระบบรักษาสถานะของ Cart ถูกต้องเมื่อผู้ใช้เพิ่มสินค้า 2 รายการ แล้วลบออก 1 รายการ

## 11.2 Diagram

Login

  |

  v

Inventory

  |

  \+---------------------------+

  |                           |

  v                           v

Add Backpack              Add Bike Light

  |                           |

  \+-------------+-------------+

                |

                v

           Cart Badge \= 2

                |

                v

             Cart

                |

                v

       Remove Bike Light

                |

                v

           Cart Badge \= 1

                |

                v

     Backpack must remain

## 11.3 สร้างไฟล์

tests/system/04-cart-state.spec.ts

## 11.4 Playwright Code

import { test, expect } from '@playwright/test';

test('ST-04: Cart รักษาสถานะสินค้าได้ถูกต้อง', async ({ page }) \=\> {

  // \=====================================================

  // Login

  // \=====================================================

  await page.goto('/');

  await page.locator('\#user-name').fill('standard\_user');

  await page.locator('\#password').fill('secret\_sauce');

  await page.locator('\#login-button').click();

  await expect(page).toHaveURL(/inventory\\.html/);

  // \=====================================================

  // Add 2 Products

  // \=====================================================

  await page

    .locator('\[data-test="add-to-cart-sauce-labs-backpack"\]')

    .click();

  await page

    .locator('\[data-test="add-to-cart-sauce-labs-bike-light"\]')

    .click();

  await expect(page.locator('.shopping\_cart\_badge')).toHaveText('2');

  // \=====================================================

  // Open Cart

  // \=====================================================

  await page.locator('.shopping\_cart\_link').click();

  await expect(page).toHaveURL(/cart\\.html/);

  await expect(page.locator('.cart\_item')).toHaveCount(2);

  // \=====================================================

  // Remove Bike Light

  // \=====================================================

  await page

    .locator('\[data-test="remove-sauce-labs-bike-light"\]')

    .click();

  // \=====================================================

  // Verify Cart State

  // \=====================================================

  await expect(page.locator('.shopping\_cart\_badge')).toHaveText('1');

  await expect(page.locator('.cart\_item')).toHaveCount(1);

  await expect(page.locator('.inventory\_item\_name'))

    .toHaveText('Sauce Labs Backpack');

  await expect(page.getByText('Sauce Labs Bike Light', { exact: true }))

    .toHaveCount(0);

});

## 11.5 Run

npx playwright test tests/system/04-cart-state.spec.ts

## 11.6 Expected Result

1 passed

---

# 12\. Run System Test ทั้งหมด

npx playwright test tests/system

Expected Result

4 passed

ถ้าต้องการดู Browser

npx playwright test tests/system \--headed

ถ้าต้องการ Debug

npx playwright test tests/system/01-full-purchase.spec.ts \--debug

ดู Report

npx playwright show-report

---

# 13\. Arrange \- Act \- Assert ใน System Test

แม้ System Test จะมีหลาย Step แต่เรายังสามารถใช้แนวคิด AAA เพื่อให้อ่านง่ายได้

Arrange

   |

   v

เตรียมข้อมูล / เปิดระบบ / Login

Act

   |

   v

ทำ Business Flow

เช่น Add Cart \-\> Checkout \-\> Finish

Assert

   |

   v

ตรวจผลลัพธ์ของระบบ

ตัวอย่างสั้น

import { test, expect } from '@playwright/test';

test('AAA example', async ({ page }) \=\> {

  // Arrange

  await page.goto('/');

  await page.locator('\#user-name').fill('standard\_user');

  await page.locator('\#password').fill('secret\_sauce');

  // Act

  await page.locator('\#login-button').click();

  // Assert

  await expect(page).toHaveURL(/inventory\\.html/);

});

ใน Full System Test อาจมี Assert ระหว่างทางด้วย เพราะเราต้องการตรวจว่าแต่ละ Checkpoint สำคัญของ Business Flow ยังถูกต้องก่อนเดินต่อ

---

# 14\. Test Case Table สำหรับนักศึกษา

| ID | System Scenario | Input | Expected Result |
| :---- | :---- | :---- | :---- |
| ST-01 | Complete Purchase | `standard_user` \+ สินค้า 1 รายการ | Order สำเร็จและแสดง Thank you |
| ST-02 | Locked User | `locked_out_user` | Login ถูกปฏิเสธและแสดง Error |
| ST-03 | Checkout Validation | ไม่กรอก First Name | แสดง `First Name is required` |
| ST-04 | Cart State | Add 2, Remove 1 | Cart เหลือ 1 รายการถูกต้อง |

---

# 15\. System Test Coverage จากตัวอย่าง

\+--------------------+------------------------------------+

| System Feature     | Test ที่ครอบคลุม                  |

\+--------------------+------------------------------------+

| Login Success      | ST-01, ST-03, ST-04               |

| Login Failure      | ST-02                              |

| Inventory          | ST-01, ST-03, ST-04               |

| Add to Cart        | ST-01, ST-03, ST-04               |

| Remove from Cart   | ST-04                              |

| Cart State         | ST-01, ST-04                      |

| Checkout Form      | ST-01, ST-03                      |

| Validation         | ST-03                              |

| Checkout Overview  | ST-01                              |

| Finish Order       | ST-01                              |

\+--------------------+------------------------------------+

---

# 16\. สิ่งที่นักศึกษาควรสังเกตจาก Playwright Code

## 16.1 Playwright ทำตัวเหมือนผู้ใช้จริง

ผู้ใช้จริง                       Playwright

\------------------------------------------------

เปิดเว็บ                         page.goto()

กรอก Username                   locator.fill()

กดปุ่ม                           locator.click()

ดู URL                          expect(page).toHaveURL()

ดูข้อความ                       expect(locator).toHaveText()

ดูจำนวนสินค้า                   expect(locator).toHaveCount()

## 16.2 System Test ควรตรวจ Business Result

อย่าตรวจเพียงว่า

ปุ่ม Login กดได้

ควรตรวจว่า

กด Login

   |

   v

เข้าสู่ Inventory จริง

   |

   v

สามารถทำงานต่อในระบบได้

## 16.3 ไม่ควรใช้ Stub หากต้องการพิสูจน์ Full System Flow

ตัวอย่างที่ไม่ใช่เป้าหมายของ System Test นี้

Login REAL

   |

   v

Inventory STUB

   |

   v

Cart STUB

เพราะเราจะไม่รู้ว่า Inventory และ Cart จริงสามารถทำงานร่วมกับ Login จริงได้หรือไม่

เป้าหมายของเอกสารนี้คือ

Login REAL

   |

   v

Inventory REAL

   |

   v

Cart REAL

   |

   v

Checkout REAL

---

# 17\. System Test ไม่จำเป็นต้องมีเพียง Happy Path

System Testing ควรออกแบบให้ครอบคลุมหลายประเภทของ Scenario

                   System Test

                        |

        \+---------------+---------------+

        |               |               |

        v               v               v

    Happy Path      Error Path      Validation

        |               |               |

        v               v               v

 Purchase Success   Locked User    Missing Data

ตัวอย่างในเอกสารนี้จึงมีทั้ง

ST-01  Happy Path

ST-02  Authentication Error

ST-03  Validation Error

ST-04  State / Business Rule

---

# 18\. แนวทางให้นักศึกษาสร้าง System Test เพิ่ม

ลองสร้าง Test เพิ่มจาก Requirement ต่อไปนี้

## แบบฝึกหัด 1: Sort Product

Login

  |

  v

Inventory

  |

  v

Select Price Low to High

  |

  v

Verify prices are ascending

## แบบฝึกหัด 2: Remove Product ก่อน Checkout

Login

  |

  v

Add 2 Products

  |

  v

Cart

  |

  v

Remove 1 Product

  |

  v

Checkout

  |

  v

Overview ต้องเหลือเพียง 1 Product

## แบบฝึกหัด 3: Missing Postal Code

Login

  |

  v

Add Product

  |

  v

Checkout

  |

  v

กรอก First Name \+ Last Name

แต่ไม่กรอก Postal Code

  |

  v

Expected: Postal Code is required

---

# 19\. คำถามทบทวน

1. System Testing ต่างจาก Integration Testing อย่างไร?  
2. เพราะเหตุใด System Test ของ SauceDemo จึงไม่ควร Stub Inventory หากเราต้องการทดสอบ Full Purchase Flow?  
3. ใน ST-01 มี System Feature ใดบ้างที่ทำงานร่วมกัน?  
4. ST-02 เป็น Happy Path หรือ Negative Path?  
5. เพราะเหตุใดเราควร Assert URL หลัง Login?  
6. เพราะเหตุใด ST-03 ต้อง Login และ Add Cart ก่อนตรวจ Checkout Validation?  
7. Playwright ทำหน้าที่เป็น Module ภายใน SauceDemo หรือเป็น Test Harness ภายนอก?  
8. ถ้า Cart Badge เป็น `2` แต่หน้า Cart มีสินค้าเพียง `1` รายการ ระบบควรถือว่าผ่านหรือไม่ เพราะเหตุใด?

---

# 20\. สรุปสำหรับนักศึกษา

Integration Testing

\---------------------------------------

สนใจการเชื่อมต่อระหว่าง Module

A \-\> B

B \-\> C

อาจใช้ Driver / Stub

System Testing

\---------------------------------------

สนใจระบบทั้งหมด

User

 |

 v

Login

 |

 v

Inventory

 |

 v

Cart

 |

 v

Checkout

 |

 v

Complete

ใช้ระบบจริงทุกส่วนใน Scope ที่ต้องการทดสอบ

จำง่าย ๆ ว่า

> **Integration Test ถามว่า "ส่วนต่าง ๆ เชื่อมกันได้ไหม?"**  
>   
> **System Test ถามว่า "เมื่อนำทุกส่วนมารวมกันแล้ว ผู้ใช้สามารถใช้งานระบบตาม Scenario ได้จริงไหม?"**

สำหรับ SauceDemo ตัวอย่าง System Test ที่ชัดที่สุดคือ

Login

  |

  v

เลือกสินค้า

  |

  v

Cart

  |

  v

Checkout

  |

  v

Finish

  |

  v

Thank you for your order\!

เมื่อ Flow นี้ผ่าน แสดงว่า Feature สำคัญหลายส่วนของระบบสามารถทำงานร่วมกันได้จากมุมมองของผู้ใช้