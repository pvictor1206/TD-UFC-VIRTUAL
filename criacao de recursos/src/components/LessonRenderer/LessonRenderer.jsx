import { Fragment, useMemo, useState } from 'react';
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
import { migrateSection, migrateSections } from './migrate';
import { lessonThemeStyle } from './theme';
import { spacingValue } from './spacing';

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
  // Aulas no formato antigo (blocos com título embutido) são convertidas na hora.
  const migrated = migrateSection(section);
  if (migrated.length !== 1 || migrated[0] !== section) {
    return <Fragment key={index}>{migrated.map((m, i) => renderSection(m, i))}</Fragment>;
  }

  switch (section.type) {
    case 'section':
      // Título como componente separado: agrupa os blocos que vêm dentro dele.
      return (
        <section
          key={index}
          className="space-y-4"
          style={spacingValue(section.spaceAfter) !== undefined ? { marginBottom: spacingValue(section.spaceAfter) } : undefined}
        >
          {(section.label || section.title || section.subtitle) && (
            <div className="space-y-1">
              {section.label && (
                <p className="text-blue-600 text-[0.7em] font-bold uppercase tracking-widest">{section.label}</p>
              )}
              {section.title && (
                <h2 className="font-bold text-ink text-left leading-tight" style={{ fontSize: 'clamp(1.15em, 4vw, 1.4em)' }}>
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-ink/70 italic" style={{ fontSize: '0.9em' }}>{section.subtitle}</p>
              )}
            </div>
          )}
          {(section.children || []).map((child, i) => {
            const element = renderSection(child, i);
            const gap = spacingValue(section.gap);
            const own = spacingValue(child.spaceAfter);
            if (gap === undefined && own === undefined) return element;
            // Espaçamento escolhido: neutraliza as margens próprias do componente
            // e aplica a medida definida (do componente, senão a da seção).
            return (
              <div key={i} className="[&>*]:my-0! last:mb-0!" style={{ marginBottom: own ?? gap }}>
                {element}
              </div>
            );
          })}
        </section>
      );

    case 'intro':
      // Texto corrido, sem container (identidade visual do anexo).
      return (
        <FormattedText
          key={index}
          text={section.text}
          className="max-w-none text-ink text-justify leading-[1.75]"
          style={{ fontSize: '1em' }}
        />
      );

    case 'image':
      return (
        <figure key={index} className="flex flex-col items-center mt-8 mb-16">
          <ImageLightbox src={section.src} alt={section.alt} className="w-full max-w-full lg:max-w-3xl" />
          {section.caption && (
            <figcaption className="mt-3 text-center text-ink/70 italic" style={{ fontSize: '1em' }}>
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video': {
      const isDrive = section.source === 'drive';
      return (
        <section key={index} className="my-4 overflow-hidden rounded-[10px]">
          {section.title && (
            <p className="text-xs font-bold uppercase tracking-wide text-ink bg-lav px-4 py-2 text-left">
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
      const gridClassName = isVertical ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 md:grid-cols-2 gap-2';
      return (
        <section key={index} className="space-y-4">
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
        <section key={index} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {(section.items || []).map((itemText, i) => (
              <div key={i} className="flex gap-3 rounded-[6px] bg-lav-soft p-4 md:p-5">
                <div className="w-1.5 rounded-full self-stretch bg-lav-bar" />
                <FormattedText
                  text={itemText}
                  className="flex-1 text-left leading-relaxed text-ink"
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

  const sections = useMemo(() => migrateSections(content?.sections || []), [content]);

  if (!content) return null;

  return (
    <div
      className="w-full bg-white min-h-screen transition-all duration-300 text-ink"
      style={{ fontSize: `${fontSize}px`, ...lessonThemeStyle(content.cor) }}
    >
      {showAccessibilityControls && (
        <AccessibilityControls fontSize={fontSize} setFontSize={setFontSize} defaultSize={16} />
      )}

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-10">
        <header className="relative py-5 px-5 md:py-8 md:px-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-[10px] border-[color:var(--lesson-accent,#1e40af)] overflow-hidden">
          <div className="relative z-10 space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 text-base">
              <span className="px-3 py-1 bg-[color:var(--lesson-accent-soft,#eff6ff)] text-[color:var(--lesson-accent,#1e40af)] text-xs font-bold uppercase tracking-widest rounded">
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

        <div className="space-y-8 md:space-y-10" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
          {sections.map(renderSection)}
        </div>

        <footer className="text-center pt-16 border-t border-lav text-ink/50 text-xs font-semibold tracking-widest">
          <p>© MATERIAL DIGITAL UFC • INSTITUTO UFC VIRTUAL (IUVI)</p>
        </footer>
      </div>
    </div>
  );
}
