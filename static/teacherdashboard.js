function changematter1() {
    const form1 = document.getElementById("matter1")
    const form2 = document.getElementById("matter2")
    const form3 = document.getElementById("matter3")
    // form1 change
    if (form1.style.display != "none") {
        form1.style.display = "none";

    }
    if (form1.style.display = "none") {
        form1.style.display = "block";
        form2.style.display = "none";
        form3.style.display = "none";
    }
}

function changematter2() {
    const form1 = document.getElementById("matter1")
    const form2 = document.getElementById("matter2")
    const form3 = document.getElementById("matter3")
    // form2 change
    if (form2.style.display != "none") {
        form2.style.display = "none";

    }
    if (form2.style.display = "none") {
        form2.style.display = "block";
        form1.style.display = "none";
        form3.style.display = "none";
    }
}

function changematter3() {
    const form1 = document.getElementById("matter1")
    const form2 = document.getElementById("matter2")
    const form3 = document.getElementById("matter3")
    // form3 change
    if (form3.style.display != "none") {
        form3.style.display = "none";

    }
    if (form3.style.display = "none") {
        form3.style.display = "block";
        form2.style.display = "none";
        form1.style.display = "none";
    }
}