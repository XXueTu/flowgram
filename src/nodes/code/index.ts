import { nanoid } from 'nanoid';
import { FlowNodeRegistry } from '../../typings';
import { WorkflowNodeType } from '../constants';
let index = 0;
export const CodeNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Code,
  info: {
    icon: 'icon-code', // 这么写不对,但是现在这个问题不重要
    description:
      'Write code to achieve specific functions.',
  },
  meta: {
    size: {
      width: 360,
      height: 305,
    },
  },
  onAdd() {
    return {
      id: `code_${nanoid(5)}`,
      type: 'code',
      data: {
        title: `Code_${++index}`,
        inputsValues: {
          modelType: {
            type: 'constant',
            content: 'gpt-3.5-turbo',
          },
          temperature: {
            type: 'constant',
            content: 0.5,
          },
          systemPrompt: {
            type: 'constant',
            content: 'You are an AI assistant.',
          },
          prompt: {
            type: 'constant',
            content: '',
          },
        },
        inputs: {
          type: 'object',
          required: ['modelType', 'temperature', 'prompt'],
          properties: {
            modelType: {
              type: 'string',
            },
            temperature: {
              type: 'number',
            },
            systemPrompt: {
              type: 'string',
            },
            prompt: {
              type: 'string',
            },
          },
        },
        outputs: {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        },
      },
    };
  },
};
