<h3 align="right">中文 / <a href="README_ENG.md">English</a></h3>
<p align="center">
    <img src="markdownResources/cover.png" alt="cover" align=center />
</p>
    <h2 align="center">椒盐歌单助手</h2>
    <h2 align="center" style="padding-top: 0">前后端重构版——前端仓库</h2>

---

### 项目介绍

[原项目](https://github.com/Winnie0408/SaltPlayerConverter)前后端重构版的前端代码仓库。

项目功能的使用教程在[原项目](https://github.com/Winnie0408/SaltPlayerConverter)的README，本README只包含**如何自行运行本项目**。

重构版 后端仓库：[SaltPlayerConverterBackEnd](https://github.com/Winnie0408/SaltPlayerConverterBackEnd)

### 需要使用的硬件与软件

必须：
- Node.js 18.18.0 及以上版本（我使用的是18.18.0 LTS）
- 现代的浏览器，如Chrome、Edge、Firefox等

可选：
- 电脑或其他中大屏（普通平板大小及以上）横屏设备

### 项目的使用与运行（二选一即可）

#### 1. 使用Web IDE（如WebStorm等）从源码运行

1. 使用IDE或者git克隆或下载本项目的源码。

```bash
git clone git@github.com:Winnie0408/SaltPlayerConverterFrontEnd.git
```

2. 使用Web IDE打开本并信任项目。
3. 稍等一会儿，点击右下角弹出气泡中的`运行npm install`按钮（推荐[更换npm的镜像源为淘宝](README.md#配置npm镜像源)，以提高下载速度），等待依赖下载完成。
4. 修改`src/main.ts`文件的`axios.defaults.baseURL`配置，更改为后端服务器的IP+端口。
   - 如果是前后端在同一台电脑上运行，则修改为`localhost:8082`。
   - 如果是前后端在不同的电脑上运行，则修改为后端服务器的局域网IP+端口（如`192.168.1.123:8082`）。
5. 打开项目中的`package.json`文件，点击`scripts`中`dev`前的绿色三角按钮，运行项目。
6. 等待项目启动，浏览器会自动打开项目的主页。
   - 如果没打开，则手动打开浏览器，输入`localhost:5173`，回车，即可打开页面。
   - 如果您使用CLI来运行前端服务：
     - 如果您在同一台电脑上运行前端服务、访问前端页面，则需要使用带有桌面环境系统的现代浏览器打开`localhost:5173`。
     - 如果您在不同的电脑上运行前端服务、访问前端页面，则需要使用带有桌面环境系统的现代浏览器打开`后端服务器的局域网IP+端口`（如`192.168.1.123:5173`）。

#### 2. 使用npm从源码运行

1. 克隆或下载本项目的源码。

```bash
git clone git@github.com:Winnie0408/SaltPlayerConverterFrontEnd.git
```

2. 修改`src/main.ts`文件的`axios.defaults.baseURL`配置，更改为后端服务器的IP+端口。
   - 如果是前后端在同一台电脑上运行，则修改为`localhost:8082`。
   - 如果是前后端在不同的电脑上运行，则修改为后端服务器的局域网IP+端口（如`192.168.1.123:8082`）。
3. 进入项目目录，使用npm下载依赖。（推荐[更换npm的镜像源为淘宝](README.md#配置npm镜像源)，以提高下载速度）。

```bash
npm install
```

4. 等待依赖下载完成后，使用npm运行项目。

```bash
npm run dev
```

5. 等待项目启动，浏览器会自动打开项目的主页。
   - 如果没打开，则手动打开浏览器，输入`localhost:5173`，回车，即可打开页面。
   - 如果您使用CLI来运行前端服务：
     - 如果您在同一台电脑上运行前端服务、访问前端页面，则需要使用带有桌面环境系统的现代浏览器打开`localhost:5173`。
     - 如果您在不同的电脑上运行前端服务、访问前端页面，则需要使用带有桌面环境系统的现代浏览器打开`后端服务器的局域网IP+端口`（如`192.168.1.123:5173`）。

### 配置npm镜像源

在任意位置打开终端（命令行），输入以下命令：

```bash
npm config set registry https://registry.npmmirror.com
```

## 赞助与支持

🥰🥰🥰

如果这个项目对您有所帮助，您可以给我一颗免费的⭐，或者请我喝杯咖啡！<br>
非常感谢您的支持！ <br>
⬇️⬇️⬇️<br>
<a href="markdownResources/Alipay WeChatPay.jpg">
<img src="markdownResources/Sponsorship.png" width = "150" height = "90" alt="Sponsorship.jpg" align=center />
</a>

