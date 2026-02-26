// CHANGE THIS LINE:
import { createTheme } from '@uiw/codemirror-themes'; // <--- Import from here
import { tags as t } from '@lezer/highlight';

export const bliteEditorTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#F8FAFC', 
    backgroundImage: '',
    foreground: '#334155',
    caret: '#0EA5E9',
    selection: '#E0F2FE',
    selectionMatch: '#E0F2FE',
    lineHighlight: '#F1F5F9',
    gutterBackground: '#F8FAFC',
    gutterForeground: '#94A3B8',
  },
  styles: [
    { tag: t.keyword, color: '#0EA5E9', fontWeight: 'bold' },
    { tag: t.comment, color: '#94A3B8', fontStyle: 'italic' },
    { tag: t.string, color: '#16A34A' },
    { tag: t.number, color: '#D97706' },
    { tag: t.variableName, color: '#334155' },
    { tag: t.definition(t.typeName), color: '#0EA5E9' },
    { tag: t.typeName, color: '#0EA5E9' },
    { tag: t.tagName, color: '#0EA5E9' },
    { tag: t.operator, color: '#64748B' },
  ],
});