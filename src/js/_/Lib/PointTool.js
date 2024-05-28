/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const PointTool = {
  schema: {
    date: {
      table: 'Date',
      columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        year: 'INTEGER NOT NULL',
        month: 'INTEGER NOT NULL',
        day: 'INTEGER NOT NULL',
        cntActivities: 'INTEGER NOT NULL DEFAULT 0',
      },
      indexes: [
        'CREATE INDEX idx_year_month_day ON Date (year, month, day);',
      ]
    },
    activity: {
      table: 'Activity',
      columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        dateId: 'INTEGER NOT NULL DEFAULT 0',
        
        title: 'TEXT NOT NULL',
        hour: 'INTEGER NOT NULL',
        min: 'INTEGER NOT NULL',
        sec: 'INTEGER NOT NULL',

        cntAccLevel0Points: 'INTEGER NOT NULL DEFAULT 0',
        cntAccLevel1Points: 'INTEGER NOT NULL DEFAULT 0',
        cntAccLevel2Points: 'INTEGER NOT NULL DEFAULT 0',
        cntAccLevel3Points: 'INTEGER NOT NULL DEFAULT 0',
        cntAccLevel4Points: 'INTEGER NOT NULL DEFAULT 0',
        cntAccLevel5Points: 'INTEGER NOT NULL DEFAULT 0',

        timeGps: 'INTEGER DEFAULT NULL',
        timeUpload: 'INTEGER DEFAULT NULL',
        timeServer: 'INTEGER DEFAULT NULL',
      },
      indexes: [
        'CREATE INDEX idx_dateId ON Activity (dateId);',
      ]
    },
    point: {
      table: 'Point',
      columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',

        dateId: 'INTEGER NOT NULL DEFAULT 0',
        activityId: 'INTEGER NOT NULL DEFAULT 0',
        
        accLevel: 'INTEGER NOT NULL DEFAULT 0',

        status: 'INTEGER NOT NULL DEFAULT 0',

        accH: 'DOUBLE DEFAULT NULL',
        lat: 'DOUBLE DEFAULT NULL',
        lng: 'DOUBLE DEFAULT NULL',
        
        accV: 'DOUBLE DEFAULT NULL',
        alt: 'DOUBLE DEFAULT NULL',

        accS: 'DOUBLE DEFAULT NULL',
        speedMs: 'DOUBLE DEFAULT NULL',
        speedKmh: 'DOUBLE DEFAULT NULL',
        
        accC: 'DOUBLE DEFAULT NULL',
        course: 'DOUBLE DEFAULT NULL',

        time: 'DOUBLE NOT NULL',
      },
      indexes: [
        'CREATE INDEX idx_activityId_accLevel ON Point (activityId, accLevel);',
      ]
    },
  },
  d4: { lat: 23.910948746482543, lng: 120.87432861328126, zoom: 8 },
  _samePosition: (last, now) => {
    const lat1 = Math.round(last.lat * 10000000000)
    const lat2 = Math.round(now.lat * 10000000000)
    
    const lng1 = Math.round(last.lng * 10000000000)
    const lng2 = Math.round(now.lng * 10000000000)

    return lat1 == lat2 && lng1 == lng2
  },
  postfromJson (date, activity, json, last = null) {
    const _obj = v => typeof v == 'object' && v !== null && !Array.isArray(v)
    const _num = v => typeof v == 'number' && !isNaN(v) && v !== Infinity

    if (!(_obj(date) && _obj(activity) && _obj(json) && _num(json.time) && json.time >= 0)) {
      return null
    }

    const struct = {
      dateId: date.id,
      activityId: activity.id,
      
      accLevel: 0,

      status: 0,
      
      accH: null,
      lat: null,
      lng: null,
      
      accV: null,
      alt: null,

      accS: null,
      speedMs: null,
      speedKmh: null,
      
      accC: null,
      course: null,

      time: 0,
    }

    let i = 0
    if (_num(json.accH) && json.accH > 0) {
      struct.accH = json.accH
      struct.lat = json.lat
      struct.lng = json.lng

      i++
    }

    if (_num(json.accS) && json.accS >= 0 && _num(json.speed) && json.speed >= 0) {
      struct.accS = json.accS
      struct.speedMs = json.speed
      struct.speedKmh = json.speed * 3.6

      i++
    }

    if (i == 2) {
      if (last === null || !this._samePosition(last, struct)) {
        if (json.accH <= 5 && json.accS <= 1.2) {
          struct.accLevel = 5
        } else if (json.accH <= 10 && json.accS <= 2.7) {
          struct.accLevel = 4
        } else if (json.accH <= 18 && json.accS <= 3.7) {
          struct.accLevel = 3
        } else if (json.accH <= 36 && json.accS <= 4) {
          struct.accLevel = 2
        } else {
          struct.accLevel = 1
        }
      }
    }
    if (_num(json.accV) && json.accV > 0) {
      struct.accV = json.accV
      struct.alt = json.alt
    }

    if (_num(json.accC) && json.accC >= 0 && _num(json.course) && json.course >= 0) {
      struct.accC = json.accC
      struct.course = json.course
    }

    struct.time = json.time

    return struct
  },
  length: points => points.reduce((a, b) => {
    const l = a.prev !== null ? Helper.length([a.prev.lat, a.prev.lng], [b.lat, b.lng]) : 0

    a.len += l
    a.prev = b

    return a
  }, { len: 0, prev: null }).len,
  speed: {
    colors: ['#f5c801', '#fbbb03', '#fcab0a', '#fc9913', '#fb871d', '#fa7226', '#f95d30', '#f94739', '#f93748', '#f72b5e'],
    index ({ min, unit }, val) {
      return Math.min(Math.floor(Math.max(Math.round(val * 10) - min, 0) / unit), this.colors.length - 1)
    },
    color ({ min, unit }, val) {
      const i = this.index({ min, unit }, val)
      return this.colors[i]
    },
    calc (points) {
      const cnt = this.colors.length

      const speeds = points.map(({ speed }) => Math.round(speed * 10)).reduce((a, b) => a.includes(b) ? a : a.concat(b), [])
      const max  = speeds.length ? speeds.reduce((a, b) => a > b ? a : b) : 0
      const min  = speeds.length ? speeds.reduce((a, b) => a < b ? a : b) : 0
      const unit = cnt > 0 ? Helper.round((max - min + 1) / cnt) : 0
      
      const vals = [{ val: Helper.round(min / 10, 1), color: this.colors[0] }]
      
      for (let i = 1; i <= cnt - 2; i++) {
        if (min + i * unit < max) {
          vals.push({ val: Helper.round(Math.round(min + i * unit) / 10, 1), color: this.colors[i] })
        } else {
          break
        }
      }

      if (min != max) {
        vals.push({ val: Helper.round(max / 10, 1), color: this.colors[this.colors.length - 1] })
      }

      return { vals, unit, cnt, max, min }
    },
  },
  valid: (_points, stopSpeed = 4, stopLength = 1) => {
    let points = []
    let point = null

    let stopsList = []
    let stops = []

    for (let { lat, lng, speedKmh, time } of _points) {
      if (speedKmh >= stopSpeed) { // 移動
        if (stops.length) {
          stopsList.push(stops)
          stops = []
        }
        
        if (!point || Helper.length([point.lat, point.lng], [lat, lng]) >= stopLength) {
          point = { lat, lng, speed: speedKmh, time }
          points.push(point)
        }
      } else { // 停
        stops.push({ lat, lng, speed: speedKmh, time })
      }

    }
    if (stops.length) {
      stopsList.push(stops)
      stops = []
    }

    return {
      stopsList: stopsList.filter(stops => {
        const times = stops.map(({ time }) => time)
        const maxT = times.reduce((a, b) => a > b ? a : b)
        const minT = times.reduce((a, b) => a < b ? a : b)
        return maxT - minT > 10
      }),
      _points,
      points
    }
  }
}