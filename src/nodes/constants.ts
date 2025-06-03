export enum WorkflowNodeType {
  Start = 'start',
  End = 'end',
  LLM = 'llm',
  Code = 'code',
  Http = 'http',
  Condition = 'condition',
  Loop = 'loop',
  Comment = 'comment',
  Custom = 'custom',
}
