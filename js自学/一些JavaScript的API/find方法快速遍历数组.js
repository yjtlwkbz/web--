//find就是循环一个数组，然后执行传进参数里的函数进行一些【判断】，当【判断】为真时就返回当前这个数组成员
//注意：1、它返回的是第一个符合条件的成员，如果这个数组后面还有符合的也不管了
//     2、注意参数函数必须是return返回！因为find()函数底层逻辑是将这个函数返回的内容在if里判断，真就return当前遍历到的成员
//     3、find的函数参数返回的值必须是布尔值，可以是true或false或者一个判断表达式
const nums = [1,2,3,3,4]
let newNums = nums.find((x)=>{
    return x > 2
})
console.log(newNums) // ——> 这里就返回第一个大于2的数，也就是数组里第一个3



//结合set方法
//首先用set获得一个去重后的数组
const set = new Set(nums);// ——> [1,2,3,4]

let newArr =  nums.find((x)=>{
    return !set.delete(x)
    //这里遍历原数组nums的每一个成员[1,2,3,3,4]
    //然后在去重数组set[1,2,3,4]里一个一个删除
    //第一次删除1，set：[2,3,4]，并返回true，然后find这里返回相反的false，find不做反应接着遍历
    //第二次删除2，set：[3,4]，并返回true，然后find这里返回相反的false，find不做反应接着遍历
    //第三次删除3，set：[4]，并返回true，然后find这里返回相反的false，find不做反应接着遍历
    //第四次删除3，set：没有3了，并返回false，然后find这里返回相反的true，find的if判断到true，直接返回3
});

console.log(newArr) // ——> 找到原数组里重复的3
console.log(set) //因为find遍历到4前面的3就返回结束了，所有set还剩4没删