# firc-docs

Исходники сайта документации https://firc.hoaxisr.ru для [firc](https://github.com/hoaxisr/firc).

Сайт собран на [Hugo](https://gohugo.io) (extended, не ниже 0.134) с темой [Hextra](https://imfing.github.io/hextra/).

```bash
git clone --recurse-submodules https://github.com/hoaxisr/firc-docs.git
cd firc-docs
make dev      # http://localhost:1313
make check    # сборка, запрещённый текст, битые ссылки, блок установки против README firc
```

`make check` сверяет блок установки с `README.md` firc из `../firc` (другой путь — `FIRC_SRC=...`).
