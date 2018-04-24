import { DataSelector } from "../src/DataSelector";
import { Tokenizer } from "../src/tokenizer/Tokenizer";
import { Parser } from "../src/parser/Parser";

describe('DataSelector', () => {
    describe('#parse', () => {
        it('throws a SyntaxError when selector syntax has no matches', () => {
            const selector = new DataSelector(new Parser(new Tokenizer()));
            expect(() => selector.parse('???')).toThrow('Unexpected token "?" at position "0"');
        });

        it('throws a SyntaxError when selector syntax is invalid', () => {
            const selector = new DataSelector(new Parser(new Tokenizer()));

            expect(() => selector.parse('?prop')).toThrow('Unexpected token "?" at position "0"');
        });
    });

    describe('#select', () => {
        it('returns data when no node is present', () => {
            const data = {};
            const selector = new DataSelector(new Parser(new Tokenizer()));

            expect(selector.select(data)).toBe(data);
        });

        describe('property accessors', () => {
            it('accepts a property accessor', () => {
                const data = { prop: 'value' };
                const value = data.prop;

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('.prop');
                const result = selector.select(data, node);

                expect(result).toBe(value);
            });

            it('accepts a nested property accessor', () => {
                const data = { prop1: { prop2: { prop3: 'value' } } };
                const value = data.prop1.prop2.prop3;

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('.prop1.prop2.prop3');
                const result = selector.select(data, node);

                expect(result).toBe(value);
            });

            it('accepts a flatMap modifier', () => {
                const data = [ { value: 1 }, { value: 2 }, { value: 3 } ];
                const value = [1, 2, 3];

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('.value[]');
                const result = selector.select(data, node);

                expect(result).toEqual(value);
            });

            it('throws a SyntaxError when data selected with flatMap is not an array', () => {
                const data = { prop: 1 };
                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('.prop[]');

                expect(() => selector.select(data, node)).toThrow('Data is not an array for flat map property (.prop[])');
            });
        });

        describe('method accessors', () => {
            it('accepts a method accessor', () => {
                const data = { prop: () => 'value' };
                const value = data.prop();

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#prop');
                const result = selector.select(data, node);

                expect(result).toBe(value);
            });

            it('accepts a nested method accessor', () => {
                const data = { prop1: () => ({ prop2: () => ({ prop3: () => 'value' }) }) };
                const value = data.prop1().prop2().prop3();

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#prop1#prop2#prop3');
                const result = selector.select(data, node);

                expect(result).toBe(value);
            });

            it('throws a SyntaxError when no property for selector exists', () => {
                const data = { prop2: 1 };
                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#prop');

                expect(() => selector.select(data, node)).toThrow('No method "prop" in data (#prop)');
            });

            it('throws a SyntaxError when property for selector is not a function', () => {
                const data = { prop: 1 };
                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#prop');

                expect(() => selector.select(data, node)).toThrow('Property "prop" is not a function (#prop)');
            });

            it('accepts a flatMap modifier', () => {
                const data = [ { value: () => 1 }, { value: () => 2 }, { value: () => 3 } ];
                const value = [1, 2, 3];

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#value[]');
                const result = selector.select(data, node);

                expect(result).toEqual(value);
            });

            it('throws a SyntaxError when data selected with flatMap is not an array', () => {
                const data = { prop: () => 1 };
                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('#prop[]');

                expect(() => selector.select(data, node)).toThrow('Data is not an array for flat map property (#prop[])');
            });
        });

        describe('default accessor', () => {
            it('assumes an empty starting accessor as property accessor', () => {
                const data = { prop1: { prop2: { prop3: () => 'value' } } };
                const value = data.prop1.prop2.prop3();

                const selector = new DataSelector(new Parser(new Tokenizer()));
                const node = selector.parse('prop1.prop2#prop3');
                const result = selector.select(data, node);

                expect(result).toBe(value);
            });
        });
    });
});
