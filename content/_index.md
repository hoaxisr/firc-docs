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
    subtitle="Встроенный клиент tunvless на C с REALITY, gRPC и xhttp. На роутере MT7621 он прокачивает почти весь канал одним потоком процессора там, где sing-box и mihomo упираются в треть."
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

### VLESS: tunvless, sing-box и mihomo

Один и тот же сервер и узел VLESS с REALITY (vision), 4 потока, канал роутера 83,5 Мбит/с вниз и 43,9 вверх. Замер 19 октября 2026.

| Клиент | Вниз, Мбит/с | Вверх, Мбит/с | Процессор клиента | Память |
|---|---:|---:|---:|---:|
| без туннеля (весь канал) | 83,5 | 43,9 | — | — |
| **tunvless** | **79,2** | **43,2** | **94–100 %** | **6 МБ** |
| sing-box 1.14.3, стек `system` | 34,3 | 36,2 | 302–338 % | 54–64 МБ |
| sing-box 1.14.3, стек `gvisor` | 23,5 | 35,9 | 326–327 % | 54–64 МБ |
| mihomo 1.19.27, стек `system` | 34,7 | 35,6 | 338–359 % | 36–41 МБ |
| mihomo 1.19.27, стек `gvisor` | 23,1 | 26,3 | 334 % | до 59 МБ |

100 % — один из четырёх потоков процессора. С REALITY tunvless почти выбирает весь канал, занимая один поток, а sing-box и mihomo упираются в 23–35 Мбит/с, занимая все четыре: на каждый занятый поток tunvless прокачивает в 7–11 раз больше. Памяти ему нужно в 6–10 раз меньше, а sing-box вдобавок держит в оперативной памяти свой бинарник на 85 МБ.

Без шифрования (VLESS без REALITY) канал выбирают и sing-box, и mihomo со стеком `system`, но тратят на это в 2,5–3 раза больше процессора, чем tunvless; mihomo со стеком `gvisor` и тут упирается в 42 Мбит/с.
