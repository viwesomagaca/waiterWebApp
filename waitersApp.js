module.exports = function(waiters) {
    var waiterModel = waiters.availability

    const avail = function(req, res, done) {
        res.render("waiters");
    }
    const id = function(req, res, done) {
        var waiterId = req.params.id
        //    console.log(waiterId);
        res.render("index");
    }

    const usernames = function(req, res, done) {
        var waiterId = req.params.id;
                res.render("index")
            }

    const update = function(req, res, done) {
        var addWaiter = {};
        var waiterId = req.params.id
        var weekdays = req.body.weekdays;

        if (!Array.isArray(weekdays)) {
            weekdays = [weekdays];
        }
        weekdays.forEach(function(Day) {
            addWaiter[Day] = true;
        })
        waiters.availability.findOneAndUpdate({
            name: waiterId
        }, {
            Day: addWaiter
        }, function(err, result) {
            if (err) {
                return done(err)
            }

            if (result == null) {
                waiters.availability.create({
                    name: waiterId,
                    Day: addWaiter
                }, function(err, result) {
                    if (err) {
                        return done(err)
                    }

                    var display = {
                        name: result.name,
                        Day: result.Day
                    }
                    res.render("index", display)
                })
            }
            if (result !== null) {
                console.log("Already Exists");

                var display = {
                    name: result.name,
                    Day: result.Day
                }
                res.render("index", display)
            }
        })
    }
    const admin = function(req, res, done){
      waiters.availability.find({}, function(err,output){
          if(err){
              return done(err)
          }
         if(output){
             var details = [{
                 day : 'Monday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Tuesday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Wednesday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Thursday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Friday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Saturday',
                 waiter: [],
                 status:''
             },
             {
                 day : 'Sunday',
                 waiter: [],
                 status:''
             },
         ]
         for (var i = 0; i < output.length; i++) {
               var waiterName = output[i].name;
               var workingdays = output[i].Day;
               console.log('for i',waiterName);
               console.log('for i',workingdays);

               for (var k = 0; k < workingdays.length; k++) {
                   var selectedDay = workingdays[k];
                   if (selectedDay == 'Monday') {
                     details[0].waiter.push(waiterName);
                   }
                   else if (selectedDay == 'Tuesday') {
                     details[1].waiter.push(waiterName);
                   }
                   else if (selectedDay == 'Wednesday') {
                     details[2].waiter.push(waiterName);
                   }
                   else if(selectedDay == "Thursday"){
                       details[3].waiter.push(waiterName);
                   }
                   else if (selectedDay == 'Friday') {
                    details[4].waiter.push(waiterName);
                  }
                  else if (selectedDay == 'Saturday') {
                   details[5].waiter.push(waiterName);
                 }
                else if (selectedDay == 'Sunday') {
                     details[6].waiter.push(waiterName);
                 }
                 console.log(waiter);
               }
           }

           res.render('days', {
               Monday: details[0].waiter,
               Tuesday: details[1].waiter,
               Wednesday: details[2].waiter,
               Thursday: details[3].waiter,
               Friday: details[4].waiter,
               Saturday: details[5].waiter,
               Sunday: details[6].waiter,

           })
       }
   })

}


    return {
        avail,
        id,
        usernames,
        update,
        admin
    }
}
