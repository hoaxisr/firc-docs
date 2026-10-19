import { chromium, type Locator, type Page, type Route } from "npm:playwright@1.60.0";

const BASE = Deno.env.get("FIRC_UI") ?? "http://localhost:5173/";
const OUT = new URL("../static/img/ui/", import.meta.url).pathname;
await Deno.mkdir(OUT, { recursive: true });

type Opts = { backup?: boolean };

async function patch(route: Route, opts: Opts) {
  const res = await route.fetch();
  const type = res.headers()["content-type"] ?? "";
  if (!type.includes("json")) return route.fulfill({ response: res });
  let text = await res.text();
  text = text.replaceAll("Reborn VPN", "Reserve");
  const body = JSON.parse(text);
  const url = route.request().url();
  const groups = (list: any[]) =>
    list.map((g) => {
      const out = { ...g };
      if (out.liveReason === "tunnel-down") {
        out.live = true;
        delete out.liveReason;
      }
      if (opts.backup && Array.isArray(out.interface) && out.interface.length > 1) {
        const now = Math.floor(Date.now() / 1000);
        out.active = out.interface[1];
        out.interfaces = out.interface.map((name: string, i: number) => ({
          name,
          state: i === 0 ? "dead" : "alive",
          since: now - 420,
          error: i === 0 ? "no node answers" : "",
        }));
      }
      return out;
    });
  if (url.includes("/api/v1/groups") && Array.isArray(body.groups)) body.groups = groups(body.groups);
  if (url.endsWith("/api/v1/tunnels/state")) {
    body.tunnels = body.tunnels.map((tn: any) => ({
      ...tn,
      status: "up",
      backoffS: 0,
      groups: tn.device === "tunvless0" ? ["ChatGPT", "YouTube"] : tn.groups,
      active: tn.nodes.length ? [tn.nodes[0].name] : [],
      nodes: tn.nodes.map((n: any, k: number) => ({
        ...n,
        state: n.state === "excluded" ? n.state : k === 0 ? "active" : "reserve",
      })),
      rxBps: 1_250_000,
      txBps: 180_000,
    }));
  }
  return route.fulfill({ response: res, json: body });
}

const browser = await chromium.launch();

async function session(opts: Opts = {}): Promise<Page> {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
  });
  await ctx.addInitScript(() => localStorage.setItem("locale", JSON.stringify({ value: "ru" })));
  await ctx.route("**/api/v1/**", (r) => patch(r, opts));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("pageerror", e.message));
  await page.goto(BASE, { waitUntil: "networkidle" });
  const inputs = page.locator("input");
  await inputs.nth(0).fill("root");
  await inputs.nth(1).fill("keenetic");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Добавить группу" }).waitFor();
  await page.waitForTimeout(1500);
  return page;
}

const settle = (page: Page, ms = 600) => page.waitForTimeout(ms);

async function shot(page: Page, name: string, clip?: { x: number; y: number; width: number; height: number }) {
  await page.mouse.move(0, 0);
  await settle(page, 300);
  await page.screenshot({ path: OUT + name, clip });
  console.log("wrote", name);
}

async function element(target: Locator, name: string, pad = 0) {
  const page = target.page();
  await page.mouse.move(0, 0);
  await settle(page, 300);
  const box = await target.boundingBox();
  if (!box) throw new Error(`no box for ${name}`);
  await page.screenshot({
    path: OUT + name,
    clip: { x: 0, y: Math.max(0, box.y - pad), width: 1280, height: box.height + 2 * pad },
  });
  console.log("wrote", name);
}

async function tab(page: Page, name: string) {
  await page.getByText(name, { exact: true }).first().click();
  await settle(page, 800);
}

const group = (page: Page, name: string) =>
  page.locator(".group-wrapper").filter({ has: page.getByText(name, { exact: true }) }).first();

{
  const page = await session();
  await shot(page, "groups.png", { x: 0, y: 60, width: 1280, height: 530 });

  await page.getByRole("button", { name: "Развернуть все" }).click();
  await settle(page);
  await element(group(page, "ChatGPT"), "group-rules.png", 12);

  const tg = group(page, "Telegram");
  await tg.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 150));
  await settle(page);
  await element(tg, "group-subnets.png", 12);

  await tg.getByRole("button", { name: /UDP · 596/ }).click();
  await settle(page);
  const pop = await tg.boundingBox();
  await shot(page, "rule-ports.png", { x: 0, y: pop!.y - 12, width: 1280, height: 230 });
  await page.keyboard.press("Escape");
  await settle(page);

  await tg.locator('button[aria-label="Select"]').nth(1).click();
  await settle(page);
  const box = await tg.boundingBox();
  await shot(page, "rule-types.png", { x: 0, y: box!.y - 12, width: 1280, height: Math.min(800 - (box!.y - 12), 330) });
  await page.keyboard.press("Escape");
  await settle(page);

  await element(group(page, "Bad Bad Services"), "list-group.png", 12);

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  await page.getByRole("button", { name: "Свернуть все" }).click();
  await settle(page);

  await group(page, "ChatGPT").locator('button[aria-label="Select"]').first().click();
  await settle(page);
  await shot(page, "iface-list.png", { x: 0, y: 160, width: 1280, height: 360 });
  await page.keyboard.press("Escape");
  await settle(page);

  await group(page, "ChatGPT").getByRole("button", { name: "Настройки группы" }).click();
  await settle(page);
  await element(page.locator("[role=dialog]").last(), "group-settings.png", 16);
  await page.getByRole("button", { name: "DNS" }).click();
  await settle(page);
  await shot(page, "group-dns.png", { x: 0, y: 140, width: 1280, height: 520 });
  await page.keyboard.press("Escape");
  await settle(page);
  await page.keyboard.press("Escape");
  await settle(page);

  await group(page, "YouTube").getByRole("button", { name: "2 устройства" }).click();
  await settle(page, 1000);
  await element(page.locator("[role=dialog]").last(), "devices.png", 0);
  await page.getByText("Вручную", { exact: false }).last().click();
  await settle(page);
  await page.locator("#devices-allow").fill("192.168.1.0/28");
  await page.locator("#devices-deny").fill("192.168.1.9");
  await settle(page);
  const dialog = page.locator("[role=dialog]").last();
  await dialog.locator("#devices-deny").scrollIntoViewIfNeeded();
  await settle(page);
  await element(dialog, "devices-manual.png", 0);
  await page.getByRole("button", { name: "Отмена" }).last().click();
  await settle(page);

  await page.getByRole("button", { name: "Добавить группу" }).click();
  await settle(page);
  const nd = page.locator("[role=dialog]").last();
  await nd.locator("#gd-name").fill("Реклама");
  await nd.getByRole("switch", { name: "Список по URL" }).click();
  await settle(page);
  await nd.locator("#gd-url").fill("https://lists.example.invalid/ads.srs");
  for (let i = 0; i < 12; i++) {
    await nd.getByRole("button", { name: "Предпросмотр" }).click();
    await settle(page, 1200);
    const text = await nd.innerText();
    if (!text.includes("fetch failed") && !text.includes("нет ничего")) break;
  }
  await nd.getByText("Строки, не являющиеся правилами", { exact: false }).scrollIntoViewIfNeeded().catch(() => {});
  await element(nd, "list-dialog.png", 16);
  await page.keyboard.press("Escape");
  await settle(page);

  await tab(page, "Журнал");
  await shot(page, "journal.png");

  await page.getByRole("button", { name: "Захват 5 мин" }).click({ timeout: 3000 }).catch(() => {});
  await settle(page, 1000);
  for (const src of ["Ядро firc", "Туннели", "DNS"]) {
    await page.locator("main button:visible").filter({ hasText: new RegExp(`^${src}\\s*\\d+$`) }).first().click();
    await settle(page, 200);
  }
  await page.waitForFunction(() => document.body.innerText.includes("по SNI"), null, { timeout: 30000 });
  await settle(page, 800);
  await shot(page, "capture.png", { x: 0, y: 60, width: 1280, height: 440 });

  await tab(page, "Настройки");
  await page.mouse.move(0, 0);
  const dnsTop = (await page.getByText("DNS-прокси", { exact: true }).first().boundingBox())!.y;
  const nfTop = (await page.getByText("Netfilter", { exact: true }).first().boundingBox())!.y;
  await page.screenshot({ path: OUT + "settings.png", fullPage: true, clip: { x: 0, y: dnsTop - 24, width: 1280, height: nfTop - dnsTop + 8 } });
  console.log("wrote settings.png");
  const rows = page.locator("text=TTL ответов вне правил").locator("xpath=ancestor::*[.//input][1]");
  await rows.locator("input").first().fill("120");
  const pool = page.locator("text=Потолок TTL").locator("xpath=ancestor::*[.//input][1]");
  await pool.locator("input").first().fill("600");
  await settle(page);
  await page.getByRole("button", { name: "Сохранить" }).first().click();
  await settle(page, 800);
  await element(page.locator("[role=dialog]").last(), "settings-save.png", 16);
  await page.getByRole("button", { name: "Отмена" }).last().click();
  await settle(page);
  await page.getByRole("button", { name: "Сброс" }).first().click().catch(() => {});
  await settle(page);

  await page.getByRole("button", { name: /^Обновления:/ }).click();
  await settle(page, 1200);
  const popover = page.locator(".update-popover");
  const pb = await popover.boundingBox();
  await shot(page, "update-popover.png", { x: pb!.x - 16, y: pb!.y - 8, width: pb!.width + 32, height: pb!.height + 16 });
  await page.keyboard.press("Escape");
  await settle(page);
  await shot(page, "update-block.png", { x: 0, y: 125, width: 1280, height: 150 });

  await page.getByRole("button", { name: "Сведения о приложении" }).click();
  await settle(page);
  await element(page.locator("[role=dialog]").last(), "about.png", 16);
  await page.context().close();
}

{
  const page = await session({ backup: true });
  await page.locator(".iface-amber").first().hover();
  await settle(page, 800);
  await page.screenshot({ path: OUT + "iface-backup.png", clip: { x: 0, y: 160, width: 1280, height: 120 } });
  console.log("wrote iface-backup.png");
  await page.context().close();
}

{
  const page = await session();
  await tab(page, "Туннели");
  await settle(page, 1500);
  await shot(page, "tunnels.png", { x: 0, y: 128, width: 1280, height: 126 });
  await page.getByRole("button", { name: "Развернуть", exact: true }).click();
  await settle(page);
  await page.getByRole("button", { name: "Проверить все узлы сейчас" }).click();
  await settle(page, 2500);
  await page.mouse.move(0, 0);
  await settle(page, 400);
  const card = page.locator(".card[data-tunnel]").first();
  const cb = await card.boundingBox();
  const nodesTitle = await page.getByText("Отказоустойчивость", { exact: true }).boundingBox();
  await page.setViewportSize({ width: 1280, height: Math.ceil(cb!.y + cb!.height + 40) });
  await settle(page);
  await page.screenshot({ path: OUT + "tunnel-card.png", clip: { x: 0, y: cb!.y - 12, width: 1280, height: nodesTitle!.y - cb!.y + 4 } });
  console.log("wrote tunnel-card.png");
  await page.getByText("Дополнительно:").click();
  await page.mouse.move(0, 0);
  await settle(page);
  const cb2 = await card.boundingBox();
  await page.setViewportSize({ width: 1280, height: Math.ceil(cb2!.y + cb2!.height + 40) });
  await settle(page);
  const ft = await page.getByText("Отказоустойчивость", { exact: true }).boundingBox();
  await page.screenshot({ path: OUT + "tunnel-settings.png", clip: { x: 0, y: ft!.y - 16, width: 1280, height: cb2!.y + cb2!.height - ft!.y + 28 } });
  console.log("wrote tunnel-settings.png");
  await page.setViewportSize({ width: 1280, height: 800 });
  await settle(page);

  await page.getByRole("button", { name: "Подписка", exact: true }).click();
  await settle(page);
  const sd = page.locator("[role=dialog]").last();
  await sd.locator("input").nth(0).fill("Мой провайдер");
  await sd.locator("input").nth(1).fill("https://sub.example.invalid/feed");
  await sd.getByRole("button", { name: /Заголовки запроса/ }).click();
  await settle(page);
  await element(sd, "tunnel-subscription.png", 16);
  await page.keyboard.press("Escape");
  await settle(page);
  await page.context().close();
}

await browser.close();
