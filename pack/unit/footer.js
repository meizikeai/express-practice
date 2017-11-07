import "../css/footer.css";

export default function () {
    let that = document.querySelectorAll(".model-footer .mian a");
    let pathname = location.pathname;

    that.forEach((e, k) => {
        let href = e.getAttribute("href");
        if (pathname == href) {
            e.className = e.className + " cursor";
        } else {
            e.className = e.className.replace(/cursor/ig, "");
        }
    });
}