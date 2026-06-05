// 异步壳：因为 MF remote（如 session）会被构建器转成异步 import，
// 入口必须延后到下一轮，避免顶层同步依赖远程模块。
import('@/bootstrap');
