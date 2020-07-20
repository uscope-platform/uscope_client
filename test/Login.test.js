const puppeteer = require('puppeteer');

describe('Login', () => {
    let browser;
    let page;

    beforeEach(async (done) => {
        browser = await puppeteer.launch({
            headless: true
        });
        page = await browser.newPage();

        await page.goto('http://localhost:3004/');
        await page.waitForSelector('#root');

        done();
    });

    afterEach(async (done) => {
        await browser.close();
        done();
    });


    test('successful login', async () => {

        await page.type('input[name=username]', 'filssavi', {delay: 20})
        await page.type('input[name=password]', 'TETTE GROSSE', {delay: 20})

        await page.click('[name=sign_in_button]');

        await page.waitForSelector('#app_chooser_title');
        const title = await page.$('#app_chooser_title');
        const text = await page.evaluate(element => element.textContent, title);
        expect(text).toBe('Application Choice');

    }, 16000);

    test('Application Chooser', async () =>{
        await page.type('input[name=username]', 'filssavi', {delay: 20})
        await page.type('input[name=password]', 'TETTE GROSSE', {delay: 20})

        await page.click('[name=sign_in_button]');
        await page.waitForSelector('#app_chooser_title');
        const form = await page.$('#application_chooser_form');
        await form.evaluate(form => form.submit());
    })


    test('failed login', async () => {

        await page.type('input[name=username]', 'f', {delay: 20})
        await page.type('input[name=password]', 'E', {delay: 20})

        page.on('dialog', async dialog => {
            await dialog.dismiss();
        });

        await page.click('[name=sign_in_button]');

        await page.waitForSelector('#login_page_title');
        const title = await page.$('#login_page_title');
        const text = await page.evaluate(element => element.textContent, title);
        expect(text).toBe('Please Sign In');

    }, 16000);


    test('remain logged', async () => {

        await page.type('input[name=username]', 'filssavi', {delay: 20})
        await page.type('input[name=password]', 'TETTE GROSSE', {delay: 20})
        await page.click('[name=remember_me]');
        await page.click('[name=sign_in_button]');
        await page.waitForSelector('#app_chooser_title');

        await page.goto('http://localhost:3004/');

        await page.waitForSelector('#app_chooser_title');
        const title = await page.$('#app_chooser_title');
        const text = await page.evaluate(element => element.textContent, title);
        expect(text).toBe('Application Choice');

    }, 16000);

});