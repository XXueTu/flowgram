import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  margin-bottom: 6px;
  gap: 8px;
  min-width: 0;
  overflow: visible;
`;

export const LeftColumn = styled.div`
  min-width: 120px;
  max-width: 200px;
  flex: 0 0 120px;
  position: relative;
`;

export const ExpandDetail = styled.div`
  margin-left: 0px;
  margin-bottom: 4px;
  margin-top: -2px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

export const Label = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  white-space: nowrap;
  min-width: 120px;
  flex: 0 0 120px;
  padding-left: 8px;
`;
