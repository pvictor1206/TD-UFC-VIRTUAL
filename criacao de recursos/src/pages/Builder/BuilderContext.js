import { createContext } from 'react';

// Recursos que a aplicação hospedeira (o painel) oferece ao editor.
// - uploadImage(file) => Promise<string>: envia a imagem e devolve o link público.
//   Sem ele, o campo de imagem fica só com o endereço digitado.
// - canEditSpacing: libera a engrenagem de espaçamento (só Suporte técnico e Administrador).
export const BuilderContext = createContext({ uploadImage: null, canEditSpacing: true });
