// prettier.config.js or .prettierrc.js
module.exports = {
	// tab 缩进大小,默认为 2
	tabWidth: 2,
	// 使用 tab 缩进，默认 false
	useTabs: true,
	// 使用分号, 默认 true
	semi: false,
	// 使用单引号, 默认 false(在 jsx 中配置无效, 默认都是双引号)
	singleQuote: true,
	// 对象中的空格 默认 true
	// true: { foo: bar }
	// false: {foo: bar}
	bracketSpacing: true,
	// JSX 标签闭合位置 默认 false
	// false: <div
	//          className=""
	//          style={{}}
	//       >
	// true: <div
	//          className=""
	//          style={{}} >
	jsxBracketSameLine: true
}
