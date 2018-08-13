# docker 目录说明

此目录存放会放置到docker里面的各种文件（Dockerfile除外，因为它需要放在根目录）。

- `bootstrap` docker启动时需要运行的脚本，从`bootstrap/index.js`开始
   - `.env` & `.env.production` 指向根目录相应文件的软链接，目的是用来开发时调试`index.js`。根目录的`.env`和`.env.production`作用，一方面是定义项目代码中需要的环境变量，另一方面也用来与docker通讯，即告诉docker在启动时的一些环境变量，比如，你可以告诉docker你的项目需要用到哪些服务，好从etcd上获取服务地址。它们在`Dockerfile`通过`COPY`添加到`/etc/bootstrap/`目录，与`index.js`位于同一级目录。但在项目代码中受限于`vue-cli`的要求，必须位于根目录。所以用这样一个软链接的方式来辅助开发
   - 此软链接被gitignore了，如果您需要调试，可以自己创建
- `nginx.conf` nginx配置文件

