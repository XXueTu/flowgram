import { Tabs } from '@douyinfe/semi-ui';
import React from 'react';

export interface CodeTip {
  title: string;
  code: string;
  description?: string;
}

interface CodeTipsProps {
  tips: CodeTip[];
  style?: React.CSSProperties;
}

export const CodeTips: React.FC<CodeTipsProps> = ({ tips, style }) => {
  return (
    <div style={{ 
      background: 'var(--semi-color-fill-0)', 
      fontSize: '13px',
      lineHeight: '1.6',
      color: 'var(--semi-color-text-2)',
      width: '100%',
      marginBottom: 16,
      ...style
    }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--semi-color-border)' }}>
        <div style={{ marginBottom: 8 }}>在这里，您可以通过 <code style={{ background: 'var(--semi-color-fill-2)', padding: '2px 4px', borderRadius: '2px' }}>params</code> 获取节点中的输入变量，并通过 <code style={{ background: 'var(--semi-color-fill-2)', padding: '2px 4px', borderRadius: '2px' }}>ret</code> 输出结果</div>
        <div><code style={{ background: 'var(--semi-color-fill-2)', padding: '2px 4px', borderRadius: '2px' }}>params</code> 和 <code style={{ background: 'var(--semi-color-fill-2)', padding: '2px 4px', borderRadius: '2px' }}>ret</code> 已经被正确地注入到环境中</div>
      </div>
      <div style={{ width: '100%' }}>
        <div style={{ paddingLeft: 24 }}>
          <Tabs type="line" style={{ width: '100%' }}>
            {tips.map((tip, index) => (
              <Tabs.TabPane tab={tip.title} itemKey={String(index)} key={index}>
                {tip.description && (
                  <div style={{ padding: '0 24px', marginBottom: 8 }}>{tip.description}</div>
                )}
                <pre style={{ 
                  margin: '8px 0', 
                  padding: '12px 24px', 
                  background: 'var(--semi-color-fill-2)', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflowX: 'auto',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>{tip.code}</pre>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}; 