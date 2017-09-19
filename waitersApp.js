module.exports = function(waiters) {
    var waiterModel = waiters.availability

    const avail = function(req, res, done) {
        var waiterId = req.params.id
            var weekdays = req.body.weekdays;
        if(waiterId === undefined || weekdays === undefined){
            req.flash("error","Please insert waiter name on your URL");
            res.render('index')
        }
        //res.render("index");
    }
    const usernames = function(req, res, done) {
        var waiterId = req.params.id
        var weekdays = req.body.weekdays;
        var firstL = req.params.id.substring(0,1)
        var caps = req.params.id.substring(0,1).toUpperCase();

        if(waiterId == null && weekdays === undefined){
            req.flash("error","Please insert waiter name on your URL");
            res.render('index')
        }else{
        var message = "Hello, " + waiterId + " Please select 3 working Days!"
        res.render("index", {message: message})
    }
}
    const update = function(req, res, done) {
        var addWaiter = {};
        var weekdays = req.body.weekdays;
        var waiterId = req.params.id
        var firstL = req.params.id.substring(0,1)
        var caps = req.params.id.substring(0,1).toUpperCase();
        var waiterUsername ={
            name: waiterId.replace(firstL,caps)
        }
        if(waiterUsername == undefined && weekdays === undefined){
            req.flash("error","Please insert waiter name on your URL");
            res.render('index')
        } else
        if(waiterUsername && weekdays === undefined){
            req.flash("error","Please select your working days.");
            res.render('index')
        } else
        if(weekdays.length < 3 || weekdays.length == 0){
            req.flash("error","Please Tick 3 Days");
            res.render('index')
        }else
            if(weekdays.length > 3){
                req.flash("error","Please Tick only 3 Days.");
                res.render('index')
            }
         else if(waiterUsername && weekdays.length == 3){
        waiters.availability.findOneAndUpdate({
            name: waiterId.replace(firstL,caps)
        }, {
            Day: weekdays
        }, function(err, result) {
            if (err) {
                return done(err)
            }


            if (result == null) {
                waiters.availability.create({
                    name: waiterId.replace(firstL,caps),
                    Day: weekdays
                }, function(err, result) {
                    if (err) {
                        return done(err)
                    }
                    var message ="";
                   message = "Thank you for Joining Us! :) " + waiterId + ". Your working days have been submitted.";
                    var display = {
                        name: result.name,
                        Day: result.Day,
                        message:message
                    }
                    res.render("index", display)
                })
            }
            if (result !== null) {
                var message= "";
                 message = "Welcome back, " + waiterId + "."
                var display = {
                    name: result.name,
                    Day: result.Day,
                    message:message
                }
                res.render("index", display)
            }
        })
    }
    }

     function backgroundColor(waiterDays){
         if(waiterDays <3){
             return "needMore";
         }else
             if(waiterDays === 3){
                 return "enough";
             }else
                 if(waiterDays > 3){
                 return "warning";
             }
         }


    const admin = function(req, res, done) {
        var mondayShift = [];
        var tuesdayShift = [];
        var wednesdayShift = [];
        var thursdayShift = [];
        var fridayShift = [];
        var saturdayShift = [];
        var sundayShift = [];

        waiters.availability.find({}, function(err, output) {
            if (err) {
                return done(err)
            }else{
                for (var i = 0; i < output.length; i++) {
                    var waiterName = output[i].name;
                    var workingdays = output[i].Day;

                    for (var k = 0; k < workingdays.length; k++) {
                        if (workingdays[k] == 'Monday') {
                            mondayShift.push(waiterName);
                        } else if (workingdays[k] == 'Tuesday') {
                            tuesdayShift.push(waiterName);
                        } else if (workingdays[k] == 'Wednesday') {
                            wednesdayShift.push(waiterName);
                        } else if (workingdays[k] == "Thursday") {
                            thursdayShift.push(waiterName);
                        } else if (workingdays[k] == 'Friday') {
                            fridayShift.push(waiterName);
                        } else if (workingdays[k] == 'Saturday') {
                            saturdayShift.push(waiterName);
                        } else if (workingdays[k] == 'Sunday') {
                            sundayShift.push(waiterName);
                        }
                    }
                }


                res.render('days', {
                    Monday: mondayShift,
                    mondayColor: backgroundColor(mondayShift.length),

                    Tuesday: tuesdayShift,
                    tuesdayColor:backgroundColor(tuesdayShift.length),

                    Wednesday: wednesdayShift,
                    wednesdayColor: backgroundColor(wednesdayShift.length),

                    Thursday: thursdayShift,
                    thursdayColor: backgroundColor(thursdayShift.length),

                    Friday: fridayShift,
                    fridayColor: backgroundColor(fridayShift.length),

                    Saturday: saturdayShift,
                    saturdayColor: backgroundColor(saturdayShift.length),

                    Sunday:sundayShift,
                    sundayColor: backgroundColor(sundayShift.length)

                })

            }
        })

    }

    const clear = function(req, res, done){
        waiters.availability.find({}, function(err,result){
            if(err){
                return done(err)
            }
            console.log("it works!")
            res.render('days')
        })
    }


    return {
        avail,
        usernames,
        update,
        admin,
        backgroundColor,
        clear
    }
}
