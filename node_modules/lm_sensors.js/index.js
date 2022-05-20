/*!
 * lm_sensors.js
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence MIT
 */
const BIN = '/usr/bin/sensors -u';

/**
 * Parses the raw data from 'lm_sensors' and returns a
 * JSON representation.
 *
 *
 * @param {Array} lines The lines from stdout
 * @param {Object} [opts] Options
 * @return {Object} JSON representation
 */
function parseSensors(lines, opts) {
  const result = {};

  let currentDevice;
  let currentSensor;

  const setCurrentDevice = (d) => {
    currentDevice = d;
    currentSensor = null;

    if ( currentDevice && !result[currentDevice] ) {
      result[currentDevice] = {
        adapter: null,
        sensors: {}
      };
    }
  };

  lines.forEach((line, idx) => {
    if ( idx === 0 ) {
      setCurrentDevice(line);
    } else if ( line === '' || line === '\r' || line === '\n' ) {
      setCurrentDevice(lines[idx + 1]);
      return;
    }

    const matchAdapter = line.match(/^Adapter: (.*)/);
    if ( matchAdapter  ) {
      result[currentDevice].adapter = matchAdapter[1];
    } else {
      const matchSensor = line.match(/^(\w+):$/);
      if ( matchSensor ) {
        currentSensor = matchSensor[1];
        result[currentDevice].sensors[currentSensor] = {
          sensor: undefined
        };
      }

      if ( currentSensor ) {
        const matchValue = line.match(/^\s+(\w+): (.*)/);
        if ( matchValue ) {
          const keys = matchValue[1].split('_', 2);
          const sensorType = keys[0].replace(/[^A-z]/g, '');

          let sensorValue = parseFloat(matchValue[2]);
          if ( sensorType === 'temp' && opts.fahrenheit === true ) {
            sensorValue = sensorValue * 9 / 5 + 32;
          }

          result[currentDevice].sensors[currentSensor][keys[1]] = sensorValue;

          if ( typeof result[currentDevice].sensors[currentSensor].sensor === 'undefined' ) {
            result[currentDevice].sensors[currentSensor].sensor = sensorType;
          }
        }
      }
    }
  });

  return result;
}

/**
 * Executes the command line to pull data from 'lm_sensors'
 *
 * Resolves with an Array of lines from stdout, or rejects with
 * an error message
 *
 * @return {Promise}
 */
const execSensors = () => new Promise((resolve, reject) => {
  require('child_process').exec(BIN, (err, stdout, stderr) => {
    if ( err ) {
      reject(err);
    } else {
      const out = stdout.toString();

      if ( out.length < 5 ) {
        reject('Invalid output from lm_sensors: ' + out);
      } else {
        resolve(out);
      }
    }
  });
});

/**
 * Executes and parses data from lm_sensors
 *
 * Resolves with JSON data, or rejects with an error message
 *
 * @param {Object} [opts] Options
 * @param {Boolean} [opts.fahrenheit] Toggle fahrenheit units
 * @return {Promise}
 */
const getSensors = (opts) => new Promise((resolve, reject) => {
  opts = opts || {};

  execSensors().then((stdout) => {
    try {
      resolve(parseSensors(stdout.split('\n'), opts));
    } catch ( e ) {
      reject(e);
    }
  }).catch(reject);
});

module.exports.sensors = getSensors;
