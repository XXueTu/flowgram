import { getNodeForm } from '@flowgram.ai/free-layout-editor';
// 递归查找变量类型工具函数
// ctx: 运行上下文，需包含 document.getNode 方法
export function getTypeByContentPath(ctx: any, contentPath: string[]): any {
  if (!contentPath || contentPath.length < 2) return null;
  const nodeId = contentPath[0];
  const node = ctx.node.document.getNode(nodeId);
  if (!node) return null;
  const form = getNodeForm(node);
  // 用 getValueIn 获取 outputs schema
  const outputs = form?.getValueIn('outputs');
  if (!outputs || !outputs.properties) return null;
  let schema: any = outputs;
  let properties = schema.properties;
  for (let i = 1; i < contentPath.length; i++) {
    const key = contentPath[i];
    if (!properties || !properties[key]) return null;
    schema = properties[key];
    // object 类型递归 properties
    if (schema.type === 'object') {
      properties = schema.properties;
    } else if (schema.type === 'array') {
      // 数组类型递归 items
      schema = schema.items;
      properties = schema.properties;
    } else {
      // 基础类型直接返回
      return schema.type;
    }
  }
  return schema.type;
} 