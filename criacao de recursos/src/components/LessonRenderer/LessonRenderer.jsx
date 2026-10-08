import { useState } from 'react';
import {
  HighlightBlock,
  QuoteCard,
  DropdownContent,
  AccessibilityControls,
  ImageLightbox,
  ReferenceBoxColor,
  DataTable,
  ComparisonTable,
  Timeline,
  CarouselComponent,
  InteractiveQuiz,
  QuestionnairePrompt,
  AccessLink,
} from '@ui';
import FormattedText from './FormattedText';

// Motor único de renderização de aulas: recebe um JSON de conteúdo
// (título + objetivo + lista de `sections`) e desenha a página usando os
// componentes padrão de src/components/ui/. Este componente é a mesma
// engine usada tanto na aula publicada quanto na pré-visualização do
// Construtor (src/pages/Builder), garantindo que o que a pessoa vê ao
// montar o conteúdo é exatamente o que os alunos vão ver.
//
// Qualquer JSON no formato { aula, titulo, objetivo, sections: [...] }
// funciona aqui — não é necessário criar um novo componente React por aula.

export function renderSection(section, index) {
  switch (section.type) {
    case 'intro':
      return (
        <section key={index} className="bg-white dark:bg-gray-800 p-5 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600" />
          <FormattedText
            text={section.text}
            className="max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-left font-medium"
            style={{ fontSize: '1em' }}
          />
        </section>
      );

    case 'highlight_section':
      return (
        <section key={index} className="bg-white dark:bg-gray-800 p-5 md:p-12 rounded-3xl border-l-[12px] border-blue-800 shadow-sm space-y-8">
          {section.title && (
            <h2 className="font-bold text-blue-900 dark:text-blue-400 text-left" style={{ fontSize: 'clamp(1.3em, 5vw, 1.8em)' }}>
              {section.title}
            </h2>
          )}
          <FormattedText
            text={section.text}
            className="max-w-none text-gray-800 dark:text-gray-300 whitespace-pre-line text-left font-medium"
            style={{ fontSize: '1em' }}
          />
        </section>
      );

    case 'story':
      return (
        <section key={index} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-900 px-5 py-5 md:px-8 md:py-6">
            {section.label && (
              <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">{section.label}</p>
            )}
            {section.title && (
              <h2 className="text-white font-bold mt-1 leading-tight" style={{ fontSize: 'clamp(1.2em, 5vw, 1.5em)' }}>{section.title}</h2>
            )}
            {section.warning && (
              <p className="text-blue-200 italic mt-2" style={{ fontSize: '0.9em' }}>{section.warning}</p>
            )}
          </div>
          <div className="p-5 md:p-12 space-y-4">
            {(section.paragraphs || []).map((para, i) => (
              <FormattedText
                key={i}
                text={para}
                className="text-gray-800 dark:text-gray-200 leading-relaxed text-left font-serif"
              />
            ))}
          </div>
        </section>
      );

    case 'image':
      return (
        <figure key={index} className="flex flex-col items-center mt-8 mb-16">
          <ImageLightbox src={section.src} alt={section.alt} className="w-full max-w-full lg:max-w-3xl" />
          {section.caption && (
            <figcaption className="mt-4 text-center text-gray-500 dark:text-gray-400 italic font-medium" style={{ fontSize: '1em' }}>
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video': {
      const isDrive = section.source === 'drive';
      return (
        <section key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
          {section.title && (
            <p className="text-xs font-bold uppercase tracking-widest text-blue-800 bg-blue-50 px-4 py-2 text-left">
              {section.title}
            </p>
          )}
          <div className="w-full" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={isDrive ? `https://drive.google.com/file/d/${section.driveId}/preview` : `https://www.youtube.com/embed/${section.videoId}`}
              title={section.title || 'Vídeo complementar'}
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </section>
      );
    }

    case 'carousel':
      if (!section.images || section.images.length === 0) return null;
      return (
        <section key={index} className="my-8">
          <CarouselComponent images={section.images} />
        </section>
      );

    case 'dropdown_group': {
      const isVertical = section.layout === 'vertical';
      const gridClassName = isVertical ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4';
      return (
        <section key={index} className="space-y-8 my-12 bg-white dark:bg-gray-800 p-5 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-700">
          {(section.title || section.subtitle) && (
            <div className="text-center">
              {section.title && <h2 className="font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(1.3em, 5vw, 1.8em)' }}>{section.title}</h2>}
              {section.subtitle && <p className="mt-2 text-gray-500 text-base">{section.subtitle}</p>}
            </div>
          )}
          <div className={gridClassName}>
            {(section.items || []).map((item, i) => (
              <DropdownContent
                key={i}
                title={item.title}
                text={<FormattedText text={item.content} />}
                contentFontSizeMobile="1em"
                contentFontSizeDesktop="1em"
              />
            ))}
          </div>
        </section>
      );
    }

    case 'bullet_cards':
      return (
        <section key={index} className="space-y-6 my-12">
          {section.title && (
            <h2 className="font-bold text-gray-900 dark:text-white text-left" style={{ fontSize: 'clamp(1.2em, 5vw, 1.5em)' }}>
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-1 gap-4">
            {(section.items || []).map((itemText, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] dark:bg-blue-950/30 dark:border-blue-900 p-4 md:p-6">
                <div className="w-1.5 rounded-full self-stretch bg-[#1e40af]" />
                <FormattedText
                  text={itemText}
                  className="flex-1 text-left leading-relaxed text-gray-800 dark:text-gray-200"
                  style={{ fontSize: '1em' }}
                />
              </div>
            ))}
          </div>
        </section>
      );

    case 'timeline':
      if (!section.items || section.items.length === 0) return null;
      return (
        <section key={index} className="my-12">
          <Timeline items={section.items} />
        </section>
      );

    case 'data_table':
      return (
        <section key={index} className="my-8">
          <DataTable
            title={section.title}
            headers={section.headers || []}
            data={(section.rows || []).map((row) =>
              row.map((cell) => <FormattedText key={cell} text={cell} className="text-left" />)
            )}
          />
        </section>
      );

    case 'comparison_table':
      return (
        <section key={index} className="my-8">
          <ComparisonTable
            title={section.title}
            leftHeader={section.leftHeader}
            rightHeader={section.rightHeader}
            rows={section.rows || []}
          />
        </section>
      );

    case 'reference_box': {
      // O componente de UI só recebe `quote`; incorporamos a citação/fonte
      // no próprio HTML para não perder a informação (ver docs/CONSTRUTOR-DE-AULAS.md).
      const quoteHtml = section.citation
        ? `${section.text || ''}<br/><span style="font-size:0.85em;font-style:normal;opacity:0.75">— ${section.citation}</span>`
        : section.text || '';
      return (
        <section key={index} className="my-8">
          <ReferenceBoxColor quote={quoteHtml} />
        </section>
      );
    }

    case 'conclusion':
      return (
        <section key={index} className="my-12">
          <QuoteCard quote={section.text} author={section.author} />
        </section>
      );

    case 'quiz':
      if (!section.questions || section.questions.length === 0) return null;
      return (
        <section key={index} className="my-12">
          <InteractiveQuiz questions={section.questions} />
        </section>
      );

    case 'cta':
      return (
        <div key={index} className="my-4">
          <QuestionnairePrompt message={section.message} buttonLabel={section.buttonLabel} href={section.href} />
        </div>
      );

    case 'access_link':
      return (
        <div key={index} className="my-4">
          <AccessLink label={section.label} href={section.href} />
        </div>
      );

    default:
      return null;
  }
}

export default function LessonRenderer({ content, showAccessibilityControls = true }) {
  const [fontSize, setFontSize] = useState(16);

  if (!content) return null;
  const sections = content.sections || [];

  return (
    <div
      className="w-full bg-[#f8fafc] dark:bg-gray-900 min-h-screen transition-all duration-300"
      style={{ fontSize: `${fontSize}px` }}
    >
      {showAccessibilityControls && (
        <AccessibilityControls fontSize={fontSize} setFontSize={setFontSize} defaultSize={16} />
      )}

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10 md:space-y-16">
        <header className="relative py-8 px-5 md:py-16 md:px-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-[10px] border-blue-800 overflow-hidden">
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 text-base">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-widest rounded">
                Aula {content.aula}
              </span>
              <div className="h-px flex-grow bg-gray-100 dark:bg-gray-700" />
            </div>
            <h1 className="font-bold text-gray-900 dark:text-white leading-tight" style={{ fontSize: 'clamp(1.5em, 7vw, 2.5em)' }}>
              {content.titulo}
            </h1>
            {content.objetivo && (
              <p className="max-w-3xl text-gray-600 dark:text-gray-400 leading-relaxed font-light italic" style={{ fontSize: 'clamp(1em, 3vw, 1.1em)' }}>
                {content.objetivo}
              </p>
            )}
          </div>
        </header>

        {sections.map(renderSection)}

        <footer className="text-center pt-16 border-t border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 text-sm font-semibold tracking-widest">
          <p>© MATERIAL DIGITAL UFC • INSTITUTO UFC VIRTUAL (IUVI)</p>
        </footer>
      </div>
    </div>
  );
}
