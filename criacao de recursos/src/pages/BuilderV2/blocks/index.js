import { IntroEditor, HeadingEditor, CalloutEditor, ReferenceBoxEditor, ConclusionEditor, GlossaryEditor } from './text';
import { DropdownGroupEditor, BulletCardsEditor, TimelineEditor, DataTableEditor, ComparisonTableEditor } from './structure';
import { ImageEditor, VideoEditor, CarouselEditor } from './media';
import { QuizEditor, CtaEditor, AccessLinkEditor } from './interactive';
import { FormulaEditor, FormulaSheetEditor, StepByStepEditor } from './exatas';
import { CodeBlockEditor, CodeTabsEditor, CodeQuizEditor } from './code';

// Um editor "dentro do componente" para cada tipo do catálogo: desenha o componente como o aluno
// vê e deixa editar o texto, os itens e as imagens no próprio lugar.
// Recebe { block, onChange, selected }. Tipo sem editor aqui cai no formulário de campos do componente.
export const BLOCK_EDITORS = {
  intro: IntroEditor,
  heading: HeadingEditor,
  image: ImageEditor,
  video: VideoEditor,
  carousel: CarouselEditor,
  dropdown_group: DropdownGroupEditor,
  bullet_cards: BulletCardsEditor,
  timeline: TimelineEditor,
  data_table: DataTableEditor,
  comparison_table: ComparisonTableEditor,
  reference_box: ReferenceBoxEditor,
  conclusion: ConclusionEditor,
  quiz: QuizEditor,
  cta: CtaEditor,
  access_link: AccessLinkEditor,
  formula: FormulaEditor,
  formula_sheet: FormulaSheetEditor,
  step_by_step: StepByStepEditor,
  callout: CalloutEditor,
  glossary: GlossaryEditor,
  code_block: CodeBlockEditor,
  code_tabs: CodeTabsEditor,
  code_quiz: CodeQuizEditor,
};

// O que NÃO é texto/itens e por isso fica na engrenagem ⚙ do componente (campos do catálogo).
// Os demais campos se editam direto no componente.
export const OPTION_KEYS = {
  heading: ['size', 'align'],
  image: ['alt'],
  dropdown_group: ['layout'],
  formula_sheet: ['columns'],
  code_block: ['lineNumbers', 'highlight', 'runnable'],
  code_tabs: ['lineNumbers'],
};
