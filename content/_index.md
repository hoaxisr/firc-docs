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
    subtitle="Встроенный клиент tunvless на C: REALITY, gRPC, xhttp, подписки и проверка узлов. Скорость и память — в разделе «Замеры»."
    link="benchmarks/vless/"
  >}}
  {{< hextra/feature-card
    title="Лёгкий"
    subtitle="Пакет около мегабайта, демон на C без Go и интерпретаторов. Размер и память — в разделе «Замеры»."
    link="benchmarks/firc/"
  >}}
{{< /hextra/feature-grid >}}

<div class="hx-mt-16"></div>

## Начать

{{< cards cols="3" >}}
  {{< card link="install/" title="Установка" icon="download" subtitle="Entware, репозиторий, первый вход в веб-интерфейс." >}}
  {{< card link="quickstart/" title="Быстрый старт" icon="play" subtitle="Первая группа: chatgpt.com через туннель, остальное напрямую." >}}
  {{< card link="faq/" title="Вопросы и решения" icon="question-mark-circle" subtitle="Сайт идёт мимо туннеля, значки групп, веб-интерфейс не открывается." >}}
{{< /cards >}}

<div class="hx-mt-16"></div>

## Руководство

{{< cards cols="3" >}}
  {{< card link="guide/groups/" title="Группы и правила" icon="collection" subtitle="Что такое группа, типы правил, порядок и приоритет." >}}
  {{< card link="guide/lists/" title="Списки" icon="document-text" subtitle="Правила по ссылке: текстовые списки и rule-set sing-box." >}}
  {{< card link="guide/devices/" title="Устройства" icon="device-mobile" subtitle="Группа для всех, для политики Keenetic или для отдельных устройств." >}}
  {{< card link="guide/interfaces/" title="Интерфейсы и резервирование" icon="switch-horizontal" subtitle="Запасной интерфейс, если основной упал." >}}
  {{< card link="guide/tunnels/" title="Туннели VLESS" icon="lock-closed" subtitle="Ссылки, подписки, узлы и их проверка." >}}
  {{< card link="guide/journal/" title="Журнал и захват" icon="clipboard-list" subtitle="DNS-ответы по группам и поиск трафика мимо firc." >}}
  {{< card link="guide/settings/" title="Настройки" icon="cog" subtitle="Что применяется сразу, а что после перезапуска." >}}
  {{< card link="guide/update/" title="Обновление" icon="refresh" subtitle="Обновление из веб-интерфейса и через opkg." >}}
  {{< card link="benchmarks/" title="Замеры" icon="chart-bar" subtitle="Размер, память, DNS и скорость VLESS-клиентов." >}}
{{< /cards >}}

<div class="hx-mt-16"></div>

[Исходный код](https://github.com/hoaxisr/firc) · [Репозиторий opkg](http://repo.hoaxisr.ru) · [Релизы](https://github.com/hoaxisr/firc/releases) · [Баги и предложения](https://github.com/hoaxisr/firc/issues) · Роутеры Keenetic с Entware

<small>firc — продолжение форка MagiTrickle, переписанного dan0102dan на C. Маршрутизация устроена принципиально иначе; общим с исходным проектом сейчас остаётся в основном дизайн веб-интерфейса.</small>
