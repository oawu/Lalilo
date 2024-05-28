/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    urls: [
      // `2024_02_18_09_38_54_1710349035.838561.json`, // 布拉格機場
      // `2024_02_18_09_46_43_1710349064.594867.json`, // 1. 布拉格 -> 溫泉
      // `2024_02_18_17_21_49_1710349080.489118.json`, // 1. 回飯店
      // `2024_02_18_19_48_43_1710349096.5443048.json`, // 1. 晚查理大橋

      // `2024_02_19_09_02_06_1710348695.7087011.json`, //2. 
      // `2024_02_19_16_50_36_1710348673.015952.json`, // 2. 晚間吃飯

      // `2024_02_20_06_23_40_1710348640.99103.json`, // 3. 一早拍照，庫特
      // `2024_02_20_12_19_39_1710348610.107749.json`, // 3. 回布拉格

      // `2024_02_21_08_57_12_1710348574.714864.json`, // 4. 一早拍照 克倫諾夫

      // `2024_02_22_08_34_09_1710348546.860371.json`, // 5. 哈斯塔特

      // `2024_02_23_08_25_50_1710348018.2105742.json`, // 6. 國王湖遊船、鹽洞探險
      
      // `2024_02_24_09_05_33_1720586462.9430141.json`, // 7. 薩爾茲堡
      // `2024_02_24_17_17_37_1720586475.348937.json`, // 7. 薩爾茲堡


      // `2024_02_25_10_02_47_1710346571.240304.json`, // 8.Sisi 皇宮

      // `2024_02_26_07_55_09_1710349996.072235.json`,  // 9. 美泉宮動物園
      // `2024_02_26_09_56_17_1710350009.999141.json`,  // 9. 美泉宮動物園

      // `2024_02_27_07_53_12_1710350027.911746.json`, // 10.上飛機回家
      // `2024_02_27_17_46_18_1710350052.973524.json`, // 天空飛

      
      '2024_06_28_19_29_38_1720148520.026208.json',
      '2024_06_29_10_00_18_1720148535.130824.json',
      '2024_06_30_10_00_40_1720148548.762869.json',
      '2024_06_30_18_20_22_1720148564.802369.json',
      '2024_07_01_09_20_16_1720148582.442243.json',
      '2024_07_01_18_44_40_1720148605.7064738.json',
      '2024_07_02_09_13_21_1720148621.45714.json',
      '2024_07_02_11_05_09_1720148633.4803162.json',
      '2024_07_02_12_50_03_1720148645.2097878.json',
      '2024_07_03_10_16_51_1720148657.470275.json',

      '2024.7.10_01.json',
      '2024.7.10_02.json',
      '2024.7.10_03.json',
      '2024.7.10_04.json',
    ],

    queue: Queue(),

    strs: [],

  },
  mounted () {
    // DB._clear(_ => {
    //   for (const url of this.urls) {
    //     this.queue.enqueue(next => 
    //       $.get(`${window.baseUrl}json/${url}`).done(({ activity, date, points }) => this._run1(url, activity, date, points, _ => {
    //         next()
    //       })
    //         .then(a => console.error(a))
    //         .catch(e => console.error(e))
    //         .finally(_ => {}))
    //     )
    //   }

    //   // const obj = {
    //   //   url: 'url',
    //   //   areas: ['a', 'd', 'f', 'w', 'e'],
    //   //   progress: 'ew'
    //   // }

    //   // this.strs.push(obj)
    // })

    // App.Log('tables', 'a', {a:1}, [1,2,3], 1, false, true, null);
    // App.Log('🔴');


      // const obj = {
      //   url: '2024_06_28_19_29_38_1720148520.026208.json',
      //   areas: ['a', 'd', 'f', 'w', 'e'],
      //   progress: 'ew'
      // }

      // this.strs.push(obj, obj, obj, obj, obj, obj, obj)
    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))

    const D = App.SqlLite.Model('Date')
    const A = App.SqlLite.Model('Activity')
    const P = App.SqlLite.Model('Point')

    // const func = async n => {
    //   const activity = await A.one(n)
    //   const date = await D.one(activity.dateId)
    //   const points = await P.where('activityId', activity.id).all()
      
    //   App.Log(n, JSON.stringify({
    //     date: `${date.year}.${date.month}.${date.day}`,
    //     activity: `${activity.hour}:${activity.min}:${activity.sec}`,
    //     points: points.map(({ lat, lng, alt, accH, accV, accS, accC, speedMs, course, time }) => ({ lat, lng, alt, accH, accV, accS, accC, speed: speedMs, course, time }))
    //   }))
    // }

    // func(12)
    // func(13)
    // func(14)
    // func(15)

    // this._test_orm_Callback()
    
return
    this._migration(_ => {
      const chunk = (array, size) => {
        const chunkedArray = [];

        for (let i = 0; i < array.length; i += size) {
          chunkedArray.push(array.slice(i, i + size));
        }

        return chunkedArray;
      }
      const urlsList = chunk(this.urls, Math.ceil(this.urls.length / 1))
      
      for (const urls of urlsList) {

        this.queue.enqueue(next => {
          let q = Queue()

          for (const url of urls) {
            q.enqueue(_next => {
              $.get(`${window.baseUrl}json/${url}?v=${Date.now()}`)
                .done(({ activity, date, points }) => this._run2(url, activity, date, points, _ => _next())
                  .then(a => App.Log('ok'))
                  .catch(e => App.Log(e.message)))
            })
          }

          q.enqueue(_next => next(_next()))
        })
      }

      this.queue.enqueue(next => {
        App.Log('Finish')
      })
    })
    
  },
  computed: {
    
  },
  methods: {
    scroll (e) {
      setTimeout(_ => App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit())
    },

    async _sqlLite_emit_Queue () {
      let sTime = null

      Queue()
        .enqueue(next => {
          sTime = Date.now()
          next()
        })
        .enqueue(next => {
          App.SqlLite.TableList(tables => {
            App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
            next(tables)
          }).emit()
        })
        .enqueue((next, tables) => {
          let q = Queue()
          for (let table of tables || []) {
            q.enqueue(_next => App.SqlLite.TableDrop(table, result => {
              App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴')
              _next()
            }).emit()) 
          }
          q.enqueue(_next => next())
        })
        .enqueue(next => {
          App.SqlLite.TableCreate('User', {
            id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
            name: 'TEXT',
            age: 'INTEGER',
            score: 'DOUBLE',
          }).completion(result => {
            App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴')
            next()
          }).emit()
        })

        .enqueue(next => {
          App.SqlLite.TableList(tables => {
            App.Log('tables len == 1', Array.isArray(tables) && tables.length == 1 ? '🟢' : '🔴');
            next()
          }).emit()
        })
        .enqueue(next => {
          App.SqlLite.TableExec('INSERT INTO User (id, name, age, score) VALUES (NULL, ?, ?, ?);')
            .val('oa', 30, 10.2)
            .completion(result => {
              App.Log('execSql INSERT', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          Queue()
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OA', age: 30, score: 10.2 }, id => {
                App.Log('insert id = 2', App._T.num(id) && id == 2 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OB', age: 7, score: 0.9 }, id => {
                App.Log('insert id = 3', App._T.num(id) && id == 3 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OC', age: 30, score: 100.34 }, id => {
                App.Log('insert id = 4', App._T.num(id) && id == 4 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OD', age: 25, score: 45.0 }, id => {
                App.Log('insert id = 5', App._T.num(id) && id == 5 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OE', age: 30, score: 49.8 }, id => {
                App.Log('insert id = 6', App._T.num(id) && id == 6 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OF', age: 30, score: 40 }, id => {
                App.Log('insert id = 7', App._T.num(id) && id == 7 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              App.SqlLite.TableInsert('User', { name: 'OF', age: 30, score: 43 }, id => {
                App.Log('insert id = 8', App._T.num(id) && id == 8 ? '🟢' : '🔴');
                _next()
              }).emit()
            })
            .enqueue(_next => {
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite.TableSelectAll('User')
            .completion(rows => {
              App.Log('all len = 8', Array.isArray(rows) && rows.length == 8 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableClear('User')
            .completion(clear => {
              App.Log('clear', App._T.bool(clear) && clear ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableSelectAll('User')
            .completion(rows => {
              App.Log('all len = 0', Array.isArray(rows) && rows.length == 0 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          Promise.all([
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OA', age: 30, score: 10.2 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OB', age: 7, score: 0.9 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OC', age: 30, score: 100.34 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OD', age: 25, score: 45.0 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OE', age: 30, score: 49.8 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OF', age: 30, score: 40 }, result => resolve(result)).emit()),
            new Promise((resolve, reject) => App.SqlLite.TableInsert('User', { name: 'OF', age: 30, score: 43 }, result => resolve(result)).emit()),
          ])
          .then(ids => {
            App.Log('inserts len = 7', Array.isArray(ids) && ids.length == 7 ? '🟢' : '🔴');
            next()
          })
          .catch(_ => {
            App.Log('inserts len = 7', '🔴');
          })
        })
        .enqueue(next => {
          App.SqlLite.TableSelectAll('User')
            .where('age', 30)
            .where('score', '<', 50)
            .where('id', [1, 6, 7])
            .select('id', 'name', 'age')
            .order('id DESC')
            .limit(3)
            .offset(1)
            .completion(rows => {
              App.Log('all len = 2', Array.isArray(rows) && rows.length == 2 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableSelectOne('User')
            .where(3)
            .completion(row => {
              App.Log('one id = 3', App._T.obj(row) && row.id == 3 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableSelectOne('User')
            .where(100)
            .completion(row => {
              App.Log('one null', row === null ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableUpdate('User', {
              name: 'X',
              score: 0.1
            })
            .where('age', 30)
            .where('score', '<', 50)
            .where('id', [1, 6, 7])
            .order('id DESC')
            .offset(1)
            .limit(3)

            .completion(result => {
              App.Log('update id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableSelectAll('User')
            .where('id', [1, 6, 7])
            .select('id', 'score', 'name')
            .order('id DESC')
            .completion(rows => {
              if (!Array.isArray(rows)) {
                return App.Log('all', '🔴');
              }

              App.Log('all len = 3 (7 name) != X, (6,1 name) = x', rows.length == 3 ? '🟢' : '🔴',
                rows[0].id == 7 ? '🟢' : '🔴',
                rows[0].score != 0.1 ? '🟢' : '🔴',
                rows[0].name != 'X' ? '🟢' : '🔴',

                rows[1].id == 6 ? '🟢' : '🔴',
                rows[1].score == 0.1 ? '🟢' : '🔴',
                rows[1].name == 'X' ? '🟢' : '🔴',
                
                rows[2].id == 1 ? '🟢' : '🔴',
                rows[2].score == 0.1 ? '🟢' : '🔴',
                rows[2].name == 'X' ? '🟢' : '🔴',
              );
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableDelete('User')
            .where('id', [1, 6, 7])
            .order('id DESC')
            .offset(1)
            .limit(3)
            .completion(result => {
              App.Log('delete id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableSelectAll('User')
            .where('id', [1, 6, 7])
            .select('id', 'score', 'name')
            .order('id DESC')
            .completion(rows => {

              if (!Array.isArray(rows)) {
                return App.Log('all', '🔴');
              }

              App.Log('all len = 1, id = 7', rows.length == 1 ? '🟢' : '🔴',
                rows[0].id == 7 ? '🟢' : '🔴',
                rows[0].score != 0.1 ? '🟢' : '🔴',
                rows[0].name != 'X' ? '🟢' : '🔴',
              );
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableCount('User')
            .where('id', [1, 6, 7])
            .order('id DESC')
            .completion(count => {
              App.Log('count = 1', App._T.num(count) && count == 1 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableClear('User')
            .completion(clear => {
              App.Log('clear', App._T.bool(clear) && clear ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.SqlLite.TableCount('User')
            .completion(count => {
              App.Log('count = 0', App._T.num(count) && count == 0 ? '🟢' : '🔴');
              next()
            })
            .emit()
        })
        .enqueue(next => {
          App.Log('==================');
          App.Log(Date.now() - sTime)
          App.Log('==================');
        })
    },

    async _test_sqlLite_Builder_Queue () {
      let sTime = null
      Queue()
        .enqueue(next => {
          sTime = Date.now()
          next()
        })
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
            next(tables)
          })
        })
        .enqueue((next, tables) => {

          let q = Queue()
          for (const table of tables) {
            q.enqueue(_next => App.SqlLite(table).drop(result => {
              if (result instanceof Error) {
                App.Log('drop', '🔴');
                return
              }
              App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴');
              _next()
            }))
          }
          q.enqueue(_next => next())
        })
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables len = 0', Array.isArray(tables) && tables.length == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .columns({
              id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
              name: 'TEXT',
              age: 'INTEGER',
              score: 'DOUBLE',
            })
            .create(result => {
              if (result instanceof Error) {
                App.Log('create', '🔴');
                return
              }
              App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }
            App.Log('tables len = 1', Array.isArray(tables) && tables.length == 1 ? '🟢' : '🔴');
            next()
          })
        })

        .enqueue(next => {
          App.SqlLite()
            .sql('INSERT INTO User (id, name, age, score) VALUES (NULL, ?, ?, ?);')
            .vals('oa', 30, 10.2)
            .exec(result => {
              if (result instanceof Error) {
                App.Log('exec', '🔴');
                return
              }
              App.Log('execSql INSERT', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          let q = Queue()
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OA', age: 30, score: 10.2 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 2', App._T.num(id) && id == 2 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OB', age: 7, score: 0.9 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 3', App._T.num(id) && id == 3 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OC', age: 30, score: 100.34 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 4', App._T.num(id) && id == 4 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OD', age: 25, score: 45.0 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 5', App._T.num(id) && id == 5 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OE', age: 30, score: 49.8 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 6', App._T.num(id) && id == 6 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OF', age: 30, score: 40 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 7', App._T.num(id) && id == 7 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            App.SqlLite('User').param({ name: 'OF', age: 30, score: 43 }).insert(id => {
              if (id instanceof Error) {
                App.Log('insert', '🔴');
                return
              }

              App.Log('insert id = 8', App._T.num(id) && id == 8 ? '🟢' : '🔴');
              _next()
            })
          })
          q.enqueue(_next => {
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User').all(rows => {
            if (rows instanceof Error) {
              App.Log('all', '🔴');
              return
            }
            App.Log('all len = 8', Array.isArray(rows) && rows.length == 8 ? '🟢' : '🔴');
            next()
          })

        })
        .enqueue(next => {
          App.SqlLite('User').clear(result => {
            if (result instanceof Error) {
              App.Log('clear', '🔴');
              return
            }
            App.Log('clear', App._T.bool(result) && result ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User').all(rows => {
            if (rows instanceof Error) {
              App.Log('all', '🔴');
              return
            }
            App.Log('all len = 0', Array.isArray(rows) && rows.length == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          Promise.all([
            App.SqlLite('User').param({ name: 'OA', age: 30, score: 10.2 }).insert(),
            App.SqlLite('User').param({ name: 'OB', age: 7, score: 0.9 }).insert(),
            App.SqlLite('User').param({ name: 'OC', age: 30, score: 100.34 }).insert(),
            App.SqlLite('User').param({ name: 'OD', age: 25, score: 45.0 }).insert(),
            App.SqlLite('User').param({ name: 'OE', age: 30, score: 49.8 }).insert(),
            App.SqlLite('User').param({ name: 'OF', age: 30, score: 40 }).insert(),
            App.SqlLite('User').param({ name: 'OF', age: 30, score: 43 }).insert(),
          ])
          .then(ids => {
            App.Log('inserts len = 7', Array.isArray(ids) && ids.length == 7 ? '🟢' : '🔴', ids);
            next()
          })
          .catch(e => {
            App.Log('inserts', '🔴');
          })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('age', 30)
            .where('score', '<', 50)
            .where('id', [1, 6, 7])
            .select('id', 'name', 'age')
            .order('id DESC')
            .limit(3)
            .offset(1)
            .all(rows => {
              if (rows instanceof Error) {
                App.Log('all', '🔴');
                return
              }
              App.Log('all len = 2', Array.isArray(rows) && rows.length == 2 ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where(3)
            .one(row => {
              if (row instanceof Error) {
                App.Log('one', '🔴');
                return
              }
              App.Log('one id = 3', App._T.obj(row) && row.id == 3 ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where(1000)
            .one(row => {
              if (row instanceof Error) {
                App.Log('one', '🔴');
                return
              }
              App.Log('one null', row === null ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User').param({
            name: 'X',
            score: 0.1
          })
            .where('age', 30)
            .where('score', '<', 50)
            .where('id', [1, 6, 7])
            .order('id DESC')
            .offset(1)
            .limit(3)
            .update(result => {
              if (result instanceof Error) {
                App.Log('update', '🔴')
                return
              }
              App.Log('update id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴')
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('id', [1, 6, 7])
            .select('id', 'score', 'name')
            .order('id DESC')
            .all(rows => {
              if (rows instanceof Error) {
                App.Log('all', '🔴')
                return
              }

              App.Log('all len = 3 (7 name) != X, (6,1 name) = x',
                rows.length == 3 ? '🟢' : '🔴',
                rows[0].id == 7 ? '🟢' : '🔴',
                rows[0].score != 0.1 ? '🟢' : '🔴',
                rows[0].name != 'X' ? '🟢' : '🔴',

                rows[1].id == 6 ? '🟢' : '🔴',
                rows[1].score == 0.1 ? '🟢' : '🔴',
                rows[1].name == 'X' ? '🟢' : '🔴',
                
                rows[2].id == 1 ? '🟢' : '🔴',
                rows[2].score == 0.1 ? '🟢' : '🔴',
                rows[2].name == 'X' ? '🟢' : '🔴',
              )
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('id', [1, 6, 7])
            .order('id DESC')
            .offset(1)
            .limit(3)
            .delete(result => {
              if (result instanceof Error) {
                App.Log('delete', '🔴')
                return
              }
              App.Log('delete id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴')
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('id', [1, 6, 7])
            .select('id', 'score', 'name')
            .order('id DESC')
            .all(rows => {
              if (rows instanceof Error) {
                App.Log('all', '🔴')
                return
              }
              App.Log('all len = 1, id = 7',
                rows.length == 1 ? '🟢' : '🔴',
                rows[0].id == 7 ? '🟢' : '🔴',
                rows[0].score != 0.1 ? '🟢' : '🔴',
                rows[0].name != 'X' ? '🟢' : '🔴',
              )
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('id', [1, 6, 7])
            .order('id DESC')
            .count(count => {
              if (count instanceof Error) {
                App.Log('count', '🔴');
                return
              }
              App.Log('count = 1', App._T.num(count) && count == 1 ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.SqlLite('User').clear(result => {
            if (result instanceof Error) {
              App.Log('clear', '🔴');
              return
            }
            App.Log('clear', App._T.bool(result) && result ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .where('id', [1, 6, 7])
            .order('id DESC')
            .count(count => {
              if (count instanceof Error) {
                App.Log('count', '🔴');
                return
              }
              App.Log('count = 0', App._T.num(count) && count == 0 ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          App.Log('==================');
          App.Log(Date.now() - sTime)
          App.Log('==================');
        })
    },
    async _test_sqlLite_Builder_Promise () {
      let sTime = Date.now()
      let tables = await App.SqlLite().tables()
      App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
      
      for (const table of tables || []) {
        let result = await App.SqlLite(table).drop()
        App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴');
      }

      tables = await App.SqlLite().tables()
      App.Log('tables len = 0', Array.isArray(tables) && tables.length == 0 ? '🟢' : '🔴');

      let result = await App.SqlLite('User')
        .columns({
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          name: 'TEXT',
          age: 'INTEGER',
          score: 'DOUBLE',
        })
        .create()

      App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴');
    
      tables = await App.SqlLite().tables()
      App.Log('tables len = 1', Array.isArray(tables) && tables.length == 1 ? '🟢' : '🔴');

      result = await App.SqlLite()
        .sql('INSERT INTO User (id, name, age, score) VALUES (NULL, ?, ?, ?);')
        .vals('oa', 30, 10.2)
        .exec()
      
      App.Log('execSql INSERT', App._T.bool(result) && result ? '🟢' : '🔴');

      let id = await App.SqlLite('User').param({ name: 'OA', age: 30, score: 10.2 }).insert()
      App.Log('insert id = 2', App._T.num(id) && id == 2 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OB', age: 7, score: 0.9 }).insert()
      App.Log('insert id = 3', App._T.num(id) && id == 3 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OC', age: 30, score: 100.34 }).insert()
      App.Log('insert id = 4', App._T.num(id) && id == 4 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OD', age: 25, score: 45.0 }).insert()
      App.Log('insert id = 5', App._T.num(id) && id == 5 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OE', age: 30, score: 49.8 }).insert()
      App.Log('insert id = 6', App._T.num(id) && id == 6 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OF', age: 30, score: 40 }).insert()
      App.Log('insert id = 7', App._T.num(id) && id == 7 ? '🟢' : '🔴');
      id = await App.SqlLite('User').param({ name: 'OF', age: 30, score: 43 }).insert()
      App.Log('insert id = 8', App._T.num(id) && id == 8 ? '🟢' : '🔴');
      
      let rows = await App.SqlLite('User').all()
      App.Log('all len = 8', Array.isArray(rows) && rows.length == 8 ? '🟢' : '🔴');

      result = await App.SqlLite('User').clear()
      App.Log('clear', App._T.bool(result) && result ? '🟢' : '🔴');

      rows = await App.SqlLite('User').all()
      App.Log('all len = 0', Array.isArray(rows) && rows.length == 0 ? '🟢' : '🔴');

      const ids = await Promise.all([
        App.SqlLite('User').param({ name: 'OA', age: 30, score: 10.2 }).insert(),
        App.SqlLite('User').param({ name: 'OB', age: 7, score: 0.9 }).insert(),
        App.SqlLite('User').param({ name: 'OC', age: 30, score: 100.34 }).insert(),
        App.SqlLite('User').param({ name: 'OD', age: 25, score: 45.0 }).insert(),
        App.SqlLite('User').param({ name: 'OE', age: 30, score: 49.8 }).insert(),
        App.SqlLite('User').param({ name: 'OF', age: 30, score: 40 }).insert(),
        App.SqlLite('User').param({ name: 'OF', age: 30, score: 43 }).insert(),
      ])
      
      App.Log('inserts len = 7', Array.isArray(ids) && ids.length == 7 ? '🟢' : '🔴', ids);
    
      rows = await App.SqlLite('User')
        .where('age', 30)
        .where('score', '<', 50)
        .where('id', [1, 6, 7])
        .select('id', 'name', 'age')
        .order('id DESC')
        .limit(3)
        .offset(1)
        .all()

      App.Log('all len = 2', Array.isArray(rows) && rows.length == 2 ? '🟢' : '🔴');

      let row = await App.SqlLite('User')
        .where(3)
        .one()

      App.Log('one id = 3', App._T.obj(row) && row.id == 3 ? '🟢' : '🔴');

      row = await App.SqlLite('User')
        .where(1000)
        .one()

      App.Log('one null', row === null ? '🟢' : '🔴');

      result = await App.SqlLite('User').param({
        name: 'X',
        score: 0.1
      })
        .where('age', 30)
        .where('score', '<', 50)
        .where('id', [1, 6, 7])
        .order('id DESC')
        .offset(1)
        .limit(3)
        .update()

      App.Log('update id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴')

      rows = await App.SqlLite('User')
        .where('id', [1, 6, 7])
        .select('id', 'score', 'name')
        .order('id DESC')
        .all()

      if (Array.isArray(rows)) {
        App.Log('all len = 3 (7 name) != X, (6,1 name) = x',
          rows.length == 3 ? '🟢' : '🔴',
          rows[0].id == 7 ? '🟢' : '🔴',
          rows[0].score != 0.1 ? '🟢' : '🔴',
          rows[0].name != 'X' ? '🟢' : '🔴',

          rows[1].id == 6 ? '🟢' : '🔴',
          rows[1].score == 0.1 ? '🟢' : '🔴',
          rows[1].name == 'X' ? '🟢' : '🔴',
          
          rows[2].id == 1 ? '🟢' : '🔴',
          rows[2].score == 0.1 ? '🟢' : '🔴',
          rows[2].name == 'X' ? '🟢' : '🔴',

          rows.map(({ id }) => id)
        )
      } else {
        App.Log('all', '🔴')
      }

      result = await App.SqlLite('User')
        .where('id', [1, 6, 7])
        .order('id DESC')
        .offset(1)
        .limit(3)
        .delete()

      App.Log('delete id = 6,1', App._T.bool(result) && result ? '🟢' : '🔴')

      rows = await App.SqlLite('User')
        .where('id', [1, 6, 7])
        .select('id', 'score', 'name')
        .order('id DESC')
        .all()

      if (Array.isArray(rows)) {
        App.Log('all len = 1, id = 7',
          rows.length == 1 ? '🟢' : '🔴',
          rows[0].id == 7 ? '🟢' : '🔴',
          rows[0].score != 0.1 ? '🟢' : '🔴',
          rows[0].name != 'X' ? '🟢' : '🔴',
        )
      } else {
        App.Log('all', '🔴')
      }

      let count = await App.SqlLite('User')
        .where('id', [1, 6, 7])
        .order('id DESC')
        .count()

      App.Log('count len = 1', App._T.num(count) && count == 1 ? '🟢' : '🔴');
      
      result = await App.SqlLite('User').clear()
      App.Log('clear', App._T.bool(result) && result ? '🟢' : '🔴');

      count = await App.SqlLite('User')
        .where('id', [1, 6, 7])
        .order('id DESC')
        .count()

      App.Log('count len = 0', App._T.num(count) && count == 0 ? '🟢' : '🔴');

      App.Log('==================');
      App.Log(Date.now() - sTime)
      App.Log('==================');
    },

    async _test_orm_Queue () {
      let User = App.SqlLite.Model('User')
      let sTime = null
      Queue()
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
            next(tables)
          })
        })
        .enqueue((next, tables) => {

          let q = Queue()
          for (const table of tables) {
            q.enqueue(_next => App.SqlLite(table).drop(result => {
              if (result instanceof Error) {
                App.Log('drop', '🔴');
                return
              }
              App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴');
              _next()
            }))
          }
          q.enqueue(_next => next())
        })
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables len = 0', Array.isArray(tables) && tables.length == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .columns({
              id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
              name: 'TEXT',
              age: 'INTEGER',
              score: 'DOUBLE',
            })
            .create(result => {
              if (result instanceof Error) {
                App.Log('create', '🔴');
                return
              }
              App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
        })
        .enqueue(next => {
          sTime = Date.now()
          next()
        })
        .enqueue(next => {
          User.create({ name: 'OCX', age: 30, score: 10.2 }, user => {
            if (user instanceof Error) {
              App.Log('create', '🔴');
              return
            }
            if (user === null) {
              App.Log('create', '🔴');
              return
            }
            App.Log('create id = 1', user.id == 1 && user.name == 'OCX' ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.create({ name: 'OA', age: 30, score: 10.2 }, user => {
            if (user instanceof Error) {
              App.Log('create', '🔴');
              return
            }
            if (user === null) {
              App.Log('create', '🔴');
              return
            }
            App.Log('create id = 2', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.create({ name: 'xA', age: 30, score: 10.2 }, user => {
            if (user instanceof Error) {
              App.Log('create', '🔴');
              return
            }
            if (user === null) {
              App.Log('create', '🔴');
              return
            }
            App.Log('create id = 3', user.id == 3 && user.name == 'xA' ? '🟢' : '🔴');
            next(user)
          })
        })
        .enqueue((next, user) => {
          user.name = 'OB'
          user.save(user => {
            if (user instanceof Error) {
              App.Log('save', '🔴');
              return
            }
            App.Log('save id = 3 name = OB', user.id == 3 && user.name == 'OB' ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.one(10000, user => {
            if (user instanceof Error) {
              App.Log('one', '🔴');
              return
            }
            App.Log('one null', user === null ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.one(2, user => {
            if (user instanceof Error) {
              App.Log('one', '🔴');
              return
            }
            App.Log('one id = 2 name = OA', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');
            next(user)
          })
        })
        .enqueue((next, user) => {
          user.name = 'Oc'
          user.save(user => {
            if (user instanceof Error) {
              App.Log('save', '🔴');
              return
            }
            App.Log('save id = 2 name = Oc', user.id == 2 && user.name == 'Oc' ? '🟢' : '🔴');  
            next(user)
          })
        })
        .enqueue(next => {
          User.order('id DESC').all(users => {
            if (users instanceof Error) {
              App.Log('all', '🔴');
              return
            }
            App.Log('all len = 3, 3 name = OB, 2 name = Oc, 1 name = OCX',
              users.length == 3 ? '🟢' : '🔴',
              users[0].id == 3 && users[0].name == 'OB' ? '🟢' : '🔴',
              users[1].id == 2 && users[1].name == 'Oc' ? '🟢' : '🔴',
              users[2].id == 1 && users[2].name == 'OCX' ? '🟢' : '🔴');

            next(users[1])
          })
        })
        .enqueue((next, user) => {
          user.name = 'oD'
          user.save(user => {
            if (user instanceof Error) {
              App.Log('save', '🔴');
              return
            }
            App.Log('save id = 2, name = oD', user.id == 2 && user.name == 'oD' ? '🟢' : '🔴');
            next(user)
          })
        })
        .enqueue((next, user) => {
          User.count(count => {
            if (count instanceof Error) {
              App.Log('count', '🔴');
              return
            }
            App.Log('count = 3', count == 3 ? '🟢' : '🔴');
            next(user)
          })
        })
        .enqueue((next, user) => {
          user.delete(user => {
            if (user instanceof Error) {
              App.Log('delete', '🔴');
              return
            }
            App.Log('delete id = 2', user.id == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.where([1,2,3]).all(users => {
            if (users instanceof Error) {
              App.Log('all', '🔴');
              return
            }

            App.Log('all len = 2, 1 name = OCX, 3 name = OB',
              users.length == 2 ? '🟢' : '🔴',
              users[0].id == 1 && users[0].name == 'OCX' ? '🟢' : '🔴',
              users[1].id == 3 && users[1].name == 'OB' ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          User.count(count => {
            if (count instanceof Error) {
              App.Log('count', '🔴');
              return
            }

            App.Log('count = 2', count == 2 ? '🟢' : '🔴');
            next()
          })

        })
        .enqueue(next => {
          User.clear(result => {
            if (result instanceof Error) {
              App.Log('clear', '🔴');
              return
            }
            App.Log('clear', result ? '🟢' : '🔴');
            next()
          })
              
        })
        .enqueue(next => {        
          User.count(count => {
            if (count instanceof Error) {
              App.Log('count', '🔴');
              return
            }
            App.Log('count = 0', count == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.Log('==================');
          App.Log(Date.now() - sTime)
          App.Log('==================');
        })
    },
    async _test_orm_Promise () {
      let tables = await App.SqlLite().tables()
      App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
      
      for (const table of tables || []) {
        let result = await App.SqlLite(table).drop()
        App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴');
      }

      tables = await App.SqlLite().tables()
      App.Log('tables len = 0', Array.isArray(tables) && tables.length == 0 ? '🟢' : '🔴');

      let result = await App.SqlLite('User')
        .columns({
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          name: 'TEXT',
          age: 'INTEGER',
          score: 'DOUBLE',
        })
        .create()

      App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴');


      let sTime = Date.now()
      let User = App.SqlLite.Model('User')
      let user = await User.create({ name: 'OCX', age: 30, score: 10.2 })
      if (user === null) { return App.Log('create', '🔴'); }
      App.Log('create id = 1', user.id == 1 && user.name == 'OCX' ? '🟢' : '🔴');
      
      user = await User.create({ name: 'OA', age: 30, score: 10.2 })
      if (user === null) { return App.Log('create', '🔴'); }
      App.Log('create id = 2', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');
      
      user = await User.create({ name: 'xA', age: 30, score: 10.2 })
      if (user === null) { return App.Log('create', '🔴'); }
      App.Log('create id = 3', user.id == 3 && user.name == 'xA' ? '🟢' : '🔴');
      
      user.name = 'OB'
      user = await user.save()
      App.Log('save id = 3 name = OB', user.id == 3 && user.name == 'OB' ? '🟢' : '🔴');

      user = await User.one(1000)
      App.Log('one null', user === null ? '🟢' : '🔴');

      user = await User.one(2)
      App.Log('one id = 2 name = OA', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');

      user.name = 'Oc'
      user = await user.save()
      App.Log('save id = 2 name = Oc', user.id == 2 && user.name == 'Oc' ? '🟢' : '🔴');

      let users = await User.order('id DESC').all()
      App.Log('all len = 3, 3 name = OB, 2 name = Oc, 1 name = OCX',
        users.length == 3 ? '🟢' : '🔴',
        users[0].id == 3 && users[0].name == 'OB' ? '🟢' : '🔴',
        users[1].id == 2 && users[1].name == 'Oc' ? '🟢' : '🔴',
        users[2].id == 1 && users[2].name == 'OCX' ? '🟢' : '🔴');
                    
      users[1].name = 'oD'
      user = await users[1].save()
      App.Log('save id = 2, name = oD', user.id == 2 && user.name == 'oD' ? '🟢' : '🔴');

      let count = await User.count()
      App.Log('count = 3', count == 3 ? '🟢' : '🔴');
                      
      user = await user.delete()
      App.Log('delete id = 2', user.id == 0 ? '🟢' : '🔴');
      
      users = await User.where([1,2,3]).all()
      App.Log('all len = 2, 1 name = OCX, 3 name = OB',
        users.length == 2 ? '🟢' : '🔴',
        users[0].id == 1 && users[0].name == 'OCX' ? '🟢' : '🔴',
        users[1].id == 3 && users[1].name == 'OB' ? '🟢' : '🔴');

      count = await User.count()
      App.Log('count = 2', count == 2 ? '🟢' : '🔴');

      result = await User.clear()
      App.Log('clear', result ? '🟢' : '🔴');
                  
      count = await User.count()
      App.Log('count = 0', count == 0 ? '🟢' : '🔴');

      App.Log('==================');
      App.Log(Date.now() - sTime)
      App.Log('==================');
    },
    async _test_orm_Callback () {
      let User = App.SqlLite.Model('User')
      Queue()
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables', Array.isArray(tables) ? '🟢' : '🔴');
            next(tables)
          })
        })
        .enqueue((next, tables) => {
          let q = Queue()
          for (const table of tables) {
            q.enqueue(_next => App.SqlLite(table).drop(result => {
              if (result instanceof Error) {
                App.Log('drop', '🔴');
                return
              }
              App.Log('drop', App._T.bool(result) && result ? '🟢' : '🔴');
              _next()
            }))
          }
          q.enqueue(_next => next())
        })
        .enqueue(next => {
          App.SqlLite().tables(tables => {
            if (tables instanceof Error) {
              App.Log('tables', '🔴');
              return
            }

            App.Log('tables len = 0', Array.isArray(tables) && tables.length == 0 ? '🟢' : '🔴');
            next()
          })
        })
        .enqueue(next => {
          App.SqlLite('User')
            .columns({
              id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
              name: 'TEXT',
              age: 'INTEGER',
              score: 'DOUBLE',
            })
            .create(result => {
              if (result instanceof Error) {
                App.Log('create', '🔴');
                return
              }
              App.Log('create', App._T.bool(result) && result ? '🟢' : '🔴');
              next()
            })
        })

        .enqueue(next => {
          let sTime = Date.now()

          User.create({ name: 'OCX', age: 30, score: 10.2 }, user => {
            if (user instanceof Error) {
              App.Log('create', '🔴');
              return
            }
            App.Log('create id = 1', user.id == 1 && user.name == 'OCX' ? '🟢' : '🔴');
            User.create({ name: 'OA', age: 30, score: 10.2 }, user => {
              if (user instanceof Error) {
                App.Log('create', '🔴');
                return
              }
              App.Log('create id = 2', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');
              User.create({ name: 'xA', age: 30, score: 10.2 }, user => {
                if (user instanceof Error) {
                  App.Log('create', '🔴');
                  return
                }
                App.Log('create id = 3', user.id == 3 && user.name == 'xA' ? '🟢' : '🔴');
                user.name = 'OB'
                user.save(user => {
                  if (user instanceof Error) {
                    App.Log('save', '🔴');
                    return
                  }
                  App.Log('save id = 3 name = OB', user.id == 3 && user.name == 'OB' ? '🟢' : '🔴');

                  User.one(100000, user => {
                    if (user instanceof Error) {
                      App.Log('one', '🔴');
                      return
                    }
                    App.Log('one null', user === null ? '🟢' : '🔴');

                    User.one(2, user => {
                      if (user instanceof Error) {
                        App.Log('one', '🔴');
                        return
                      }
                      App.Log('one id = 2 name = OA', user.id == 2 && user.name == 'OA' ? '🟢' : '🔴');
                      user.name = 'Oc'
                      user.save(user => {
                        if (user instanceof Error) {
                          App.Log('save', '🔴');
                          return
                        }
                        App.Log('save id = 2 name = Oc', user.id == 2 && user.name == 'Oc' ? '🟢' : '🔴');  
                        User.order('id DESC').all(users => {
                          if (users instanceof Error) {
                            App.Log('all', '🔴');
                            return
                          }
                          App.Log('all len = 3, 3 name = OB, 2 name = Oc, 1 name = OCX',
                            users.length == 3 ? '🟢' : '🔴',
                            users[0].id == 3 && users[0].name == 'OB' ? '🟢' : '🔴',
                            users[1].id == 2 && users[1].name == 'Oc' ? '🟢' : '🔴',
                            users[2].id == 1 && users[2].name == 'OCX' ? '🟢' : '🔴');

                          users[1].name = 'oD'
                          users[1].save(user => {
                            if (user instanceof Error) {
                              App.Log('save', '🔴');
                              return
                            }
                            App.Log('save id = 2, name = oD', user.id == 2 && user.name == 'oD' ? '🟢' : '🔴');
                            User.count(count => {
                              if (count instanceof Error) {
                                App.Log('count', '🔴');
                                return
                              }
                              App.Log('count = 3', count == 3 ? '🟢' : '🔴');
                              user.delete(user => {
                                if (user instanceof Error) {
                                  App.Log('delete', '🔴');
                                  return
                                }
                                App.Log('delete id = 2', user.id == 0 ? '🟢' : '🔴');
                                User.where([1,2,3]).all(users => {
                                  if (users instanceof Error) {
                                    App.Log('all', '🔴');
                                    return
                                  }

                                  App.Log('all len = 2, 1 name = OCX, 3 name = OB',
                                    users.length == 2 ? '🟢' : '🔴',
                                    users[0].id == 1 && users[0].name == 'OCX' ? '🟢' : '🔴',
                                    users[1].id == 3 && users[1].name == 'OB' ? '🟢' : '🔴');
                                  
                                  User.count(count => {
                                    if (count instanceof Error) {
                                      App.Log('count', '🔴');
                                      return
                                    }

                                    App.Log('count = 2', count == 2 ? '🟢' : '🔴');
                                    User.clear(result => {
                                      if (result instanceof Error) {
                                        App.Log('clear', '🔴');
                                        return
                                      }
                                      App.Log('clear', result ? '🟢' : '🔴');
                                      User.count(count => {
                                        if (count instanceof Error) {
                                          App.Log('count', '🔴');
                                          return
                                        }
                                        App.Log('count = 0', count == 0 ? '🟢' : '🔴');
                                        

                                        App.Log('==================');
                                        App.Log(Date.now() - sTime)
                                        App.Log('==================');
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
        
    },

    async _migration (func) {

      let tables = await App.SqlLite().tables()
      for (const table of tables) {
        await App.SqlLite(table).drop()
      }
      App.Log('🟢 Drop Tables - ok')

      await App.SqlLite(PointTool.schema.date.table).columns(PointTool.schema.date.columns).create()
      App.Log(`🟢 Create ${PointTool.schema.date.table} - ok`)
      for (const sql of PointTool.schema.date.indexes) {
        await App.SqlLite().sql(sql).exec()
        App.Log(`🔵 Create index ${sql} on ${PointTool.schema.date.table} - ok`)
      }

      await App.SqlLite(PointTool.schema.activity.table).columns(PointTool.schema.activity.columns).create()
      App.Log(`🟢 Create ${PointTool.schema.activity.table} - ok`)
      for (const sql of PointTool.schema.activity.indexes) {
        await App.SqlLite().sql(sql).exec()
        App.Log(`🔵 Create index ${sql} on ${PointTool.schema.activity.table} - ok`)
      }

      await App.SqlLite(PointTool.schema.point.table).columns(PointTool.schema.point.columns).create()
      App.Log(`🟢 Create ${PointTool.schema.point.table} - ok`)
      for (const sql of PointTool.schema.point.indexes) {
        await App.SqlLite().sql(sql).exec()
        App.Log(`🔵 Create index ${sql} on ${PointTool.schema.point.table} - ok`)
      }

      tables = await App.SqlLite().tables()
      App.Log('🟢', ...tables);
      
      func()
    },

    

    async _run2 (url, activity, date, points, done1, done2) {
      
      const obj = {
        url: url,
        areas: ['', '', '', '', ''],
        progress: ''
      }
      this.strs.push(obj)
      

      const [ year, month, day ] = date.split('.')
      const [ hour, min, sec ] = activity.split(':')
      
      // console.error(year, month, day);

      const DateModel = App.SqlLite.Model('Date')
      const ActivityModel = App.SqlLite.Model('Activity')
      const PointModel = App.SqlLite.Model('Point')
      
      let _date = await DateModel
        .where('year', year * 1)
        .where('month', month * 1)
        .where('day', day * 1)
        .one()

      if (!(_date instanceof DateModel)) {
        _date = await DateModel.create({
          year: year * 1,
          month: month * 1,
          day: day * 1,
        })
      }

      if (!(_date instanceof DateModel)) {
        obj.progress = 'Error.'
        return App.Log('🔴')
      }

      obj.areas[0] = `Date:${_date.id}`
      obj.areas.push()

      const _activity = await ActivityModel.create({
        dateId: _date.id,
        title: `${Helper.pad0(_date.year, 4)}/${Helper.pad0(_date.month, 2)}/${Helper.pad0(_date.day, 2)} ${Helper.pad0(hour * 1, 2)}:${Helper.pad0(min * 1, 2)}:${Helper.pad0(sec * 1, 2)}`,
        hour: hour * 1,
        min: min * 1,
        sec: sec * 1,
      })

      obj.areas[1] = `Activity:${_activity.id}`
      obj.areas.push()


      _date.cntActivities += 1
      await _date.save()

      done1 && done1()
      
      const total = points.length
      let time = 0

      let last = null
      for (let i in points) {
        i = i * 1

        let sTime = Date.now()
        // if (points[i].accS !== null && points[i].speed !== null) {
        //   console.error(typeof points[i].accS);
        //   return
        // }

        let struct = PointTool.postfromJson(_date, _activity, points[i], last)

        if (struct === null) {
          continue
        }
        
        last = struct

        let _point = await PointModel.create(struct)
        // console.error(struct, _point)
        // return
        
        _activity.timeGps = _point.time
        _activity.cntAccLevel0Points += (_point.accLevel >= 0 ? 1 : 0)
        _activity.cntAccLevel1Points += (_point.accLevel >= 1 ? 1 : 0)
        _activity.cntAccLevel2Points += (_point.accLevel >= 2 ? 1 : 0)
        _activity.cntAccLevel3Points += (_point.accLevel >= 3 ? 1 : 0)
        _activity.cntAccLevel4Points += (_point.accLevel >= 4 ? 1 : 0)
        _activity.cntAccLevel5Points += (_point.accLevel >= 5 ? 1 : 0)
        // _activity.cntValid0Points += 1

        // if (_point.valid1 == 1) {
        //   _activity.cntValid1Points += 1
        // }
        // if (_point.valid2 == 1) {
        //   _activity.cntValid2Points += 1
        // }
        await _activity.save()

        time += Date.now() - sTime
        
        if (i % 5 == 0) {
          obj.areas[2] = `Point:${_point.id}`
          obj.areas[3] = `${i + 1} / ${total}`
        
          let percent = Helper.round((((i * 1) + 1) / total) * 100, 2)
          obj.areas[4] = `${percent} %`
          obj.areas.push()

          let uTime = Helper.round(time / (i + 1))
          let dCount = total - (i + 1)
          obj.progress = `${uTime}ms/point | ${Helper.timeFormat(dCount * uTime)} | ${Helper.date('Y-m-d H:i:s', new Date(Date.now() + dCount * uTime))}`
        }
        _point = null
      }
      
      done2 && done2()
    },
    click () {
      const url = `${window.baseUrl}Log.html`
      
      // if (window.Bridge.type === 'Web') {
      //   return window.location.assign(url)
      // }
      
      const web = App.VC.View.Web(url)
        .navBarTitle('活動內容')
        .navBarAppearance('auto')
        .tabBarAppearance('auto')

      // App.VC.Nav.Push(web).emit()
      App.VC.Present(web).isNavigation(true).isFullScreen(false).emit()
    }
  },
  template: `
    main#app => @scroll=scroll
      label#click => *text='click'   @click=click
      #content
        .file => *for=({url, areas, progress}, i) in strs   :key=i
          b => *text=url
          div.units
            span => *text=areas[0]
            span => *text=areas[1]
            span => *text=areas[2]
            span => *text=areas[3]
            span => *text=areas[4]
          div.progress => *if=progress !== ''   *text=progress

      `
})
