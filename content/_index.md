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

{{< hextra/feature-grid >}}
  {{< hextra/feature-card title="Установка" subtitle="Entware, репозиторий, первый вход в веб-интерфейс." link="install/" >}}
  {{< hextra/feature-card title="Быстрый старт" subtitle="Первая группа: chatgpt.com через туннель, остальное напрямую." link="quickstart/" >}}
  {{< hextra/feature-card title="Вопросы и решения" subtitle="Сайт идёт мимо туннеля, значки групп, веб-интерфейс не открывается." link="faq/" >}}
{{< /hextra/feature-grid >}}

## Руководство

{{< hextra/feature-grid >}}
  {{< hextra/feature-card title="Группы и правила" subtitle="Что такое группа, типы правил, порядок и приоритет." link="guide/groups/" >}}
  {{< hextra/feature-card title="Списки" subtitle="Правила по ссылке: текстовые списки и rule-set sing-box." link="guide/lists/" >}}
  {{< hextra/feature-card title="Устройства" subtitle="Группа для всех, для политики Keenetic или для отдельных устройств." link="guide/devices/" >}}
  {{< hextra/feature-card title="Интерфейсы и резервирование" subtitle="Запасной интерфейс, если основной упал." link="guide/interfaces/" >}}
  {{< hextra/feature-card title="Туннели VLESS" subtitle="Ссылки, подписки, узлы и их проверка." link="guide/tunnels/" >}}
  {{< hextra/feature-card title="Журнал и захват" subtitle="DNS-ответы по группам и поиск трафика мимо firc." link="guide/journal/" >}}
  {{< hextra/feature-card title="Настройки" subtitle="Что применяется сразу, а что после перезапуска." link="guide/settings/" >}}
  {{< hextra/feature-card title="Обновление" subtitle="Обновление из веб-интерфейса и через opkg." link="guide/update/" >}}
{{< /hextra/feature-grid >}}
