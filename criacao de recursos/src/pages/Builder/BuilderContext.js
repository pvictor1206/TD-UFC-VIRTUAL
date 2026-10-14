import { createContext } from 'react';

// Recursos que a aplicação hospedeira (o painel) oferece ao editor.
// - uploadImage(file) => Promise<string>: envia a imagem e devolve o link público.
//   Sem ele, o campo de imagem fica só com o endereço digitado.
export const BuilderContext = createContext({ uploadImage: null });
