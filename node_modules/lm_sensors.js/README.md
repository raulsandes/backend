# lm_sensors.js

A library to get information from the `sensors` command.


## Installation

```
$ npm install --save lm_sensors.js
```

## Usage

```
const sensors = require('lm_sensors.js');

sensors.sensors()
  .then((s) => console.log(s))
  .catch((e) => console.error(e))
```

## Example result

Truncated for simplicity:

```

"nct6791-isa-0290": {
  "adapter": "ISA adapter",
  "sensors": {
    "AVCC": {
      "input": 3.312,
      "min": 2.976,
      "max": 3.632,
      "alarm": 0,
      "beep": 0
    },
    "fan1": {
      "input": 739,
      "min": 0,
      "alarm": 0,
      "beep": 0,
      "pulses": 2
    },
    "fan2": {
      "input": 211,
      "min": 0,
      "alarm": 0,
      "beep": 0,
      "pulses": 2
    },
    "AUXTIN2": {
      "input": 34,
      "type": 4,
      "offset": 0
    },
    "AUXTIN3": {
      "input": 41.5,
      "type": 4,
      "offset": 0
    }
  }
}
```

## License

MIT
