let combineDispatch = (rootDispatch, subDispatch) => (key, value) => {
	return rootDispatch([() => subDispatch(key, value), key])
}

export default (rootDispatch, ...subDispatches) => {
	return subDispatches.reduce((left, right) => combineDispatch(left, right), rootDispatch)
}