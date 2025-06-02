import styled from 'styled-components';
import { Tag, TreeSelect } from '@douyinfe/semi-ui';

export const UIRootTitle = styled.span`
  margin-right: 4px;
  color: var(--semi-color-text-2);
`;

export const UITag = styled(Tag)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & .semi-tag-content-center {
    justify-content: flex-start;
  }

  &.semi-tag {
    margin: 0;
  }
`;

export const UITreeSelect = styled(TreeSelect)<{ $error?: boolean }>`
  outline: ${({ $error }) => ($error ? '1px solid red' : 'none')};

  height: 22px;
  min-height: 22px;
  line-height: 22px;

  & .semi-tree-select-selection {
    padding: 0 2px;
    height: 22px;
  }

  & .semi-tree-select-selection-content {
    width: 100%;
  }

  & .semi-tree-select-selection-placeholder {
    padding-left: 10px;
  }
`;
