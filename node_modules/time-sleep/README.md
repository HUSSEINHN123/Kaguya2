# sleep

> JavaScript sleep function

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save time-sleep
```

## Usage

```js
import sleep from 'time-sleep'

const test = async function() {
  console.log(1)
  await sleep(1000)
  console.log(2)
  await sleep(1000)
  console.log(3)
}

test()
```
