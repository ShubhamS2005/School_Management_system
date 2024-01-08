if(typeof message!=='undefined'){
    const span=document.getElementById('span');
    span.innerHTML = span.innerHTML.replace('',message);
}
function changeform1() {
    const form1 = document.getElementById("form1")
    const form2 = document.getElementById("form2")
    const form3 = document.getElementById("form3")
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
function changeform2() {
    const form1 = document.getElementById("form1")
    const form2 = document.getElementById("form2")
    const form3 = document.getElementById("form3")
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
function changeform3() {
    const form1 = document.getElementById("form1")
    const form2 = document.getElementById("form2")
    const form3 = document.getElementById("form3")
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
