/**
 * Text field that reformats its value as the visitor types, without moving the caret.
 * The caret goes to the end of the formatted text that came before it.
 * type="email" has no caret API, so it can't be used here; pass inputMode="email" instead.
 */
export function FormattedInput({ as: Tag = 'input', format, onValueChange, ...props }) {
  const apply = (el) => {
    const caret = format(el.value.slice(0, el.selectionStart)).length
    const next = format(el.value)
    el.value = next
    el.setSelectionRange(caret, caret)
    onValueChange(next)
  }
  return (
    <Tag
      {...props}
      onChange={(e) => (e.nativeEvent.isComposing ? onValueChange(e.target.value) : apply(e.target))}
      onCompositionEnd={(e) => apply(e.target)}
    />
  )
}
