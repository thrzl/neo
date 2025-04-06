import "@gouch/to-title-case";

declare global {
    interface String {
      toRespectfulLowerCase(): string;
      toTitleCase(): string;
    }
  }
  

// only lowercase if the text is in grammatical title case
String.prototype.toRespectfulLowerCase = function () {
    if (this === this.toUpperCase() || this === this.toLowerCase()) {
        return this.toString();
    }
    // if text is titlecase or first letter of the entire string is uppercase,
    // convert it to lowercase
    if (this.toTitleCase() === this || this.charAt(0) === this.charAt(0).toUpperCase()) {
        return this.toLowerCase();
    }
    return this.toString();
}