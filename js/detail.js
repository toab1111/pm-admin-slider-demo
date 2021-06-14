function getSensorColor(pm25) {
    if (pm25 == null) {
        return "grey";
    } else if (pm25 >= 0 && pm25 <= 25) {
        return "blue";
        // } else if (pm25 > 30 && pm25 <= 50) {
        //   return "yellow";
    } else if (pm25 > 25 && pm25 <= 37) {
        return "green";
    } else if (pm25 > 37 && pm25 <= 50) {
        return "yellow";
    } else if (pm25 > 50 && pm25 <= 90) {
        return "orange";
    } else if (pm25 > 90) {
        return "red";
    } else return "";
}

function getColor(sensorColor) {
    if (sensorColor == "blue") {
        return "#19bbf7";
    } else if (sensorColor == "green") {
        return "#88b868";
    } else if (sensorColor == "yellow") {
        return "#d9d511";
    } else if (sensorColor == "orange") {
        return "#ffbf00";
    } else if (sensorColor == "red") {
        return "#dc1010";
    } else if (sensorColor == "grey") {
        return "lightgrey";
    } else return "";
}