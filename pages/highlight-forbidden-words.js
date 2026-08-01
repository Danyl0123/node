"use strict";
const highlightForbiddenWords = (text, forbiddenWords) => {
    if (forbiddenWords.length === 0)
        return text;
    const pattern = forbiddenWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
    return text.replace(regex, "<del>$1</del>");
};
// const text = "This is a test sentence with some bad words.";
// const forbiddenWords = ["bad", "test"];
// const result = highlightForbiddenWords(text, forbiddenWords);
// console.log(result);
