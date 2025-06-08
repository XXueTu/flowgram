import { FlowNodeRegistry } from '../typings';
import { CodeNodeRegistry } from './code';
import { CommentNodeRegistry } from './comment';
import { ConditionNodeRegistry } from './condition';
import { WorkflowNodeType } from './constants';
import { EndNodeRegistry } from './end';
import { HttpNodeRegistry } from './http';
import { ItemEndNodeRegistry } from './item_end';
import { LoopNodeRegistry } from './loop';
import { LLMNodeRegistry } from './model';
import { SQLNodeRegistry } from './sql_data';
import { StartNodeRegistry } from './start';
export { WorkflowNodeType } from './constants';


export const nodeRegistries: FlowNodeRegistry[] = [
  StartNodeRegistry,
  EndNodeRegistry,
  ItemEndNodeRegistry,
  ConditionNodeRegistry,
  LLMNodeRegistry,
  CodeNodeRegistry,
  LoopNodeRegistry,
  CommentNodeRegistry,
  HttpNodeRegistry,
  SQLNodeRegistry
];

export const visibleNodeRegistries = nodeRegistries.filter(
  (r) => r.type !== WorkflowNodeType.Comment
);
