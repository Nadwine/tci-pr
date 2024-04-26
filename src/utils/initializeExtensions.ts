// type definition lives in ./types/index.d.ts
String.prototype.capitalFirstLetter = function (): string {
  var text = this;
  return text.charAt(0).toUpperCase() + text.slice(1);
};
