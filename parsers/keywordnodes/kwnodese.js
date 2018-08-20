const constants = require("../../constants.js");
const BaseNode = require("../basenode.js");
const bracketExpressionNl = require("../nodeLiterals/bracketexpressionnl.js");

class KwNodeSe extends BaseNode {

    constructor() {
        super()
        if (!(bracketExpressionNl instanceof BaseNode)) {
            throw new Error("Dependency brackExpressionNl must be of type BaseNode");
        } 
    }

    getNode() {
        this.skipKeyword(constants.KW.SE);

        const node =  {
            operation: constants.KW.SE,
            condition: bracketExpressionNl.getNode.call(this, false),
            then: this.parseBlock(constants.KW.SE),
        };

        if (this.lexer.isNotEndOfFile() && this.lexer.peek().value == constants.KW.TABI) {
            this.skipKeyword(constants.KW.TABI);
            node.else = this.parseBlock(constants.KW.TABI);
        }

        return node;
    }
}

module.exports = new KwNodeSe();