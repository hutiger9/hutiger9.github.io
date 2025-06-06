---
date: 2022-10-12 20:14:47
url: 
tags: 
  - code
title: 虚拟环境
en-title: virtual environment
---

# 虚拟环境创建与清除

### 使用 `virtualenv`

1. **安装 virtualenv**： 如果你还没有安装 `virtualenv`，可以通过以下命令安装：

   ```python
   pip install virtualenv
   ```

2. **创建一个新的虚拟环境**： 你可以指定一个路径来存储虚拟环境的文件。以下命令将在指定位置创建一个新的虚拟环境：

   ```python
   virtualenv /path/to/your/env
   ```

   替换 `/path/to/your/env` 为你想要创建环境的具体路径。

3. **激活虚拟环境**：

    在 Windows 上，使用以下命令：

   ```
   \path\to\your\env\Scripts\Activate
   或者：& "d:\xnhj\hanlp\env\Scripts\Activate.ps1"
   ```

   在 macOS 或 Linux 上，使用以下命令：

   ```
   source /path/to/your/env/bin/activate
   ```

4. **安装所需的包**： 激活虚拟环境后，你可以安装任何所需的包，而不会影响全局 Python 环境。例如，安装 TensorFlow 和 HanLP：

   ```
   pip install tensorflow
   pip install hanlp[full]
   ```

5. **退出虚拟环境**： 当你完成工作并想退出虚拟环境时，可以简单地运行：

   ```
   deactivate
   ```







1. **创建环境**：

   ```
   conda create --name myenv
   ```

   这会创建一个名为 `myenv` 的新环境。

2. **指定 Python 版本**：

   ```
   conda create --name myenv python=3.8
   ```

   这将创建一个名为 `myenv` 的环境，并在其中安装 Python 3.8。

3. **激活环境**：

   ```
   conda activate myenv
   ```

   这会激活名为 `myenv` 的环境。在 Windows 上可能需要使用 `activate myenv` 命令。

4. **安装包**：

   在激活环境后，你可以使用 `conda install` 命令安装包。例如：

   ```
   conda install numpy
   ```

   这会在当前环境中安装 NumPy。

5. **列出已安装的包**：

   ```
   conda list
   ```

   这会列出当前环境中安装的所有包。

6. **退出环境**：

   ```
   conda deactivate
   ```

   这会退出当前环境，返回到基础环境。

7. **删除环境**：

   ```
   conda remove --name myenv --all
   ```

   这会删除名为 `myenv` 的环境及其所有内容。



