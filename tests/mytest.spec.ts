// M1 - Нэвтрэх, буруу нууц үг болон бараа сагслах ажиллагааг шалгах

import { test, expect, Page } from '@playwright/test';

// Нэвтрэхэд ашиглах функц
async function login(page: Page) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
}

// 1. Амжилттай нэвтрэх
test('Зөв мэдээллээр нэвтрэх', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();

  // Системээс гарах
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

// 2. Буруу нууц үг
test('Буруу нууц үгээр нэвтрэх', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]'))
    .toContainText('Username and password do not match');

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

// 3. Нэвтрээд бараа сагслах
test('Бараа сагсанд нэмэх', async ({ page }) => {
  await login(page);

  await page.getByRole('button', {
    name: 'Add to cart',
    exact: false
  }).first().click();

  await expect(page.locator('.shopping_cart_badge'))
    .toHaveText('1');

  await page.locator('.shopping_cart_link').click();
  await expect(page.getByText('Your Cart')).toBeVisible();

  // Системээс гарах
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});