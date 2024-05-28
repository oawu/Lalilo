/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


DB._InitModel('Date', Model => {
  // year
  // month
  // day
  // cntActivities

  // ymd => [year, month, day]

  DB.Date = Model
  
  DB.Date.struct = _ => ({
    year: 0,
    month: 0,
    day: 0,
    cntActivities: 0,
  })

  DB._InitModel('Date.Activity', Model => {

    // dateId
    // hour
    // min
    // sec
    // cntPoints
    // time // unixtime

    // dateId => dateId

    DB.Date.Activity = Model

    DB.Date.Activity.struct = _ => ({
      dateId:     0,
      hour:       0,
      min:        0,
      sec:        0,
      cntPoints:  0,
      time: {
        gps: null,
        upload: null,
        server: null,
      },
    })
    
    DB._InitModel('Date.Activity.Point', Model => {
      // dateId
      // activityId
      // position
      // altitude
      // speed
      // course
      // time
      // status

      // activityId        => activityId
      // activityId_status => activityId + status
      // activityId_accH   => activityId + position.acc

      DB.Date.Activity.Point = Model
      
      DB.Date.Activity.Point.struct = _ => ({
        dateId:     0,
        activityId: 0,
        position:   null,
        altitude:   null,
        speed:      null,
        course:     null,
        time:       null,
        status:     null,
      })

      DB.Date.Activity.Point.valid = (_points, stopSpeed, stopLength) => {

        let points = []
        let point = null

        let stopsList = []
        let stops = null

        for (let _point of _points) {
          if (_point.position !== null && _point.speed !== null) {

            if (point && point.lat == _point.position.lat && point.lng == _point.position.lng) {
              continue
            }

            if (_point.speed.kmh < stopSpeed || (point !== null && Helper.length([point.lat, point.lng], [_point.position.lat, _point.position.lng]) < stopLength)) { // 慢
              if (stops === null) {
                stops = [_point]
              } else {
                stops.push(_point)
              }
            } else {
              if (stops !== null) {
                stopsList.push(stops)
                stops = null
              }

              point = {
                lat: _point.position.lat,
                lng: _point.position.lng,
                speed: _point.speed.kmh,
                time: _point.time,
              }

              points.push(point)
            }

          }
        }

        if (stops !== null) {
          stopsList.push(stops)
        }

        return {
          stopsList,
          _points,
          points
        }

      }
      DB.Date.Activity.Point.fromJson = (date, activity, json) => {
        if (!(date instanceof DB.Date && activity instanceof DB.Date.Activity && DB._T.obj(json))) {
          return null
        }

        const struct = DB.Date.Activity.Point.struct()

        struct.dateId = date.id
        struct.activityId = activity.id
        struct.status = 'none'

        struct.position = DB._T.num(json.accH) && json.accH > 0
          ? {
              acc: Helper.round(json.accH, 1),
              lat: Helper.round(json.lat, 10),
              lng: Helper.round(json.lng, 10),
            }
          : null

        struct.altitude = DB._T.num(json.accV) && json.accV > 0
          ? {
              acc: Helper.round(json.accV, 1),
              val: Helper.round(json.alt, 2),
            }
          : null

        struct.speed = DB._T.num(json.accS) && json.accS >= 0 && DB._T.num(json.speed) && json.speed >= 0
          ? {
              acc: Helper.round(json.accS, 1),
              ms: Helper.round(json.speed, 2),
              kmh: Helper.round(Helper.round(json.speed, 2) * 3.6, 2),
            }
          : null

        struct.course = DB._T.num(json.accC) && json.accC >= 0 && DB._T.num(json.course) && json.course >= 0
          ? {
              acc: Helper.round(json.accC, 1),
              val: Helper.round(json.course, 1),
            }
          : null

        struct.time = DB._T.num(json.time) && json.time >= 0
          ? Helper.round(json.time * 1000, 0)
          : null

        return struct
      }
    })
  })
})


// DB.Date.today = closure => {
//   const date = DB.Date()

//   return DB._result(DB.Date, closure, (resolve, reject) => {
//     DB.$('Date').index('ymd', [date.year, date.month, date.day]).first((error, _date) => {
//       if (error) {
//         return reject(error)
//       }

//       if (_date) {
//         return resolve(_date)
//       }

//       return DB.$('Date').create(date, (error, _date) => error ? reject(error) : reject(_date))
//     })  
//   })
// }


// DB.Date.Activity = function(dateId) {
//   if (!(this instanceof DB.Date.Activity)) {
//     return DB._T.num(dateId) && dateId > 0
//       ? new DB.Date.Activity(dateId)
//       : null
//   }

//   const now = new Date()

//   this.dateId = dateId
//   this.hour = now.getHours()
//   this.min = now.getMinutes()
//   this.sec = now.getSeconds()
  
//   this.cntPoints = 0
// }
// DB.Date.Activity.prototype.save = function(closure) {
//   // DB.$('Date').create(date, (error, _date) => error ? reject(error) : reject(_date))
//   DB.$('Date.Activity').create(this, closure)
//   return DB.$('Date.Activity').create(this, closure)

// }
// DB.Date.Activity.Point = function(dateId, ActivityId, data) {
//   if (!(this instanceof DB.Date.Activity.Point)) {
//     return DB._T.num(dateId) && dateId > 0 && B._T.num(ActivityId) && ActivityId > 0
//       ? new DB.Date.Activity.Point(dateId, ActivityId, data)
//       : null
//   }

//   // activityId, status, position.acc

//   const now = new Date()

//   this.dateId = dateId
//   this.ActivityId = ActivityId


//   this.position = null
//   this.altitude = null
//   this.speed = null
//   this.course = null

//   this.time = {
//     gps: null,
//     upload: null,
//     server: null,
//   }

//   this.status = 'none' // done, fail

//   if (!DB._T.obj(data)) {
//     return
//   }

//   if (DB._T.num(data.accH) && data.accH > 0) {
//     this.position = {
//       acc: DB.Date.Activity.Point._round(data.accH, 1),
//       lat: DB.Date.Activity.Point._round(data.lat, 10),
//       lng: DB.Date.Activity.Point._round(data.lng, 10),
//     }
//   }
//   if (DB._T.num(data.accV) && data.accV > 0) {
//     this.altitude = {
//       acc: DB.Date.Activity.Point._round(data.accV, 1),
//       val: DB.Date.Activity.Point._round(data.alt, 2),
//     }
//   }

//   if (DB._T.num(data.accS) && data.accS >= 0 && DB._T.num(data.speed) && data.speed >= 0) {
//     this.speed = {
//       acc: DB.Date.Activity.Point._round(data.accS, 1),
//       ms: DB.Date.Activity.Point._round(data.speed, 2),
//       kmh: DB.Date.Activity.Point._round(DB.Date.Activity.Point._round(data.speed, 2) * 3.6, 2),
//     }
//   }

//   if (DB._T.num(data.accC) && data.accC >= 0 && DB._T.num(data.course) && data.course >= 0) {
//     this.course = {
//       acc: DB.Date.Activity.Point._round(data.accC, 1),
//       val: DB.Date.Activity.Point._round(data.course, 1) }
//   }

//   if (DB._T.num(data.time) && data.time >= 0) {
//     this.time.gps = DB.Date.Activity._time(data.time * 1000)
//   }
// }
// DB.Date.Activity.Point._round = (val, digital, d4 = '') => DB._T.num(val)
//   ? parseFloat(val.toFixed(digital))
//   : d4
// DB.Date.Activity.Point._time = unixtime => ({
//   val: unixtime,
//   text: Helper.date('Y/m/d H:i:s', new Date(unixtime)),
//   ago: DB.Date.Activity.Point._timeago(unixtime)
// })
// DB.Date.Activity.Point._timeago = e => {
//   const d = (new Date().getTime() - e * 1000) / 1000

//   const c = [
//     { b: 10, f: '現在'},
//     { b: 6,  f: '不到 1 分鐘'},
//     { b: 60, f: ' 分鐘前'},
//     { b: 24, f: ' 小時前'},
//     { b: 30, f: ' 天前'},
//     { b: 12, f: ' 個月前'}
//   ]

//   let u = 1

//   for (let i = 0, t; i < c.length; i++, u = t) {
//     t = c[i].b * u
    
//     if (d < t) {
//       return `${i > 1 ? parseInt(d / u, 10) : ''}${c[i].f}`
//     }
//   }

//   return `${parseInt(d / u, 10)} 年前`
// }