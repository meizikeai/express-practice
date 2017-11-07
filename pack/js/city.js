import "../unit/reset";
import Header from "../unit/header";
import Position from "../unit/position";
import "../css/city.css";

$(() => {

    Header();

    Position.getPosition((val) => {
        $(".app-city .check span").html(val);
    });

    let list = $(".app-city .list");
    list.on("click", ".views", function (e) {
        let that = $(this);
        localStorage.city = JSON.stringify({
            name: that.html(),
            code: that.attr("data-code")
        });

        setTimeout(() => window.history.back(), 300);
    });

});