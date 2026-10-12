import { FIELD_TYPES } from '@lesson';
import {
  TextField,
  TextAreaField,
  SelectField,
  StringListField,
  ObjectListField,
  DataTableRowsField,
} from './fieldInputs';
import NestedBlocks from './NestedBlocks';
import LatexField from './LatexField';

// Renderiza o campo de formulário correto para um `field` do catálogo
// (src/components/LessonRenderer/sectionCatalog.js), lendo/gravando em
// `value` via `onChange`. `siblingValues` dá acesso aos outros campos do
// mesmo bloco (usado por `showIf` e pela tabela de dados, cujas linhas
// dependem da quantidade de colunas definida em outro campo).
export default function SchemaField({ field, value, onChange, siblingValues = {} }) {
  if (field.showIf && siblingValues[field.showIf.field] !== field.showIf.equals) {
    return null;
  }

  switch (field.type) {
    case FIELD_TYPES.TEXT:
      return <TextField label={field.label} help={field.help} value={value} onChange={onChange} />;

    case FIELD_TYPES.TEXTAREA:
      return <TextAreaField label={field.label} help={field.help} value={value} onChange={onChange} rows={field.rows} rich={field.rich} />;

    case FIELD_TYPES.SELECT:
      return <SelectField label={field.label} help={field.help} value={value} onChange={onChange} options={field.options} />;

    case FIELD_TYPES.STRING_LIST:
      return (
        <StringListField
          label={field.label}
          help={field.help}
          value={value}
          onChange={onChange}
          itemType={field.itemType}
          rich={field.rich}
          addLabel={field.addLabel}
        />
      );

    case FIELD_TYPES.OBJECT_LIST:
      return (
        <ObjectListField
          label={field.label}
          help={field.help}
          value={value}
          onChange={onChange}
          itemFields={field.itemFields}
          addLabel={field.addLabel}
          renderItemField={(subField, subValue, subOnChange) => (
            <SchemaField field={subField} value={subValue} onChange={subOnChange} />
          )}
        />
      );

    case FIELD_TYPES.DATA_TABLE_ROWS:
      return (
        <DataTableRowsField
          label={field.label}
          headers={siblingValues[field.headersKey] || []}
          value={value}
          onChange={onChange}
        />
      );

    case FIELD_TYPES.LATEX:
      return <LatexField label={field.label} help={field.help} value={value} onChange={onChange} />;

    case FIELD_TYPES.BLOCKS:
      return (
        <div>
          {field.label && <p className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</p>}
          <NestedBlocks value={value} onChange={onChange} />
        </div>
      );

    default:
      return null;
  }
}
