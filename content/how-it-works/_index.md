---
title: Как это работает
weight: 1
---

Маршрутизация по адресам из ответа DNS не сможет разделить два сайта, у которых общий адрес CDN: адрес у Cloudflare один на тысячи доменов, и в туннель может попадать лишнее. firc решает по имени сайта. Для этого он сам отвечает устройствам на запросы DNS.

## Пример: chatgpt.com и api.ipify.org

Возьмём два сайта: **chatgpt.com** нужно пустить через туннель, а **api.ipify.org** (он показывает ваш внешний адрес) пусть идёт напрямую. Оба живут за Cloudflare.

Обычная схема маршрутизирует по адресам: в ipset попадают IP из ответов DNS или готовые списки подсетей. В списках подсетей для ChatGPT часто лежит весь Cloudflare, поэтому в туннель уходит и api.ipify.org, хотя его нет ни в одном правиле. Так же страдает любой сайт за Cloudflare DNS proxy или другим CDN - у тысяч доменов одни и те же адреса.

firc решает по имени. chatgpt.com уходит в туннель, а api.ipify.org показывает адрес вашего провайдера. Как это устроено — на схеме ниже.

<div class="how-diagram" style="max-width:560px;margin:2rem auto;">
<svg viewBox="0 0 560 640" width="100%" role="img" aria-labelledby="how-title" style="color:inherit;font-family:inherit">
<title id="how-title">Путь запроса к chatgpt.com и api.ipify.org через firc</title>
<defs>
<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
</defs>
<g fill="none" stroke="currentColor" stroke-width="1.5">
<rect x="20" y="10" width="520" height="70" rx="10"/>
<rect x="20" y="120" width="520" height="90" rx="10" stroke-width="2.5"/>
<rect x="20" y="250" width="250" height="110" rx="10"/>
<rect x="290" y="250" width="250" height="110" rx="10" stroke-dasharray="5 4"/>
<rect x="20" y="400" width="250" height="110" rx="10"/>
<rect x="290" y="400" width="250" height="110" rx="10" stroke-dasharray="5 4"/>
<rect x="20" y="550" width="250" height="70" rx="10" stroke-width="2.5"/>
<rect x="290" y="550" width="250" height="70" rx="10" stroke-dasharray="5 4"/>
<path d="M280,80 V118" marker-end="url(#arr)"/>
<path d="M145,210 V248" marker-end="url(#arr)"/>
<path d="M415,210 V248" marker-end="url(#arr)"/>
<path d="M145,360 V398" marker-end="url(#arr)"/>
<path d="M415,360 V398" marker-end="url(#arr)"/>
<path d="M145,510 V548" marker-end="url(#arr)"/>
<path d="M415,510 V548" marker-end="url(#arr)"/>
</g>
<g fill="currentColor" font-size="18" text-anchor="middle">
<text x="280" y="40" font-weight="600">Устройство спрашивает адрес</text>
<text x="280" y="62">chatgpt.com и api.ipify.org</text>
<text x="280" y="150" font-weight="600">firc отвечает на запрос DNS</text>
<text x="280" y="172">и сверяет имя с правилами групп</text>
<text x="280" y="194" font-size="15" opacity="0.75">настоящий ответ firc запоминает</text>
<text x="145" y="280" font-weight="600">chatgpt.com</text>
<text x="145" y="302">есть в группе — свой</text>
<text x="145" y="322">адрес из пула firc</text>
<text x="145" y="344" font-family="monospace">198.18.0.12</text>
<text x="415" y="280" font-weight="600">api.ipify.org</text>
<text x="415" y="302">правила нет —</text>
<text x="415" y="322">настоящий адрес</text>
<text x="415" y="344" font-size="15" opacity="0.75">из ответа DNS</text>
<text x="145" y="430" font-weight="600">Роутер видит адрес</text>
<text x="145" y="452">из пула группы и ведёт</text>
<text x="145" y="474">пакет в её интерфейс</text>
<text x="145" y="496" font-size="15" opacity="0.75">туннель, VPN, второй провайдер</text>
<text x="415" y="430" font-weight="600">Обычный маршрут</text>
<text x="415" y="452">роутера, как будто</text>
<text x="415" y="474">firc нет</text>
<text x="145" y="580" font-weight="600">Адрес подменяется</text>
<text x="145" y="602">на настоящий — в туннель</text>
<text x="415" y="580" font-weight="600">Напрямую</text>
<text x="415" y="602">через провайдера</text>
</g>
</svg>
</div>
