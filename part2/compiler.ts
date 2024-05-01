import * as ts from "typescript";

// recursively visit the given difinition
const visit = (node: ts.Node) => {
  if (ts.isTypeAliasDeclaration(node)) {
    // get name of given type
    const typeName = node.name.getText();

    // decapitalise first character to form variable name
    const variableName = typeName.charAt(0).toLowerCase() + typeName.slice(1);

    // recursively visit the rest of it to obtain actual type definition
    const typeDef = visit(node.type);

    return { [variableName]: typeDef };
  } else if (ts.isTypeLiteralNode(node)) {
    const obj = {};

    // to support multiple field names
    node.members.forEach((member) => {
      if (
        ts.isPropertySignature(member) &&
        member.name &&
        member.type &&
        ts.isIdentifier(member.name)
      ) {
        obj[member.name.text] = visit(member.type);
      }
    });

    return obj;
  } else if (ts.isUnionTypeNode(node)) {
    // convert union to a list of inner types
    return node.types.map((type) => visit(type));
  } else if (ts.isLiteralTypeNode(node)) {
    // for common literals
    if (node.literal.kind === ts.SyntaxKind.StringLiteral) {
      return node.literal.text;
    } else if (node.literal.kind === ts.SyntaxKind.NumericLiteral) {
      return Number(node.literal.text);
    } else if (node.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    } else if (node.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    }

    // For other types of literal
    return node.literal.getText();
  } else {
    // to handle a few other common types here
    if (node.kind === ts.SyntaxKind.StringKeyword) {
      return "string";
    } else if (node.kind === ts.SyntaxKind.NumberKeyword) {
      return "number";
    } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
      return "boolean";
    }

    // for unsupported types
    return "UnknownType";
  }
};

const convertToObject = (type: string) => {
  const sourceFile = ts.createSourceFile(
    "tmp.ts",
    type,
    ts.ScriptTarget.ES2015,
    true
  );
  const typeAlias = sourceFile.statements.find(ts.isTypeAliasDeclaration);

  if (!typeAlias) {
    throw new Error("Cannot parse the type string");
  }

  const outputObject = visit(typeAlias);

  return outputObject;
};

// example usage
const object = convertToObject(`type Button = {
    variant1: "solid" | "text";
    variant2: {
        innerVariant: string;
    };
    variant3: 1 | 2;
    variant4: true | false;
    variant5: number;
    variant6: string;
    variant7: boolean;
    };`);

console.log(object);
