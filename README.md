vue2.x+electron打包应用（模板）

在windows平台下执行
npm run electron_build   //生成window下的绿色版  可以使用Inno等软件进一步生成exe安装包
npm run electron_mac   //生成mac的.app文件


在mac上安装appdmg
cnpm i appdmg --save-dev   //window下安装不了
npm run dmg  //把windows下生成.app转成dmg文件
