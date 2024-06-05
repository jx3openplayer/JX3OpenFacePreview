import os
import shutil

# 将dist文件夹拷贝为 ../docs文件夹，需要先删除docs文件夹中的所有内容
shutil.rmtree("../docs")
shutil.copytree("dist", "../docs")
shutil.copy("../CNAME", "../docs/CNAME")