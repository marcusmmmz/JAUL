enum TokenTypes {
	IDENTIFIER,
	LITERAL,
	OPERATOR,
	KEYWORD,
	DELIMITER,
}

class Token {
	constructor(
		public value : string,
		public type : TokenTypes
	){}
}

class BinaryTree<T> {
	constructor(
		public value : T,
		public left? : BinaryTree<T>,
		public right? : BinaryTree<T>,
	){}
}

class Expr extends BinaryTree<Token> {}

function scan(input : string) : Token[] {
	let output : Token[] = []

	let isDigit = (char : string)=>"0123456789".split("").includes(char);
	let isBinOp = (char : string)=>"+-*/".split("").includes(char);

	let sequence : string[] = []
	let i = 0
	while (input.length > i) {
		sequence = []

		while(isDigit(input[i])) {
			sequence.push(input[i])
			i++
		}
		if (sequence.length > 0) {
			output.push( new Token(sequence.join(""), TokenTypes.LITERAL) )
			continue
		}
		
		while(isBinOp(input[i])) {
			sequence.push(input[i])
			i++
		}
		if (sequence.length > 0) {
			output.push( new Token(sequence.join(""), TokenTypes.OPERATOR) )
			continue
		}

		throw new Error("invalid char: " + input[i])
	}
	return output
}

function prettyPrintTree(tree : Expr) : string {
	let output = ""

	if(tree.left) output += `(${prettyPrintTree(tree.left)}`
	output += tree.value.value
	if(tree.right) output += `${prettyPrintTree(tree.right)})`

	return output
}

function parseExpr(expr : Token[]) : Expr {
	let i = 0
	while (i < expr.length) {
		let el = expr[i]

		if (el.type == TokenTypes.OPERATOR) {
			return new Expr(
				el,
				parseExpr(expr.slice(0, i)),
				parseExpr(expr.slice(i+1, expr.length)),
			)
		}

		i++
	}

	return new Expr(expr[0])
}

function interpretExpr(expr : Expr) : BinaryTree<any>  {
	if ( !(expr.left && expr.right) ) return expr.value

	switch (expr.value.type) {
		case TokenTypes.OPERATOR:
			if ( !(expr.left && expr.right) ) break;
		
			let left = parseInt(interpretExpr(expr.left).value)
			let right = parseInt(interpretExpr(expr.right).value)
			
			let binOps : {[key:string]:number} = {
				"+":left+right,
				"-":left-right,
				"*":left*right,
				"/":left/right
			}

			return new BinaryTree(binOps[expr.value.value])
	}
	
	throw new Error("hey")
}

function run(input : string) {
	console.log(input);
	let scanned = scan(input);
	console.log( scanned.map(v=>v.value) )
	let parsed = parseExpr(scanned);
	console.log( prettyPrintTree(parsed) )
	let interpreted = interpretExpr(parsed)
	console.log( interpreted.value );
}

run(`40*4+8`)