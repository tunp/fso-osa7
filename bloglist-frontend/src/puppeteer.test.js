import puppeteer from 'puppeteer'

describe('puppeteer test', () => {
    let browser, page
    beforeEach(async () => {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            //headless: false,
            //slowMo: 250
        })
        page = await browser.newPage()
        await page.goto('http://localhost:3000/')
        // user should be in db before doing this test
        await page.type('input[name="username"]', "firstuser")
        await page.type('input[name="password"]', "passpass")
        await page.click('form button')
        await page.waitForSelector('.logged_in_container')
    })
    it('deletes a blog', async () => {
        const title = "test_title_1"
        await page.click('.show_button')
        await page.type('input[name="title"]', title)
        await page.type('input[name="author"]', "test_author_1")
        await page.type('input[name="url"]', "test_url_1")
        await page.click('.content_drop form button')
        await page.waitForSelector('.show_button', { visible: 1 })
        const before_count = await page.evaluate((title) => { return document.querySelectorAll('[data-title="'+title+'"]').length }, title)
        await page.click('[data-title="'+title+'"]')
        await page.waitForSelector('.title_author')
        // confirm dialog is hard to click from the puppeteer api so override the dialog
        await page.evaluate(() => { window.confirm = () => { return true } })
        await page.click('.delete_button')
        await page.waitForSelector('.blog_list')
        //await page.waitFor(5000)

        const after_count = await page.evaluate((title) => { return document.querySelectorAll('[data-title="'+title+'"]').length }, title)

        expect(before_count - after_count).toBe(1)
    })
    it('comments a blog', async () => {
        const id = Math.floor(Math.random() * 0xffff)
        const title = "test_title_"+id
        const test_comment = 'testi kommentti ' + id
        await page.click('.show_button')
        await page.type('input[name="title"]', title)
        await page.type('input[name="author"]', "test_author_"+id)
        await page.type('input[name="url"]', "test_url_"+id)
        await page.click('.content_drop form button')
        await page.waitForSelector('.show_button', { visible: 1 })
        await page.click('[data-title="'+title+'"]')
        await page.waitForSelector('.title_author')
        await page.type('.comment_input', test_comment)
        await page.click('.add_comment_button')
        await page.waitForSelector('.comment')
        const comments = await page.$eval('.comments', (el) => { return el.textContent })
        expect(comments.includes(test_comment)).toBe(true)
    })
})

