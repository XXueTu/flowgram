import iconStart from '../../assets/icon-start.jpg';
import { FlowNodeRegistry } from '../../typings';
import { WorkflowNodeType } from '../constants';
import { formMeta } from './form-meta';

export const HttpNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Http,
  meta: {
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: iconStart,
    description: '自定义节点，可根据需要配置输入输出。',
  },
  formMeta,
  onAdd() {
    return {
      id: `http_${Date.now()}`,
      type: 'http',
      data: {
        title: 'http',
        // 可根据需要添加默认 inputs/outputs
      },
    };
  },
};

