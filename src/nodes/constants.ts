export enum WorkflowNodeType {
  Start = 'start',
  End = 'end',
  ItemStart = 'item_start',
  ItemEnd = 'item_end',
  LLM = 'llm',
  Code = 'code',
  Http = 'http',
  Condition = 'condition',
  Loop = 'loop',
  Comment = 'comment',
  Custom = 'custom',
  Sql = 'sql',
}
