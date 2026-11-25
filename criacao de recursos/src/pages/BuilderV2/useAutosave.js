import { useEffect, useRef, useState } from 'react';

// Salvamento automático (mesmo comportamento da Versão 1): cada alteração é gravada ~0,3 s
// depois; as gravações saem em ordem (uma por vez, sempre a mais nova), são concluídas ao sair
// da tela e, se falharem, tentam de novo sozinhas.
export default function useAutosave(lesson, onLessonChange, enabled = true) {
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'saving' | 'error'
  const saveRef = useRef({ inflight: false, pending: null, retry: null });
  const onChangeRef = useRef(onLessonChange);
  onChangeRef.current = onLessonChange;
  const firstRun = useRef(true);

  const flushSave = async () => {
    const s = saveRef.current;
    if (s.inflight) return;
    s.inflight = true;
    clearTimeout(s.retry);
    while (s.pending) {
      const next = s.pending;
      s.pending = null;
      setSaveState('saving');
      let ok = false;
      try {
        ok = (await onChangeRef.current?.(next)) !== false;
      } catch {
        ok = false;
      }
      if (!ok) {
        s.pending = s.pending || next; // guarda a versão mais nova para tentar de novo
        s.inflight = false;
        setSaveState('error');
        s.retry = setTimeout(flushSave, 4000);
        return;
      }
    }
    s.inflight = false;
    setSaveState('saved');
  };

  useEffect(() => {
    if (!enabled) return undefined;
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    saveRef.current.pending = lesson;
    setSaveState('saving');
    const id = setTimeout(flushSave, 300);
    return () => clearTimeout(id);
  }, [lesson]);

  // Ao sair do editor (ou esconder a aba) grava na hora o que ainda estiver pendente.
  useEffect(() => {
    if (!enabled) return undefined;
    const flushNow = () => { if (saveRef.current.pending) flushSave(); };
    const onHidden = () => { if (document.hidden) flushNow(); };
    const warn = (e) => {
      const s = saveRef.current;
      if (s.pending || s.inflight) { e.preventDefault(); e.returnValue = ''; }
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', flushNow);
    window.addEventListener('beforeunload', warn);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', flushNow);
      window.removeEventListener('beforeunload', warn);
      clearTimeout(saveRef.current.retry);
      flushNow();
    };
  }, []);

  return { saveState, flushSave };
}
