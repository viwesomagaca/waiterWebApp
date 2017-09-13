module.exports = function(waiters) {
    var waiterModel = waiters.availability

    const avail = function(req, res, done) {
        res.render("index");
    }
    const usernames = function(req, res, done) {
        var waiterId = req.params.id
        var firstL = req.params.id.substring(0,1)
        var caps = req.params.id.substring(0,1).toUpperCase();

        if(!waiterId){
            req.flash("error","Please insert waiter name on your Parameter");
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
        if(!waiterUsername){
            req.flash("error","Please insert waiter name on your Parameter");
            res.render('index')
        } else
        if(weekdays.length < 3){
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
                   message = "Hello, " + waiterId + " Please select 3 working Days!";
                    var display = {
                        name: result.name,
                        Day: result.Day,
                        message:message
                    }
                    res.render("index", display)
                })
            }
            if (result !== null) {
                console.log("Already Exists");
                var message= "";
                 message = "Welcome back, " + waiterId + "."
                 console.log(message);
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

    const validation = function(req, res, done){

    }
    return {
        avail,
        usernames,
        update,
        admin
    }
}
