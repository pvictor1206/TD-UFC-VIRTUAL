import { useRef, useState } from 'react';
import { createBlankLesson, SAMPLE_LESSON, migrateLesson } from '@lesson';
import { downloadJson, downloadLessonSite, slugify } from '../Builder/exportSite';

// Ações de arquivo do cabeçalho: exemplo, abrir/salvar projeto (.json), baixar site e limpar.
// Mesmo comportamento da Versão 1.
export default function useFileActions({ lesson, setLesson, loadAssets, notify }) {
  const fileInputRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const replaceLesson = (next, message) => {
    setLesson(next);
    notify(message, { undo: lesson, after: next });
  };

  const onNew = () => {
    if (!confirm('Isso vai apagar o conteúdo atual do construtor. Deseja continuar?')) return;
    replaceLesson(createBlankLesson(), 'Construtor limpo.');
  };

  const onSample = () => {
    if (lesson.sections.length > 0 && !confirm('Isso vai substituir o conteúdo atual pelo exemplo. Deseja continuar?')) return;
    replaceLesson({ ...JSON.parse(JSON.stringify(SAMPLE_LESSON)), cor: lesson.cor || '' }, 'Exemplo carregado.');
  };

  const onSave = () => {
    downloadJson(`projeto_${slugify(lesson.titulo)}.json`, lesson);
    notify('Projeto salvo. Use "Abrir projeto" para continuar editando depois.');
  };

  const onDownload = async () => {
    setDownloading(true);
    try {
      await downloadLessonSite(lesson, loadAssets);
      notify('Site baixado! Descompacte o .zip e abra o index.html.');
    } catch (err) {
      console.error(err);
      notify('Não foi possível gerar o site. Veja o console (F12) para detalhes.');
    } finally {
      setDownloading(false);
    }
  };

  const onImportClick = () => fileInputRef.current?.click();

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        replaceLesson(migrateLesson({ aula: '', titulo: '', objetivo: '', sections: [], ...parsed }), 'Projeto aberto com sucesso.');
      } catch {
        notify('Arquivo inválido: não é um projeto de aula reconhecível.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return { fileInputRef, downloading, onNew, onSample, onSave, onDownload, onImportClick, onImportFile };
}
