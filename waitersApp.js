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
        console.log(weekdays);

        waiters.availability.findOneAndUpdate({
            name: waiterId
        }, {
            Day: weekdays
        }, function(err, result) {
            if (err) {
                return done(err)
            }

            if (result == null) {
                waiters.availability.create({
                    name: waiterId,
                    Day: weekdays
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
                    //console.log(waiterName);
                    //console.log(workingdays);

                    for (var k = 0; k < workingdays.length; k++) {
                        // console.log("**********");
                        // console.log(workingdays);
                        if (workingdays[k] == 'Monday') {
                            mondayShift.push(waiterName);
                            console.log("--------");
                            console.log(mondayShift);
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

                //console.log(mondayShift);
                res.render('days', {
                    Monday: mondayShift,
                    Tuesday: tuesdayShift,
                    Wednesday: wednesdayShift,
                    Thursday: thursdayShift,
                    Friday: fridayShift,
                    Saturday: saturdayShift,
                    Sunday:sundayShift

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
