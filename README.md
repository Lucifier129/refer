# refer
redux-like library for handling global state on functional style

## refer 介绍

refer 是一个状态管理库，受到了 [redux](https://github.com/rackt/redux) 的启发和影响，源码结构以及 API 也高度相似。所不同的是，refer 体积更小，概念更少，灵活性更强。

通常来说，用户只需要用到 `createStore` 一个 api。去掉了 redux 的 combineReducers、bindActionCreators 以及 applyMiddleware 等动作。

在深入了解 refer 之后，你将发现，那些概念是不必要的。每个动作都是一个 handler，所谓的 middleware、actionCreator 和 reducer 等， 只是一串相继执行的 handlers 的不同阶段而已。

## 引入 refer

```shell
npm install refer
```

refer 遵循 UMD 模块规范。在没有模块化环境时，将输出到全局变量 `Refer`。

### `script` 标签引入

```html
<script src="refer.min.js"></script>
<script>console.log(Refer)</script>
```

### AMD 模块加载

```javascript
define(['refer'], function(Refer) {
	console.log(Refer)
})
```

### commonjs

```javascript
var Refer = require('refer')
console.log(Refer)
```

### ES2015

```javascript
import Refer from 'refer'
console.log(Refer)
```

## 理解 refer

refer 跟 redux 一样，崇尚(pure function)纯函数。

### 什么是 refer handler？

`refer handler` 是接受一个参数并返回一个值的普通函数，或者这类函数所组成的数组，甚至可以任意嵌套。

```javascript
// 返回一个数的后继
let succ = n => n + 1
let double = x => x * 2
let succ_double = [succ, double]
let handler1 = [succ, [double, succ], double]
```

### 什么是 refer handlers？

`refer handlers` 是一个 key-value 对象。value 为 `refer handler`， key 则是其字符串代号。

```javascript
let handlers = {
	succ: n => n + 1,
	double: x => x * 2,
	succ_double: ['succ', 'double'],
	key1: 'succ',
	key2: ['succ', [x => x - 1, 'key1']]
}
```

`refer handlers` 的 key 可以作为 value，或者 value 数组里的一项，增加复用能力。

### 你已经掌握了 refer 的一半。

`refer` 的 `createStore` 函数，接受两个参数: `handlers` 和 `initialState`，返回一个对象。

`handlers` 就是你刚才所掌握的，单参数函数的排列组合与命名。`initialState` 则默认为空对象`{}`

`createStore` 返回的对象拥有几个属性。

#### getState 函数

返回当前 state 数据，默认是 `initialState`，除非 state 被改变。

#### subscribe(callback) 函数

订阅 state 变化的消息，callback 被调用时不接受任何参数。该订阅函数将返回一个解除订阅的函数。

#### replaceState(nextState, silent) 函数

用 nextState 替换当前的 state，如果 silent 为 true，则不触发消息发布

#### dispatch(key, value) 函数

接受两个参数 key 与 value，key 匹配出 `refer handlers`对象里的 `handler`，然后以 `pipe` 的形式依次执行里面的函数。

第一个函数接收的参数为 value，第二个函数接收的参数为第一个函数的返回值，以此类推。

注意：最后一个函数必须返回一个更新 state 的函数。dispatch 方法在同步 handler 时返回更新后的 state

```javascript
let handlers = {
	add: [n => n * 2, n => n / 2, n => state => state + n],
	reduce: n => state => state - n
}
// initialState 不要求必须是对象，可以是任意值
let store = createStore(handlers, 0)
store.dispatch('add', 10) // 返回最新的 state: 10
store.dispatch('reduce', 100) // 返回最新的 state: 99
```

handler 里的任意函数都可以返回一个 promise，它后面的函数将会在 promise.then 之后继续进行。不需要像`redux-promise`这类中间件的支持，refer 天生支持异步。

如果有函数返回 promise，dispatch 方法返回的也是 promise。

注意：在两种情况下，dispatch 返回的是 promise 对象

- handler 里的某个函数返回 promise
- handler 里任意函数抛出错误，这个错误将以 Promise.reject(error) 形式返回。

```javascript
let handlers = {
	add: [n => n * 2, n => n / 2, n => state => state + n],
	reduce: n => state => state - n,
	asyncAdd: n => state => Promise.resolve(state + n),
	errorAdd: n => state => { throw new Error('I am error')}
}
let store = createStore(handlers, 0)

store.dispatch('add', 10) // 返回最新的 state: 10

// 异步返回最新的 state
store.dispatch('asyncAdd', 10)
	.then(state => console.log(state)) // 20
store.dispatch('errorAdd', 100)
	.catch(error => console.log(error.message)) // I am error
```

由于 dispatch 函数在同步和异步两种情况下都可能返回 promise。可以用下面列举的方式，兼顾成功与失败两种情形。

- 确定 handler 中所有函数都是同步执行的情况
	* 判断 dispatch 的返回值是不是 thenable 对象，如果是，则说明存在错误

- handler 里的函数有可能同步也有可能异步的情况
	* 用 Promise.resolve(dispatch(key, value)).then(success).catch(fail) 处理

- handler 里存在异步情况
	* dispatch(key, value).then(success).catch(fail)

#### actions 对象

`actions` 对象的 key 跟 `refer handlers` 完全一致，它的值则是一个函数: value => dispatch(key, value)。

因此，你再需要使用 `bindActionCreators` 函数手动构造一个 `actions`。refer 已经提供好了。

```javascript
let handlers = {
	add: [n => n * 2, n => n / 2, n => state => state + n],
	reduce: n => state => state - n,
	asyncAdd: n => state => Promise.resolve(state + n),
	errorAdd: n => state => { throw new Error('I am error')}
}
let store = createStore(handlers, 0)
let { add, asyncAdd, errorAdd } = store.actions

add(10) // 返回最新的 state: 10

// 异步返回最新的 state
asyncAdd(10)
	.then(state => console.log(state)) // 20
errorAdd(100)
	.catch(error => console.log(error.message)) // I am error
```

### 你已经掌握了 refer 的八成

refer 的理念非常简单，就是依次执行一组函数，根据 key 来调节各组函数的执行时机，根据各个函数是否返回 promise 来决定下一个函数是同步还是异步执行。

## refer 的高级用法

### 如何写中间件？

redux 的中间件是一个函数，而 refer 的中间件则是一个可复用的 `refer handlers`

`createStore(handlers, initialState)` 的 handlers 参数，支持数组类型，也就是说，你可以把多个 handlers 打包成一个数组传入。

```javascript
createStore([handlers1, handlers2, handlers3])
```

各个 handlers 的同名 handler，会按照 handlers 在数组里的索引顺序拼接起来。

```javascript
// 多个 handlers 将拼接成一个更大的 handlers 对象
{
	[key]: [handler1.key, handler2.key, handler3.key]
}
```

也就是说，handler2 的某个 key 所对应的 handler 的第一个函数，其接收的参数将收到 handlers1 的影响，如果它没有同名的 handler，则接收 value，如果它有，则接受 handers1[key] 所返回的值。

值得注意的是，每个 handlers 的 key ，其代号意义，只在该 handlers 对象中有效。不能在 handlersA 中使用它不存在，但 handlersB 中存在的 handler 代号。

### 了解 refer 的生命周期钩子

handlers 的 key 没有限制。但 refer 选取了几个特殊的 key 值，它们不参与更新 state。

`handlers[lifeCycleHook]` 将在 dispatch 函数执行的各个特定阶段依次被调用，它们会被传入相应一个对象参数 `data`

- `data.key`: dispatch 的 key 参数
- `data.value`: dispatch 的 value 参数
- `data.currentState`: 当前的 state
- `data.nextState`: 下一个 state
- `data.error`: dispatch 出错时的错误信息


#### @SHOULD_DISPATCH

在 dispatch 执行时，最先被调用的生命周期函数，如果它返回 false，将终止此次 dispatch。该函数的 data 参数只有 key 、value、 currentState 三个属性。

#### @DISPATCH

紧接着 @SHOULD_DISPATCH 之后，该生命周期函数被调用，data 参数的属性与 @SHOULD_DISPATCH 相同。

#### @SHOULD_UPDATE

在 nextState 存在时被调用，data 参数的属性有 key、 value、 currentState 与 nextState 四个，如果它返回 false，将终止更新 state。

#### @WILL_UPDATE

在 currentState 即将被 nextState 所替换前调用，data 参数与 @SHOULD_UPDATE 相同。

#### @DID_UPDATE

在 currentState 被 nextState 所替换后调用，data 参数与 @SHOULD_UPDATE 相同。注意：此时的 `data.nextState` 才是跟 store.getState() 返回值相等。

#### @SYNC

在 currentState 以同步方式被更新后调用，参数与 @SHOULD_UPDATE 相同。

#### @ASYNC_START

在 currentState 以异步方式更新开始阶段被调用，data 参数为 key、value、currentState 与 nextState，其中 nextState 为 promise 对象。

#### @ASYNC_END

在 currentState 以异步方式更新结束时调用，data 参数为 key、value、currentState 与 (nextState || error )。当异步更新成功时，nextState 属性存在，error 不存在；当异步更新存在错误时，nextState 不存在，error 存在。

#### @THROW_ERROR

当 dispatch 中存在错误时调用，该生命周期函数将接收一个 error 参数对象。该函数的返回值将被 Promise.reject 包裹，作为 dispatch 的返回值。

也就是说，用户可以通过 @THROW_ERROR 钩子，控制 dispatch 出错时返回的 promise 对象携带的错误信息是什么。用户可以 `dispatch(key, value).catch(fail)` 进行处理。

注意：dispatch 时的所有错误信息都会进入这个生命周期钩子函数，包括 handler 里的函数故意抛出的错误，或者返回 Promise.reject。

## 了解 refer 的生态

refer 还比较新，目前并没有社区生态，希望你能加入。

[refer-logger](https://github.com/Lucifier129/refer-logger) 是根据 refer 生命周期钩子写的日志中间件。

```javascript
import createLogger from 'refer-logger'
let logger = createLogger({
	scope: 'scopeName',
	debug: true
})
```

`createLogger` 接受一个对象参数，scope 属性默认为 `Root`， debug 为 true 时则在 @THROW_ERROR 钩子中抛出错误（因为部分浏览器不显示 promise 里包含的错误信息）。

当 action 被调用时，控制台将输出 key、value、nextState、currentState 以及此 action 的发生时间，消耗时长等信息。

[refer-dom](https://github.com/Lucifier129/refer-dom) 是 refer 与 virtual-dom 结合的产物，它完整模拟了 `react` 的 component api，可以无缝跑起 react component 代码，只需要将 react 依赖指向 refer-dom 即可。

refer-dom 的 component api 是 react component 的超集，你可以在组件的 getHandlers 方法返回自定义的 handlers，然后用组件的 actions 属性里的函数来更新组件的 state。setState 方法在 refer-dom 里，只是更新 state 的其中一个 action 而已。

基于 refer 是如此简单易用，相信你能发挥出更大的威力。一起来构建 refer 生态吧。