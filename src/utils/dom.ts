export function focusOnInput(id: string) {
  const elementToFocus = document.querySelector(`#${id}`) as HTMLInputElement;

  if (!elementToFocus) return;
  elementToFocus.focus();
}
