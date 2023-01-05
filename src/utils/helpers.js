const Moment = require("moment");
(MomentRange = require("moment-range")),
  (moment = MomentRange.extendMoment(Moment));
moment.suppressDeprecationWarnings = true;


module.exports = {
    listMethodsSequelizeModel(sequelizeModel)
    {
      //Reference:
      //https://sequelize.org/master/manual/assocs.html#-code-foo-hasmany-bar---code-
      //https://gist.github.com/Ivan-Feofanov/eefe489a2131f3ec43cfa3c7feb36490
        const model = sequelizeModel
        console.log('===============================');
        console.log('Model Name: '+model.name);
        console.log('List of association methods:\n');
        for (let assoc of Object.keys(model.associations)) {
          for (let accessor of Object.keys(model.associations[assoc].accessors)) {
            console.log(model.name + '.' + model.associations[assoc].accessors[accessor]+'()');
          }
        }
    },
    debugReq: async (req, res, next) => {
      console.log("reqDebug",req)
    },
    epochDateTimeParser(startDate, finalDate)
    {
      const today = moment().format('YYYY-MM-DD HH:mm:ss');


      let date = new Date(Number(startDate));
      let hr = date.getHours();
      let min = date.getMinutes();
      let seg = date.getMinutes();
      if (hr < 10) {
        hr = "0" + hr;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (seg < 10) {
        seg = "0" + seg;
      }
      startDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate()))
        .slice(-2) +
        " " + hr +
        ":" + min +
        ":" + seg;

      if (finalDate != 'null') {
        let date = new Date(Number(finalDate));
        let hr = date.getHours();
        let min = date.getMinutes();
        let seg = date.getMinutes();
        if (hr < 10) {
          hr = "0" + hr;
        }
        if (min < 10) {
          min = "0" + min;
        }
        if (seg < 10) {
          seg = "0" + seg;
        }

        finalDate = date = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate()))
          .slice(-2) +
          " " + hr +
          ":" + min +
          ":" + seg;
      } else {
        finalDate = today;
      }

      return {"formattedStartDate":startDate,"formattedFinalDate": finalDate}
    }

  
}