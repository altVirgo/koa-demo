async function getData() {
    // throw "2";
    return '这是一个数据';
}


let a = getData();
console.log(getData());
a.then((res) => {
    console.log(res);
}).catch((exp) => {
    console.log("exp:",exp);
});
// var b = await getData();
// console.log(b);

async function test() {
    console.log(1);
    let b = await getData();
    console.log(b);
    console.log(2);
}

test();