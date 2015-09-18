let combineDispatch = (rootDispatch, subDispatch) => (key, value) => {
	return rootDispatch([value => subDispatch(key, value), key], value)
}

export default (rootDispatch, ...subDispatches) => {
	return subDispatches.reduce(combineDispatch, rootDispatch)
}