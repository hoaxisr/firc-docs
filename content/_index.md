---
title: firc
toc: false
---

<div style="display:flex;flex-direction:column;align-items:center;text-align:center;">

<div class="hx-mt-6"></div>

{{< hextra/hero-badge link="https://github.com/hoaxisr/firc/releases/latest" >}}
<div class="hx-w-2 hx-h-2 hx-rounded-full hx-bg-primary-400"></div>
Свежий релиз →
{{< /hextra/hero-badge >}}

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-headline >}}
Маршрутизация по доменам,<br/>а не по адресам
{{< /hextra/hero-headline >}}
</div>

<div class="hx-mb-12">
{{< hextra/hero-subtitle >}}
firc для роутеров Keenetic уводит в туннель ровно те сайты, которые вы назвали, и ничего лишнего. Пакет около мегабайта, свой клиент VLESS, настройка из браузера.
{{< /hextra/hero-subtitle >}}
</div>

<div class="hx-mb-6">
{{< hextra/hero-button text="Установка" link="install" >}}
&nbsp;&nbsp;
{{< hextra/hero-button text="Как это работает" link="how-it-works" style="background: transparent; border: 1px solid currentColor; color: inherit;" >}}
</div>

</div>

<div class="hx-mt-12"></div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Маршрут по домену"
    subtitle="Решение принимается по имени сайта, а не по адресу из ответа DNS. Сайты за одним CDN больше не тянут друг друга в туннель."
    link="how-it-works"
  >}}
  {{< hextra/feature-card
    title="Свой VLESS"
    subtitle="Встроенный клиент tunvless на C с REALITY, gRPC и xhttp. На роутере MT7621 он несёт весь канал одним потоком процессора."
    link="guide/tunnels"
  >}}
  {{< hextra/feature-card
    title="Лёгкий"
    subtitle="Пакет около 1 МБ, демон занимает 5–12 МБ памяти даже на 100 000 правил. Без Go и без интерпретаторов."
    link="#цифры"
  >}}
{{< /hextra/feature-grid >}}

## Почему по домену

Возьмём два сайта: **chatgpt.com** нужно пустить через туннель, а **api.ipify.org** (он показывает ваш внешний адрес) пусть идёт напрямую. Оба живут за Cloudflare.

Обычная схема маршрутизирует по адресам: в ipset попадают IP из ответов DNS или готовые списки подсетей. В списках подсетей для ChatGPT лежит весь Cloudflare, поэтому в туннель уходит и api.ipify.org, хотя его нет ни в одном правиле. Так же страдает любой сайт за Cloudflare DNS proxy или другим CDN: у тысяч доменов одни и те же адреса.

firc решает по имени. chatgpt.com уходит в туннель, а api.ipify.org показывает адрес вашего провайдера. Как это устроено, показано на странице [Как это работает](how-it-works/).

## Цифры

Всё измерено на Keenetic KN-1810 (MT7621, 4 потока, 256 МБ ОЗУ).

| Что | Значение |
|---|---|
| Размер пакета | 1,0 МБ (aarch64), 0,97 МБ (mipsel, mips) |
| Память демона без правил | 5,2 МБ |
| Память демона на 100 000 правил | 11,9 МБ |
| Ответ DNS, домен под правилом | 2 мс (медиана) |
| DNS-запросов в секунду при задержке до 50 мс | около 1 000 |

Пакеты — релиз 0.4.1; память и DNS — замер 5 октября 2026.

### VLESS: tunvless и sing-box

Те же узлы REALITY (vision), канал роутера 83,5 Мбит/с вниз и 43,9 вверх, 4 потока, замер 5 октября 2026.

| Клиент | Вниз, Мбит/с | Вверх, Мбит/с | Процессор клиента |
|---|---:|---:|---:|
| без туннеля (весь канал) | 83,5 | 43,9 | — |
| **tunvless** | **84,4** | **40,1** | **98 %** (один поток) |
| sing-box 1.14.2, стек `system` | 34,5 | 35,8 | 332 % |
| sing-box 1.14.2, стек `gvisor` | 24,3 | 35,4 | 336 % |

tunvless упирается в канал, а не в процессор: на один занятый поток он прокачивает в восемь раз больше, чем sing-box. 100 % — это один из четырёх потоков процессора.
