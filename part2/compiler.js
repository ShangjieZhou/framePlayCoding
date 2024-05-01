"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
// recursively visit the given difinition
var visit = function (node) {
    var _a;
    if (ts.isTypeAliasDeclaration(node)) {
        // get name of given type
        var typeName = node.name.getText();
        // decapitalise first character to form variable name
        var variableName = typeName.charAt(0).toLowerCase() + typeName.slice(1);
        // recursively visit the rest of it to obtain actual type definition
        var typeDef = visit(node.type);
        return _a = {}, _a[variableName] = typeDef, _a;
    }
    else if (ts.isTypeLiteralNode(node)) {
        var obj_1 = {};
        // to support multiple field names
        node.members.forEach(function (member) {
            if (ts.isPropertySignature(member) &&
                member.name &&
                member.type &&
                ts.isIdentifier(member.name)) {
                obj_1[member.name.text] = visit(member.type);
            }
        });
        return obj_1;
    }
    else if (ts.isUnionTypeNode(node)) {
        // convert union to a list of inner types
        return node.types.map(function (type) { return visit(type); });
    }
    else if (ts.isLiteralTypeNode(node)) {
        // for common literals
        if (node.literal.kind === ts.SyntaxKind.StringLiteral) {
            return node.literal.text;
        }
        else if (node.literal.kind === ts.SyntaxKind.NumericLiteral) {
            return Number(node.literal.text);
        }
        else if (node.literal.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        }
        else if (node.literal.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        }
        // For other types of literal
        return node.literal.getText();
    }
    else {
        // to handle a few other common types here
        if (node.kind === ts.SyntaxKind.StringKeyword) {
            return "string";
        }
        else if (node.kind === ts.SyntaxKind.NumberKeyword) {
            return "number";
        }
        else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
            return "boolean";
        }
        // for unsupported types
        return "UnknownType";
    }
};
var convertToObject = function (type) {
    var sourceFile = ts.createSourceFile("tmp.ts", type, ts.ScriptTarget.ES2015, true);
    var typeAlias = sourceFile.statements.find(ts.isTypeAliasDeclaration);
    if (!typeAlias) {
        throw new Error("Cannot parse the type string");
    }
    var outputObject = visit(typeAlias);
    return outputObject;
};
// object type
var object = convertToObject("type Button = {\n    variant1: \"solid\" | \"text\";\n    variant2: {\n        innerVariant: string;\n    };\n    variant3: 1 | 2;\n    variant4: true | false;\n    variant5: number;\n    variant6: string;\n    variant7: boolean;\n    };");
console.log(object);
