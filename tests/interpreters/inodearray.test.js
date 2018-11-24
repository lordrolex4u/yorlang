const MainInterpreter = require("../../interpreters/maininterpreter.js");
const iNodeArray = require("../../interpreters/inodearray.js");
const Environment = require("../../environment.js");
const kwNodeTi = require("../../parsers/keywordnodes/kwnodeti.js");
const Parser = require("../../parsers/parser.js");
const Lexer = require("../../lexer.js");
const InputStream = require("../../inputstream.js");
const constants = require("../../constants.js");

describe("INodeArray test suite", () => {
    let mainInterpreter, parser;

    beforeEach(() => {
        parser = new Parser(new Lexer(new InputStream()));
        mainInterpreter = new MainInterpreter(new Environment());
        global.console.log = jest.fn();
    });

    test("it should return an array literal", () => {
        parser.lexer.inputStream.code = `${constants.KW.TI} a = [1,2,b];`;
        const node = kwNodeTi.getNode.call(parser);
        expect(() => iNodeArray.interpreteNode.call(mainInterpreter, node.right)).toThrow();
    });

    test("it should return an empty array literal", () => {
        parser.lexer.inputStream.code = `${constants.KW.TI} a = [];`;
        const node = kwNodeTi.getNode.call(parser);
        expect(iNodeArray.interpreteNode.call(mainInterpreter, node.right)).toEqual([]);
    });

    test("it should interprete expression that contains a variable reference", () => {
        parser.lexer.inputStream.code = `
            ${constants.KW.TI} a = 5;
            ${constants.KW.TI} b = [1,2,a];
        `;

        mainInterpreter.interpreteProgram(parser);
        expect(mainInterpreter.environment().getTi(mainInterpreter.getCurrentScope(), "b")).toEqual([1,2,5]);
    });

    test("it should interprete expression that contains an array element reference", () => {
        parser.lexer.inputStream.code = `
            ${constants.KW.TI} a = [3,2];
            ${constants.KW.TI} b = [1,2,a[0]];
        `;

        mainInterpreter.interpreteProgram(parser);
        expect(mainInterpreter.environment().getTi(mainInterpreter.getCurrentScope(), "b")).toEqual([1,2,3]);
    });

    test("it should interprete a multidimensional array", () => {
        parser.lexer.inputStream.code = `
            ${constants.KW.TI} a = [3,4];
            ${constants.KW.TI} b = [[1,2], [3,a[1]]];
        `;

        mainInterpreter.interpreteProgram(parser);
        expect(mainInterpreter.environment().getTi(mainInterpreter.getCurrentScope(), "b")).toEqual([[1,2],[3,4]]);
    });

    test("it should interprete a multidimensional array element", () => {
        parser.lexer.inputStream.code = `
            ${constants.KW.TI} a = [3,4];
            ${constants.KW.TI} b = [[1,2], [3,a[1]]];
            ${constants.KW.SOPE} b[1][1];
        `;

        mainInterpreter.interpreteProgram(parser);
        expect(global.console.log).toHaveBeenCalledWith(4);
    });

    test("it should fail when trying to access an invalid multidimensional array element", () => {
        parser.lexer.inputStream.code = `
            ${constants.KW.TI} a = [3,4];
            ${constants.KW.TI} b = [[1,2], [3,a[1]]];
            ${constants.KW.SOPE} b[1][1][0];
        `;

        expect(() => mainInterpreter.interpreteProgram(parser)).toThrow();
    });
});