DB._clear(_ => {
        
        const now = new Date()

        DB.Date.create({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          cntActivities: 0,
        }, (e, d) => {
          console.error('create', e, d, d.year);

          DB.Date.all((e, d) => {
            console.error('all', e, d, d[0].year);

            d[0].year = 3
            d[0].save((e, d) => {
              console.error('save', e, d.year);

              DB.Date.one(1, (e, d) => {
                console.error('one', e, d.year);

                d.delete((e, d) => {
                  console.error('delete', e, d.year);

                  DB.Date.count((e, d) => {
                    console.error('count', e, d);
                    
                    DB.Date.create({
                      year: 1,
                      month: 2,
                      day: 3,
                      cntActivities: 0,
                    }, (e, d) => {
                      console.error('create', e, d.year);
                      
                      DB.Date.create({
                        year: 2,
                        month: 2,
                        day: 3,
                        cntActivities: 0,
                      }, (e, d) => {
                        console.error('create', e, d.year);

                        DB.Date.create({
                          year: 3,
                          month: 2,
                          day: 3,
                          cntActivities: 0,
                        }, (e, d) => {
                          console.error('create', e, d.year);

                          DB.Date.create({
                            year: 2,
                            month: 2,
                            day: 3,
                            cntActivities: 0,
                          }, (e, d) => {
                            console.error('create', e, d.year);

                            DB.Date.first((e, d) => {
                              console.error('first', e, d.year);


                              DB.Date.where('ymd', [2,2,3]).all((e, d) => {

                                console.error('index all', d[0].year);
                                
                                DB.Date.where('ymd', [2,2,3]).count((e, d) => {
                                  console.error('index count', d);
                                  
                                  DB.Date.where('ymd', [2,2,3]).first((e, d) => {
                                    console.error('index first', d.year);
                                    
                                    DB.Date.clear((e, d) => {
                                      console.error('clear');  

                                      DB.Date.count((e, d) => {
                                        console.error('count', e, d);
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
      })