import { FlowNodeRegistry } from '../typings';
import { CodeNodeRegistry } from './code';
import { CommentNodeRegistry } from './comment';
import { ConditionNodeRegistry } from './condition';
import { WorkflowNodeType } from './constants';
import { EndNodeRegistry } from './end';
import { HttpNodeRegistry } from './http';
import { LLMNodeRegistry } from './llm';
import { LoopNodeRegistry } from './loop';
import { StartNodeRegistry } from './start';
export { WorkflowNodeType } from './constants';

export const nodeRegistries: FlowNodeRegistry[] = [
  StartNodeRegistry,
  EndNodeRegistry,
  ConditionNodeRegistry,
  LLMNodeRegistry,
  CodeNodeRegistry,
  LoopNodeRegistry,
  CommentNodeRegistry,
  HttpNodeRegistry,
];

export const visibleNodeRegistries = nodeRegistries.filter(
  (r) => r.type !== WorkflowNodeType.Comment
);
