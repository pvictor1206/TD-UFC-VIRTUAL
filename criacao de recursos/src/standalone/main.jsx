import { createRoot } from 'react-dom/client';
import { LessonRenderer } from '@lesson';
import './standalone.css';

// Ponto de entrada do pacote autônomo (HTML + CSS + JS) gerado pelo botão
// "Baixar site" do Construtor de Aulas. Este arquivo é compilado
// separadamente (npm run build:standalone) para um único standalone.js que
// já contém React e todos os componentes — o HTML exportado só precisa
// injetar o conteúdo da aula em `window.__LESSON_CONTENT__` antes de
// carregar esse script. Veja docs/CONSTRUTOR-DE-AULAS.md.

const content = window.__LESSON_CONTENT__ || { titulo: 'Aula sem conteúdo', sections: [] };
const container = document.getElementById('lesson-root');
createRoot(container).render(<LessonRenderer content={content} />);
