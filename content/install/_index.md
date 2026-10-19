---
title: Установка
---

```shell
grep -qs repo.hoaxisr.ru /opt/etc/opkg.conf /opt/etc/opkg/*.conf ||
  echo "src/gz hoaxisr http://repo.hoaxisr.ru/mipsel-k3.4" > /opt/etc/opkg/hoaxisr.conf
opkg update && opkg install firc
/opt/etc/init.d/S99firc start
```
