// Espaçamento vertical entre componentes e entre seções (opção do professor).
// Valor vazio = espaçamento padrão de cada componente (nada é alterado).

export const SPACING_OPTIONS = [
  { value: '', label: 'Padrão' },
  { value: 'none', label: 'Nenhum' },
  { value: 'sm', label: 'Pequeno' },
  { value: 'md', label: 'Médio' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muito grande' },
];

const SPACING = { none: '0rem', sm: '0.5rem', md: '1rem', lg: '2rem', xl: '3.5rem' };

// Devolve o valor CSS (ex: "2rem") ou undefined para o padrão.
export const spacingValue = (key) => SPACING[key];
