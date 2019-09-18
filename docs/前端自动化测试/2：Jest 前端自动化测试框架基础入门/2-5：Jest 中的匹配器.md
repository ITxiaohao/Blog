---
title: '2-5：Jest 中的匹配器'
date: 2019-07-24
permalink: 'test-learn-jest-matchers'
---

[lesson4 源码]

新建 `matchers.test.js`

以下会罗列出比较常用的匹配器

## 普通

**toBe：object.is 相当于 ===**

```js
test('测试加法 3 + 7', () => {
  // toBe 匹配器 matchers object.is 相当于 ===
  expect(10).toBe(10)
})
```

**toEqual：内容相等，匹配内容，不匹配引用**

```js
test('toEqual 匹配器', () => {
  // toEqual 匹配器 只会匹配内容，不会匹配引用
  const a = { one: 1 }
  expect(a).toEqual({ one: 1 })
})
```

**与真假有关的匹配器**

## 真假

**toBeNull：只匹配 Null**

```js
test('toBeNull 匹配器', () => {
  // toBeNull
  const a = null
  expect(a).toBeNull()
})
```

**toBeUndefined：只匹配 undefined**

```js
test('toBeUndefined 匹配器', () => {
  const a = undefined
  expect(a).toBeUndefined()
})
```

**toBeDefined： 与 toBeUndefined 相反，这里匹配 null 是通过的**

```js
test('toBeDefined 匹配器', () => {
  const a = null
  expect(a).toBeDefined()
})
```

**toBeTruthy：匹配任何 if 语句为 true**

```js
test('toBeTruthy 匹配器', () => {
  const a = 1
  expect(a).toBeTruthy()
})
```

**toBeFalsy：匹配任何 if 语句为 false**

```js
test('toBeFalsy 匹配器', () => {
  const a = 0
  expect(a).toBeFalsy()
})
```

**not：取反**

```js
test('not 匹配器', () => {
  const a = 1
  // 以下两个匹配器是一样的
  expect(a).not.toBeFalsy()
  expect(a).toBeTruthy()
})
```

## 数字

**toBeGreaterThan：大于**

```js
test('toBeGreaterThan', () => {
  const count = 10
  expect(count).toBeGreaterThan(9)
})
```

**toBeLessThan：小于**

```js
test('toBeLessThan', () => {
  const count = 10
  expect(count).toBeLessThan(12)
})
```

**toBeGreaterThanOrEqual：大于等于**

```js
test('toBeGreaterThanOrEqual', () => {
  const count = 10
  expect(count).toBeGreaterThanOrEqual(10) // 大于等于 10
})
```

**toBeLessThanOrEqual：小于等于**

```js
test('toBeLessThanOrEqual', () => {
  const count = 10
  expect(count).toBeLessThanOrEqual(10) // 小于等于 10
})
```

**toBeCloseTo：计算浮点数**

```js
test('toBeCloseTo', () => {
  const firstNumber = 0.1
  const secondNumber = 0.2
  expect(firstNumber + secondNumber).toBeCloseTo(0.3) // 计算浮点数
})
```

## 字符串

**toMatch： 匹配某个特定项字符串，支持正则**

```js
test('toMatch', () => {
  const str = 'http://www.zsh.com'
  expect(str).toMatch('zsh')
  expect(str).toMatch(/zsh/)
})
```

## 数组

**toContain：匹配是否包含某个特定项**

```js
test('toContain', () => {
  const arr = ['z', 's', 'h']
  const data = new Set(arr)
  expect(data).toContain('z')
})
```

## 异常

**toThrow**

```js
const throwNewErrorFunc = () => {
  throw new Error('this is a new error')
}
test('toThrow', () => {
  // 抛出的异常也要一样才可以通过，也可以写正则表达式
  expect(throwNewErrorFunc).toThrow('this is a new error')
})
```

更多细节可以看 [using-matchers](https://jestjs.io/docs/en/using-matchers)
