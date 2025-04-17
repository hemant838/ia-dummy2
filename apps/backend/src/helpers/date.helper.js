const moment = require("moment");

const nowDateTime = () => {
  const isoDate = new Date().toISOString();
  const theDate = isoDate.substr(0, 10);
  const theTime = isoDate.substr(11, 8);
  return `${theDate} ${theTime}`;
}

const formatDate = (date, format) => moment(date).format(format);

const formatDateToTimezone = (date, timezone, format) => moment(date).tz(timezone).
  format(format);

const humanizeDatetime = (date, timezone, format = "12H") => {
  let formatDateTemplate = "MMMM Do YYYY, h:mm:ss a";
  if (format === "24H") formatDateTemplate = "MMMM Do YYYY, HH:mm:ss";

  if (!date) return null;
  return formatDateToTimezone(date, timezone, formatDateTemplate);
}

module.exports = {
  formatDate,
  formatDateToTimezone,
  humanizeDatetime,
  nowDateTime
}