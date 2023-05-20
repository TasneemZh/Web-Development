exports.getDate = function() {
  let myDate = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  return myDate.toLocaleString("en-US", options);
}
