import { DataSelector } from "./DataSelector";
import { DataSelectorContainer } from "./DataSelectorContainer";
import { Parser } from "./parser/Parser";
import { Tokenizer } from "./tokenizer/Tokenizer";
import { TokenizerContext } from "./tokenizer/TokenizerContext";

export {
    DataSelector,
    DataSelectorContainer,
    Parser,
    Tokenizer,
    TokenizerContext
}

export function createSelector(queryString) {
    const tokenizer = new Tokenizer();
    const parser = new Parser(tokenizer);
    const selector = new DataSelector(parser);

    const node = selector.parse(queryString);
    return new DataSelectorContainer(node, selector);
}
