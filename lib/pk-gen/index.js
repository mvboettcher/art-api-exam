const {
	compose,
	toLower,
	replace,
	concat,
	trim,
	join,
	slice,
	split
} = require('ramda')

module.exports = (prefix, replaceVal, str) => {
	const modifiedStr = split(' ', str)
	if (modifiedStr[0] === 'The' || modifiedStr[0] === 'A') {
		return compose(
			toLower,
			replace(/ /g, replaceVal),
			concat(prefix),
			concat('_'),
			join(' '),
			slice(1, Infinity)
		)(modifiedStr)
	}
	return compose(
		toLower,
		replace(/ /g, replaceVal),
		concat(prefix),
		concat('_'),
		trim
	)(str)
}
