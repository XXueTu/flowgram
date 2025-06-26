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
